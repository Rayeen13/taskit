import { Note } from "@/services/notesContext";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  note: Note;
  onDelete?: (id: string) => void;
  onLongPress?: (note: Note) => void;
  layout?: "list" | "grid" | "card";
  isSelected?: boolean;
  colors: any;
};

export default function NoteItem({
  note,
  onDelete,
  onLongPress,
  layout = "list",
  isSelected = false,
  colors,
}: Props) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/note/[id]",
          params: { id: note.id },
        })
      }
      onLongPress={() => onLongPress?.(note)}
      delayLongPress={250}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.base,
            layout !== "card" && { backgroundColor: colors.card },
            layout === "list" && styles.listItem,
            layout === "grid" && styles.gridItem,
            layout === "card" && [
              styles.cardItem,
              { backgroundColor: note.color },
            ],
            isSelected && styles.selectedOutline,
            isSelected && styles.selectedActive,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.row}>
            <View style={[pressed && styles.indicatorActive]} />

            <View style={styles.main}>
              <View style={styles.content}>
                <View style={styles.titleRow}>
                  <FontAwesome
                    name="sticky-note"
                    size={12}
                    color={colors.subText}
                    style={styles.icon}
                  />
                  <Text
                    style={[styles.title, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {note.title}
                  </Text>
                </View>

                <Text
                  style={[styles.text, { color: colors.text }]}
                  numberOfLines={
                    layout === "list" ? 2 : layout === "grid" ? 5 : 9
                  }
                >
                  {note.content}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  listItem: {
    marginVertical: 4,
    marginHorizontal: 4,
  },

  gridItem: {
    height: 140,
    margin: 4,
    overflow: "hidden",
  },

  cardItem: {
    margin: 4,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  row: {
    flexDirection: "row",
    flex: 1,
  },

  pressed: {
    opacity: 0.85,
  },

  indicatorActive: {
    backgroundColor: "#1da1f2",
  },

  main: {
    flex: 1,
    justifyContent: "space-between",
  },

  content: {
    flexGrow: 1,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  icon: {
    marginRight: 6,
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
  },

  text: {
    fontSize: 13,
  },

  deleteBtn: {
    marginTop: 6,
    alignSelf: "flex-end",
  },

  selectedOutline: {
    borderWidth: 2,
    borderColor: "#1da1f2",
  },

  selectedActive: {
    transform: [{ scale: 1.03 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
