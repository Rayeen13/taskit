import { useAppColors } from "@/app/hooks/useAppColors";
import { getRandomColor } from "@/app/utils/colors";
import { useNotes } from "@/services/notesContext";
import { useNavigation } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    View,
} from "react-native";

export default function CreateNoteScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { addNote } = useNotes();
  const colors = useAppColors();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();

      if (title.trim() || content.trim()) {
        const newNote = {
          id: Date.now().toString(),
          title: title.trim() || "Untitled Note",
          content: content.trim(),
          color: getRandomColor(),
          createdDate: Date.now(), // ✅ number
          pinned: false,
        };

        addNote(newNote);
      }

      navigation.dispatch(e.data.action);
    });

    return unsubscribe;
  }, [title, content]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Add Note",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />

      <>
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: colors.background }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View
            style={[styles.container, { backgroundColor: colors.background }]}
          >
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <TextInput
                placeholder="Title"
                placeholderTextColor={colors.subText}
                value={title}
                onChangeText={setTitle}
                style={[styles.title, { color: colors.text }]}
              />

              <View
                style={[
                  styles.divider,
                  { backgroundColor: colors.border || "#e0e0e0" },
                ]}
              />

              <TextInput
                placeholder="Start typing..."
                placeholderTextColor={colors.subText}
                value={content}
                onChangeText={setContent}
                style={[styles.content, { color: colors.text }]}
                multiline
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },

  container: {
    flex: 1,
    padding: 12,
  },

  card: {
    borderRadius: 12,
    padding: 14,
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },

  content: {
    fontSize: 15,
    color: "#333",
    flex: 1, // fills remaining space properly
    textAlignVertical: "top",
  },
});
