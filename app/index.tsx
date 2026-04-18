import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  FlatList,
  StyleSheet,
  Pressable,
  Text,
  TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter, Stack } from "expo-router";
import { useNotes } from "@/services/notesContext";
import NoteItem from "@/components/NoteItem";
import { useState } from "react";

export default function HomeScreen() {
  const router = useRouter();
  const { notes, deleteNote } = useNotes();

  const [query, setQuery] = useState("");
  const [layout, setLayout] = useState<"list" | "grid" | "card">("list");

  const filteredNotes = notes.filter((n) =>
    (n.title + " " + n.content).toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Notes",
          headerRight: () => (
            <Pressable
              onPress={() =>
                setLayout((prev) =>
                  prev === "list" ? "grid" : prev === "grid" ? "card" : "list",
                )
              }
              style={{ padding: 10 }}
            >
              <FontAwesome
                name={
                  layout === "list"
                    ? "th-large"
                    : layout === "grid"
                      ? "square"
                      : "list"
                }
                size={18}
                color="#333"
              />
            </Pressable>
          ),
        }}
      />

      <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
        <View style={styles.inner}>
          {/* SEARCH */}
          <View style={styles.searchWrapper}>
            <FontAwesome
              name="search"
              size={16}
              color="#888"
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="Search notes"
              placeholderTextColor="#666"
              value={query}
              onChangeText={setQuery}
              style={styles.searchInput}
            />
          </View>

          {/* LIST */}
          <FlatList
            key={layout} // 🔥 force re-render
            data={filteredNotes}
            keyExtractor={(item) => item.id}
            numColumns={layout === "list" ? 1 : 2}
            renderItem={({ item }) => (
              <View style={layout !== "list" ? { flex: 1 } : undefined}>
                <NoteItem note={item} onDelete={deleteNote} layout={layout} />
              </View>
            )}
            ItemSeparatorComponent={() =>
              layout === "list" ? <View style={styles.separator} /> : null
            }
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.empty}>
                {query ? "No results found" : "No notes yet"}
              </Text>
            }
          />

          {/* FAB */}
          <Pressable style={styles.fab} onPress={() => router.push("/create")}>
            <FontAwesome name="plus" size={20} color="#fff" />
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },

  inner: {
    flex: 1,
    paddingHorizontal: 12,
  },

  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8eaed",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginTop: 6,
    marginBottom: 8,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },

  listContent: {
    paddingBottom: 80,
  },

  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginLeft: 4,
  },

  empty: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },

  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    height: 56,
    width: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1da1f2",
  },
});
