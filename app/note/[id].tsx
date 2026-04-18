import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useNotes } from "@/services/notesContext";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const { notes, updateNote, deleteNote } = useNotes();
  const navigation = useNavigation();

  const note = notes.find((n) => n.id === id);

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  // 🔥 Save on back
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!note) return;

      e.preventDefault();

      updateNote({
        id: note.id,
        title: title.trim() || "Untitled Note",
        content: content.trim(),
      });

      navigation.dispatch(e.data.action);
    });

    return unsubscribe;
  }, [title, content]);

  // 🔥 Delete
  const handleDelete = () => {
    if (!note) return;
    deleteNote(note.id);
    navigation.goBack();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Edit Note",
          headerRight: () => (
            <Pressable onPress={handleDelete} style={{ padding: 8 }}>
              <FontAwesome name="trash" size={18} color="#888" />
            </Pressable>
          ),
        }}
      />

      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.container}>
            {/* CARD SURFACE */}
            <View style={styles.card}>
              <TextInput
                value={title}
                onChangeText={setTitle}
                style={styles.title}
                placeholder="Title"
                placeholderTextColor="#888"
              />

              <View style={styles.divider} />

              <TextInput
                value={content}
                onChangeText={setContent}
                style={styles.content}
                multiline
                placeholder="Start typing..."
                placeholderTextColor="#aaa"
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
    flex: 1,
    backgroundColor: "#fff",
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
    backgroundColor: "#eee",
    marginVertical: 8,
  },

  content: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    textAlignVertical: "top",
  },
});
