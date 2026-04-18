import { Pressable, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

type Note = {
  id: string;
  title: string;
  content: string;
};

type Props = {
  note: Note;
  onDelete?: (id: string) => void;
  layout?: "list" | "grid" | "card";
};

export default function NoteItem({ note, onDelete, layout = "list" }: Props) {
  const router = useRouter();

  const isGrid = layout === "grid";
  const isCard = layout === "card";

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/note/[id]", params: { id: note.id } })
      }
    >
      {({ pressed }) => (
        <View
          style={[
            styles.container,
            isGrid && styles.gridItem,
            isCard && styles.cardItem,
            pressed && styles.rowPressed,
          ]}
        >
          <View style={styles.row}>
            {/* INDICATOR */}
            <View
              style={[styles.indicator, pressed && styles.indicatorActive]}
            />

            {/* CONTENT */}
            <View style={styles.main}>
              <View style={styles.content}>
                <View style={styles.titleRow}>
                  <FontAwesome
                    name="sticky-note"
                    size={12}
                    color="#888"
                    style={styles.icon}
                  />
                  <Text style={styles.title} numberOfLines={1}>
                    {note.title}
                  </Text>
                </View>

                <Text
                  style={styles.text}
                  numberOfLines={isGrid ? 3 : isCard ? undefined : 2}
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
                <FontAwesome name="trash" size={16} color="#888" />
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "#fafbfc",
  },

  /* ✅ TRUE GRID */
  gridItem: {
    margin: 6,
    height: 140, // 🔥 fixed height = real grid
    borderRadius: 10,
    overflow: "hidden",
  },

  /* ✅ KEEP-STYLE CARD */
  cardItem: {
    margin: 6,
    backgroundColor: "#fff8dc",
    borderRadius: 12,
    padding: 10,
  },

  row: {
    flexDirection: "row",
    flex: 1,
  },

  rowPressed: {
    backgroundColor: "#f0f0f0",
  },

  indicator: {
    width: 3,
    marginRight: 8,
    backgroundColor: "transparent", // hidden by default
  },

  indicatorActive: {
    backgroundColor: "#1da1f2", // visible on press
  },

  main: {
    flex: 1,
    justifyContent: "space-between",
  },

  content: {
    flex: 1,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
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
    color: "#666",
  },

  deleteBtn: {
    marginTop: 4,
    alignSelf: "flex-end",
  },
});
