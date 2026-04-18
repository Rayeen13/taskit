import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter, Stack } from "expo-router";
import { useNotes } from "@/services/notesContext";
import { useNavigation } from "@react-navigation/native";

export default function CreateNoteScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { addNote } = useNotes();

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
        };

        addNote(newNote);
      }

      navigation.dispatch(e.data.action);
    });

    return unsubscribe;
  }, [title, content]);

  return (
    <>
      <Stack.Screen options={{ title: "Add Note" }} />

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.container}>
            
            <View style={styles.card}>
              
              <TextInput
                placeholder="Title"
                placeholderTextColor="#888"
                value={title}
                onChangeText={setTitle}
                style={styles.title}
              />

              <View style={styles.divider} />

              <TextInput
                placeholder="Start typing..."
                placeholderTextColor="#aaa"
                value={content}
                onChangeText={setContent}
                style={styles.content}
                multiline
              />

            </View>

          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f1f3f4",
  },

  container: {
    flex: 1,
    padding: 12,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    flex: 1, // 🔥 important
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