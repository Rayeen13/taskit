import { useAppColors } from "@/app/hooks/useAppColors";
import { useNotes } from "@/services/notesContext";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const { notes, updateNote, deleteNote } = useNotes();
  const navigation = useNavigation();
  const colors = useAppColors();

  const note = notes.find((n) => n.id === id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const isDeleting = useRef(false); // 🔥 CRITICAL FLAG

  /* ========================= INIT ========================= */
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  /* ========================= SAVE ON BACK ========================= */
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!note) return;

      // 🔥 DO NOT SAVE IF DELETING
      if (isDeleting.current) return;

      e.preventDefault();

      updateNote({
        ...note, // preserve serverId, status, etc
        title: title.trim() || "Untitled Note",
        content: content.trim(),
      });

      navigation.dispatch(e.data.action);
    });

    return unsubscribe;
  }, [title, content, note]);

  /* ========================= DELETE ========================= */
  const handleDelete = () => {
    if (!note) return;

    isDeleting.current = true; // 🔥 STOP SAVE-ON-BACK

    deleteNote(note.id); // sets status = trashed

    navigation.goBack();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Note",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerRight: () => (
            <Pressable onPress={handleDelete} style={{ padding: 8 }}>
              <FontAwesome name="trash" size={18} color={colors.text} />
            </Pressable>
          ),
        }}
      />

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.background }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              style={[styles.title, { color: colors.text }]}
              placeholder="Title"
              placeholderTextColor={colors.subText}
            />

            <View
              style={[
                styles.divider,
                { backgroundColor: colors.border || "#e0e0e0" },
              ]}
            />

            <TextInput
              value={content}
              onChangeText={setContent}
              style={[styles.content, { color: colors.text }]}
              multiline
              placeholder="Start typing..."
              placeholderTextColor={colors.subText}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },

  card: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },

  divider: {
    height: 1,
    marginVertical: 8,
  },

  content: {
    flex: 1,
    fontSize: 15,
    textAlignVertical: "top",
  },
});
