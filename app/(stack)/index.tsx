import { useAppColors } from "@/app/hooks/useAppColors";
import { COLORS } from "@/app/utils/colors";
import NoteItem from "@/components/NoteItem";
import { useAuth } from "@/services/authContext";
import { Note, useNotes } from "@/services/notesContext";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { Stack, useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function HomeScreen() {
  const MENU_ICON_SIZE = 20;
  const router = useRouter();
  const navigation = useNavigation();
  const { notes, deleteNote, updateNote } = useNotes();
  const { isLoggedIn, userProfile } = useAuth();
  const colors = useAppColors();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "45%"], []);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const backPressRef = useRef(0);

  const [query, setQuery] = useState("");
  const [layout, setLayout] = useState<"list" | "grid" | "card">("list");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const filteredNotes = notes.filter((n) =>
    (n.title + " " + n.content).toLowerCase().includes(query.toLowerCase()),
  );

  const pinned = filteredNotes.filter((n) => n.pinned);
  const others = filteredNotes.filter((n) => !n.pinned);

  const openMenu = (note: Note) => {
    rotateAnim.setValue(note.pinned ? 1 : 0);
    setSelectedNote(note);
    bottomSheetRef.current?.expand(); // 🔥 open sheet
  };

  const toggleLayout = () => {
    setLayout((prev) =>
      prev === "list" ? "grid" : prev === "grid" ? "card" : "list",
    );
  };

  const handleDelete = () => {
    if (!selectedNote) return;
    deleteNote(selectedNote.id);
    setSelectedNote(null);
    bottomSheetRef.current?.close();
  };

  const closeMenu = () => {
    bottomSheetRef.current?.close();
  };

  // 🔥 PIN TOGGLE (NO JITTER VERSION)
  const handlePinToggle = () => {
    if (!selectedNote) return;

    const next = !selectedNote.pinned;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.spring(rotateAnim, {
      toValue: next ? 1 : 0,
      useNativeDriver: true,
      speed: 18,
      bounciness: 5,
    }).start();

    const updated = { ...selectedNote, pinned: next };

    updateNote(updated);
    setSelectedNote(updated);
  };

  // 🔥 COLOR CHANGE (LIVE PREVIEW)
  const handleColorChange = (color: string) => {
    if (!selectedNote) return;

    Haptics.selectionAsync();

    const updated = { ...selectedNote, color };

    updateNote(updated);
    setSelectedNote(updated);
  };

  // 🔥 ROTATION
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["45deg", "0deg"],
  });

  return (
    <>
      <>
        <Stack.Screen
          options={{
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerShadowVisible: false,
            headerTitle: () => (
              <View
                style={[styles.searchHeader, { backgroundColor: colors.card }]}
              >
                <FontAwesome name="search" size={16} color={colors.subText} />

                <TextInput
                  placeholder="Search notes"
                  placeholderTextColor={colors.subText}
                  value={query}
                  onChangeText={setQuery}
                  style={[styles.searchInputHeader, { color: colors.text }]}
                />
              </View>
            ),

            headerLeft: () => (
              <Pressable
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={{ paddingHorizontal: 8 }}
              >
                <FontAwesome name="bars" size={18} color={colors.text} />
              </Pressable>
            ),

            headerRight: () => (
              <Pressable
                onPress={() => router.push("/profile")}
                style={{ paddingHorizontal: 8 }}
              >
                {isLoggedIn ? (
                  <Image
                    source={{
                      uri:
                        userProfile?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          userProfile?.name || "User",
                        )}&background=random&color=fff&bold=true`,
                    }}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                    }}
                  />
                ) : (
                  <FontAwesome
                    name="user-circle"
                    size={20}
                    color={colors.text}
                  />
                )}
              </Pressable>
            ),
          }}
        />

        <View style={[styles.safe, { backgroundColor: colors.background }]}>
          <View style={[styles.inner, { backgroundColor: colors.background }]}>
            {/* 🔥 Layout Toggle */}
            <View style={styles.topActions}>
              <Pressable
                onPress={toggleLayout}
                style={[styles.layoutBtn, { backgroundColor: colors.card }]}
              >
                <FontAwesome
                  name={
                    layout === "list"
                      ? "columns"
                      : layout === "grid"
                        ? "th-large"
                        : "square"
                  }
                  size={18}
                  color={colors.text}
                />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {pinned.length > 0 && (
                <>
                  <Text style={[styles.section, { color: colors.subText }]}>
                    PINNED
                  </Text>
                  {renderSection(pinned)}
                </>
              )}

              {others.length > 0 && (
                <>
                  <Text style={[styles.section, { color: colors.subText }]}>
                    OTHERS
                  </Text>
                  {renderSection(others)}
                </>
              )}
            </ScrollView>
          </View>

          {/* FAB */}
          <Pressable
            style={[styles.fab, { backgroundColor: "#1da1f2" }]}
            onPress={() => router.push("/create")}
          >
            <FontAwesome name="plus" size={20} color="#fff" />
          </Pressable>

          {isSheetOpen && (
            <Pressable
              style={styles.sheetOverlay}
              onPress={closeMenu}
              accessibilityRole="button"
              accessibilityLabel="Close note options"
            />
          )}

          <BottomSheet
            ref={bottomSheetRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            backgroundStyle={{ backgroundColor: colors.card }}
            onChange={(index) => {
              const open = index >= 0;
              setIsSheetOpen(open);
              if (!open) {
                setSelectedNote(null);
              }
            }}
          >
            <BottomSheetView
              style={{ padding: 16, backgroundColor: colors.card }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontWeight: "600",
                  marginBottom: 10,
                }}
              >
                Note Options
              </Text>

              {/* COLORS */}
              <View style={styles.colorRow}>
                {COLORS.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => handleColorChange(c)}
                    style={[
                      styles.colorDot,
                      { backgroundColor: c },
                      selectedNote?.color === c && {
                        borderWidth: 2,
                        borderColor: colors.text,
                      },
                    ]}
                  />
                ))}
              </View>

              {/* PIN */}
              <Pressable style={styles.menuItem} onPress={handlePinToggle}>
                <View style={styles.menuRow}>
                  <Animated.View style={{ transform: [{ rotate }] }}>
                    <MaterialIcons
                      name={selectedNote?.pinned ? "push-pin" : "push-pin"}
                      size={MENU_ICON_SIZE}
                      color={colors.text}
                      style={{ marginRight: 12 }}
                    />
                  </Animated.View>

                  <Text style={{ color: colors.text, fontSize: 15 }}>
                    {selectedNote?.pinned ? "Unpin" : "Pin"}
                  </Text>
                </View>
              </Pressable>

              {/* DELETE */}
              <Pressable style={styles.menuItem} onPress={handleDelete}>
                <View style={styles.menuRow}>
                  <MaterialIcons
                    name="delete-outline"
                    size={MENU_ICON_SIZE}
                    color="#ff4d4f"
                    style={{ marginRight: 12 }}
                  />

                  <Text style={{ color: "#ff4d4f", fontSize: 15 }}>Delete</Text>
                </View>
              </Pressable>
            </BottomSheetView>
          </BottomSheet>
        </View>
      </>
    </>
  );

  function renderSection(data: Note[]) {
    if (layout === "card") {
      return (
        <View style={styles.masonry}>
          <View style={styles.column}>
            {data
              .filter((_, i) => i % 2 === 0)
              .map((item) => (
                <NoteItem
                  key={item.id}
                  note={item}
                  layout="card"
                  colors={colors}
                  onDelete={deleteNote}
                  onLongPress={(note) => openMenu(note)}
                  isSelected={selectedNote?.id === item.id}
                />
              ))}
          </View>

          <View style={styles.column}>
            {data
              .filter((_, i) => i % 2 !== 0)
              .map((item) => (
                <NoteItem
                  key={item.id}
                  note={item}
                  layout="card"
                  colors={colors}
                  onDelete={deleteNote}
                  onLongPress={(note) => openMenu(note)}
                  isSelected={selectedNote?.id === item.id}
                />
              ))}
          </View>
        </View>
      );
    }

    return (
      <FlatList
        key={layout}
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={layout === "list" ? 1 : 2}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={layout === "grid" ? styles.gridWrap : undefined}>
            <NoteItem
              note={item}
              colors={colors}
              layout={layout}
              onDelete={deleteNote}
              onLongPress={(note) => openMenu(note)} // 🔥 FIXED
            />
          </View>
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  inner: { flex: 1, paddingHorizontal: 12 },

  section: {
    marginTop: 10,
    marginBottom: 4,
    fontSize: 12,
  },

  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    height: 50,
    width: "100%", // fill available header title space
    minWidth: 200, // prevent it from collapsing on small screens
  },

  searchInputHeader: {
    flex: 1,
    marginLeft: 12,
    paddingVertical: 0,
    fontSize: 16,
  },
  topActions: {
    alignItems: "flex-end",
    paddingVertical: 6,
  },

  layoutBtn: {
    padding: 8,
    borderRadius: 10,
  },

  gridWrap: { flex: 1, paddingHorizontal: 4 },

  masonry: { flexDirection: "row" },

  column: { flex: 1 },

  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    height: 56,
    width: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#00000055",
    justifyContent: "flex-end",
  },

  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },

  menu: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 10,
  },

  menuTitle: {
    fontWeight: "600",
    marginBottom: 10,
  },

  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 10,
  },

  colorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },

  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    margin: 6,
  },

  selectedDot: {
    borderWidth: 2,
    borderColor: "#000",
    transform: [{ scale: 1.1 }],
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
