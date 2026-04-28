import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type Note = {
  id: string;
  title: string;
  content: string;
  color: string;
  createdDate: number;
  pinned: boolean;
};

type NotesContextType = {
  notes: Note[];
  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
};

const NotesContext = createContext<NotesContextType | null>(null);

const STORAGE_KEY = "TASKIT_NOTES";

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loaded, setLoaded] = useState(false); // 🔥 important flag

  // 🔥 Load notes on app start
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);

          const normalized = parsed.map((n: any) => ({
            ...n,
            pinned: n.pinned ?? false, // 🔥 ensure default
          }));

          setNotes(normalized);
        }
      } catch (e) {
        console.log("Failed to load notes", e);
      } finally {
        setLoaded(true); // ✅ mark as loaded
      }
    };

    loadNotes();
  }, []);

  // 🔥 Save notes ONLY after load completes
  useEffect(() => {
    if (!loaded) return; // prevent overwrite on reload

    const saveNotes = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      } catch (e) {
        console.log("Failed to save notes", e);
      }
    };

    saveNotes();
  }, [notes, loaded]);

  const addNote = (note: Note) => {
    setNotes((prev) => [note, ...prev]);
  };

  const updateNote = (updated: Note) => {
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used within NotesProvider");
  }
  return context;
}
