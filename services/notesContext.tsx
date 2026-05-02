import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import React, { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

import {
  createNote,
  deleteNoteApi,
  getNotes,
  updateNoteApi,
} from "@/services/notesApi";

/* 🔥 ENUM */
export enum NoteStatus {
  ACTIVE = "active",
  TRASHED = "trashed",
}

/* 🔥 TYPE */
export type Note = {
  id: string;
  serverId?: number;

  title: string;
  content: string;
  color: string;
  createdDate: number;
  pinned: boolean;

  status: NoteStatus; // added, default active, can be active or trashed
  synced?: boolean;
  syncing?: boolean; // prevent duplicate API calls
};

/* 🔥 CONTEXT */
type NotesContextType = {
  notes: Note[];
  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  restoreNote: (id: string) => void;
  permanentlyDeleteNote: (id: string) => void;
};

const NotesContext = createContext<NotesContextType | null>(null);

const STORAGE_KEY = "TASKIT_NOTES";
const USER_ID = 1;

/* 🔥 SERVER CHECK */
const isServerReachable = async () => {
  try {
    await getNotes(USER_ID);
    return true;
  } catch {
    return false;
  }
};

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Clear storage for testing
  // useEffect(() => {
  //   AsyncStorage.removeItem("TASKIT_NOTES");
  // }, []);

  /* ========================= LOAD LOCAL ========================= */
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);

        if (stored) {
          const parsed = JSON.parse(stored);

          const normalized = parsed.map((n: any) => ({
            ...n,
            pinned: n.pinned ?? false,
            status: n.status ?? NoteStatus.ACTIVE,
            synced: n.synced ?? false,
            syncing: false,
          }));

          setNotes(normalized);
        }
      } catch (e) {
        console.log("Load failed", e);
      } finally {
        setLoaded(true);
      }
    };

    loadNotes();
  }, []);

  /* ========================= SERVER MERGE (FIXED) ========================= */
  useEffect(() => {
    const fetchServerNotes = async () => {
      try {
        const res = await getNotes(USER_ID);
        if (!res?.notes) return;

        setNotes((prev) => {
          const updated = [...prev];

          for (const s of res.notes) {
            const exists = updated.find(
              (n) =>
                n.serverId === s.id ||
                (n.title === s.title &&
                  n.content === s.content &&
                  Math.abs(n.createdDate - new Date(s.created_at).getTime()) <
                    2000),
            );

            if (!exists) {
              updated.push({
                id: uuid(),
                serverId: s.id,
                title: s.title,
                content: s.content,
                color: s.color,
                pinned: s.pinned,
                status: s.status,
                createdDate: new Date(s.created_at).getTime(),
                synced: true,
                syncing: false,
              });
            }
          }

          return updated;
        });
      } catch {
        console.log("Server fetch skipped");
      }
    };

    if (loaded) fetchServerNotes();
  }, [loaded]);

  /* ========================= SAVE LOCAL ========================= */
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes)).catch(console.log);
  }, [notes, loaded]);

  /* ========================= ADD ========================= */
  const addNote = (note: Note) => {
    setNotes((prev) => [
      {
        ...note,
        id: uuid(),
        serverId: undefined,
        status: NoteStatus.ACTIVE,
        synced: false,
        syncing: false,
      },
      ...prev,
    ]);
  };

  /* ========================= UPDATE ========================= */
  const updateNote = (updated: Note) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === updated.id ? { ...updated, synced: false } : n,
      ),
    );
  };

  /* ========================= TRASH ========================= */
  const deleteNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, status: NoteStatus.TRASHED, synced: false, syncing: false }
          : n,
      ),
    );
  };

  /* ========================= RESTORE ========================= */
  const restoreNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status: NoteStatus.ACTIVE, synced: false } : n,
      ),
    );
  };

  /* ========================= PERMANENT DELETE ========================= */
  const permanentlyDeleteNote = async (id: string) => {
    const note = notes.find((n) => n.id === id);

    if (note?.serverId) {
      try {
        await deleteNoteApi(note.serverId.toString(), USER_ID);
      } catch {
        console.log("Delete failed, retry later");
        return;
      }
    }

    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  /* ========================= SYNC (FIXED CORE) ========================= */
  const syncNotes = async () => {
    const unsynced = notes.filter((n) => !n.synced);

    for (const note of unsynced) {
      try {
        if (note.syncing) continue;

        // 🔥 mark syncing
        setNotes((prev) =>
          prev.map((n) => (n.id === note.id ? { ...n, syncing: true } : n)),
        );

        // =========================
        // 🔥 CASE 1: NEW NOTE → CREATE
        // =========================
        if (!note.serverId) {
          // 🚫 DO NOT CREATE TRASHED NOTES
          if (note.status === NoteStatus.TRASHED) {
            setNotes((prev) =>
              prev.map((n) =>
                n.id === note.id ? { ...n, synced: true, syncing: false } : n,
              ),
            );
            continue;
          }

          const res = await createNote({
            user_id: USER_ID,
            title: note.title,
            content: note.content,
            color: note.color,
            pinned: note.pinned,
            status: note.status,
          });

          setNotes((prev) =>
            prev.map((n) =>
              n.id === note.id
                ? {
                    ...n,
                    serverId: res.note_id,
                    synced: true,
                    syncing: false,
                  }
                : n,
            ),
          );

          continue;
        }

        // =========================
        // 🔥 CASE 2: EXISTING NOTE → UPDATE
        // =========================
        await updateNoteApi(note.serverId.toString(), USER_ID, {
          title: note.title,
          content: note.content,
          color: note.color,
          pinned: note.pinned,
          status: note.status,
        });

        setNotes((prev) =>
          prev.map((n) =>
            n.id === note.id ? { ...n, synced: true, syncing: false } : n,
          ),
        );
      } catch {
        console.log("Sync failed:", note.id);

        setNotes((prev) =>
          prev.map((n) => (n.id === note.id ? { ...n, syncing: false } : n)),
        );
      }
    }
  };

  /* ========================= NETWORK SYNC ========================= */
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (state.isConnected) {
        const ok = await isServerReachable();
        if (ok) syncNotes();
      }
    });

    return () => unsubscribe();
  }, [notes]);

  /* ========================= RETRY LOOP ========================= */
  useEffect(() => {
    const interval = setInterval(async () => {
      const ok = await isServerReachable();
      if (ok) syncNotes();
    }, 10000);

    return () => clearInterval(interval);
  }, [notes]);

  return (
    <NotesContext.Provider
      value={{
        notes,
        addNote,
        updateNote,
        deleteNote,
        restoreNote,
        permanentlyDeleteNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

/* 🔥 HOOK */
export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used inside provider");
  return ctx;
}
