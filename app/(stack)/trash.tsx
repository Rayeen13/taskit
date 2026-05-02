import { useAppColors } from "@/app/hooks/useAppColors";
import NoteItem from "@/components/NoteItem";
import { useNotes } from "@/services/notesContext";
import { FontAwesome } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

export default function TrashScreen() {
  const { notes, restoreNote, permanentlyDeleteNote } = useNotes();
  const colors = useAppColors();

  const trashedNotes = notes.filter((n) => n.status === "trashed");

  return (
    <>
      <Stack.Screen
        options={{
          title: "Trash",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />

      <FlatList
        data={trashedNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <NoteItem note={item} colors={colors} />

            {/* RESTORE */}
            <Pressable
              onPress={() => restoreNote(item.id)}
              style={styles.iconBtn}
            >
              <FontAwesome name="undo" size={18} color={colors.text} />
            </Pressable>

            {/* DELETE PERMANENT */}
            <Pressable
              onPress={() => permanentlyDeleteNote(item.id)}
              style={styles.iconBtn}
            >
              <FontAwesome name="trash" size={18} color="red" />
            </Pressable>
          </View>
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    padding: 10,
  },
});
