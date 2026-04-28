import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Note = {
  id: string;
  title: string;
  content: string;
  color: string;
  createdDate: number;
  pinned: boolean;
};

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
        router.push({ pathname: "/note/[id]", params: { id: note.id } })
      }
      onLongPress={() => onLongPress?.(note)}
      delayLongPress={250}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.base,
            layout !== "card" && { backgroundColor: colors.card },
            layout === "list" && [styles.listItem],
            layout === "grid" && [styles.gridItem],
            layout === "card" && [
              styles.cardItem,
              { backgroundColor: note.color },
            ],
            isSelected && styles.selectedOutline,
            isSelected && styles.selectedActive,
            // pressed && !isSelected && styles.pressed,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.row}>
            {/* INDICATOR */}
            <View style={[pressed && styles.indicatorActive]} />

            {/* CONTENT */}
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
                    layout === "list"
                      ? 2 // 📄 compact preview
                      : layout === "grid"
                        ? 5 // 🧱 medium block
                        : 9 // 🎨 card (Keep style max)
                  }
                >
                  {note.content}
                </Text>
              </View>

              {/* DELETE */}
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  onDelete?.(note.id);
                }}
                style={styles.deleteBtn}
                hitSlop={10}
              >
                <FontAwesome name="trash" size={16} color={colors.subText} />
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  /* 🔥 BASE */
  base: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  /* LIST */
  listItem: {
    marginVertical: 4,
    marginHorizontal: 4,
  },

  /* GRID */
  gridItem: {
    height: 140,
    margin: 4,
    overflow: "hidden",
  },

  /* CARD (🔥 Google Keep style) */
  cardItem: {
    margin: 4,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  /* ROW */
  row: {
    flexDirection: "row",
    flex: 1,
  },

  /* PRESS */
  pressed: {
    opacity: 0.85,
  },

  indicatorActive: {
    backgroundColor: "#1da1f2",
  },

  /* CONTENT */
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
    borderColor: "#1da1f2", // 🔵 Keep-like blue
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
