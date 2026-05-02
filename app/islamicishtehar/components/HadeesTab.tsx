import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    ScrollView,
    Share,
    Text,
    View,
} from "react-native";

import CategoryModal from "./CategoryModal";
import LanguageDropdown from "./LanguageDropdown";

type Props = {
  hadees: any[];
};

export default function HadeesTab({ hadees }: Props) {
  /* ================= STATES ================= */
  const [query, setQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("roman");
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [selectedHadees, setSelectedHadees] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter: require("@/assets/fonts/Inter-Regular.ttf"),
    Hindi: require("@/assets/fonts/NotoSansDevanagari-Regular.ttf"),
    Urdu: require("@/assets/fonts/NotoNastaliqUrdu-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }
  const getFontFamily = (lang: string) => {
    if (lang === "urdu") return "Urdu";
    if (lang === "hindi") return "Hindi";
    return "Inter";
  };

  const getLineHeight = (lang: string) => {
    if (lang === "urdu") return 30;
    return 22;
  };
  /* ================= HELPER FUNCTIONS ================= */

  // Get text based on selected language with fallback
  const getText = (item: any) =>
    item.text?.[selectedLanguage] || item.text?.roman || "";

  // Get title based on selected language with fallback
  const getTitle = (item: any) =>
    item.title?.[selectedLanguage] || item.title?.roman || "Hadees";

  /* ================= CATEGORY LIST ================= */

  // Extract unique categories from hadees data
  const categories = [
    ...new Set(hadees.map((h) => h.category).filter(Boolean)),
  ];

  /* ================= FILTER ================= */

  // Filter hadees based on search query and selected category
  const filteredHadees = hadees.filter((h) => {
    const text = getText(h).toLowerCase();

    const matchesQuery = text.includes(query.toLowerCase());
    const matchesCategory =
      !selectedCategory || h.category === selectedCategory;

    return matchesQuery && matchesCategory;
  });

  return (
    <View style={{ flex: 1 }}>
      {/* SEARCH + FILTERS */}
      <View style={{ flexDirection: "row", padding: 12, gap: 8 }}>
        {/* CATEGORY */}
        <Pressable
          onPress={() => setShowCategoryModal(true)}
          style={{
            flex: 1,
            backgroundColor: "#fff",
            padding: 12,
            borderRadius: 12,
            elevation: 2,
            position: "relative",
          }}
        >
          {/* TEXT + ICON */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              paddingRight: 20,
            }}
          >
            <MaterialCommunityIcons
              name="magnify"
              size={18}
              color="#666"
              style={{ marginTop: 3 }}
            />

            <Text
              style={{
                marginLeft: 6,
                flex: 1,
                flexWrap: "wrap",
                lineHeight: 18,
              }}
            >
              {selectedCategory || "Choose Category"}
            </Text>
          </View>

          {/* CHEVRON (ABSOLUTE — DOES NOT AFFECT WIDTH) */}
          <MaterialCommunityIcons
            name="chevron-down"
            size={18}
            color="#666"
            style={{
              position: "absolute",
              right: 10,
              top: 14,
            }}
          />
        </Pressable>

        {/* LANGUAGE */}
        <LanguageDropdown
          selected={selectedLanguage}
          onChange={setSelectedLanguage}
          show={showLangDropdown}
          setShow={setShowLangDropdown}
        />
      </View>

      {/* LIST */}
      <FlatList
        ItemSeparatorComponent={() => <View style={{ height: 4 }} />}
        data={filteredHadees}
        keyExtractor={(item, i) => item?.id?.toString() || i.toString()}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 40 }}>
            No hadees available
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#fff",
              marginHorizontal: 12,
              marginTop: 10,
              padding: 14,
              borderRadius: 14,
              elevation: 2,
            }}
          >
            {/* HEADER ROW */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* ICON */}
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#e6f4ea",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="book-open-page-variant"
                  size={20}
                  color="#2e9e5b"
                />
              </View>

              {/* TITLE + SUBTITLE */}
              <View style={{ marginLeft: 10 }}>
                <Text
                  style={{
                    color: "#2e9e5b",
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  {getTitle(item)}
                </Text>

                <Text style={{ fontSize: 12, color: "#666" }}>
                  {item.category_name || "Hadees"}
                </Text>
              </View>
            </View>

            {/* TEXT */}
            <Text
              style={{
                marginTop: 12,
                lineHeight: 22,
                color: "#222",
                fontFamily: getFontFamily(selectedLanguage),
              }}
              numberOfLines={6} // 🔥 preview like real app
            >
              {getText(item)}
            </Text>

            {/* REFERENCE */}
            {item.reference && (
              <Text
                style={{
                  marginTop: 8,
                  color: "#2e9e5b",
                  fontSize: 12,
                }}
              >
                {item.reference}
              </Text>
            )}

            {/* ACTION ROW */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 12,
                borderTopWidth: 0.5,
                borderColor: "#ddd",
                paddingTop: 8,
              }}
            >
              <Pressable
                onPress={() => {
                  setSelectedHadees(item);
                  setShowDetailModal(true);
                }}
              >
                <Text style={{ color: "#888" }}>👁 Read more...</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  Share.share({
                    message: `${getTitle(item)}\n\n${getText(item)}`,
                  });
                }}
              >
                <Text style={{ color: "#888" }}>🔗 Share</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      <Modal visible={showDetailModal} transparent animationType="fade">
        <Pressable
          onPress={() => setShowDetailModal(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: "90%",
              padding: 16,
            }}
          >
            {selectedHadees && (
              <>
                {/* HEADER */}
                <View style={{ marginBottom: 10 }}>
                  <Text
                    style={{
                      color: "#2e9e5b",
                      fontWeight: "700",
                      fontSize: 16,
                      fontFamily: getFontFamily(selectedLanguage),
                    }}
                  >
                    {getTitle(selectedHadees)}
                  </Text>

                  <Text style={{ color: "#666", marginTop: 4 }}>
                    {selectedHadees.category_name || "Hadees"}
                  </Text>
                </View>

                {/* CONTENT */}
                <ScrollView>
                  <Text
                    style={{
                      lineHeight: 24,
                      color: "#222",
                      fontFamily: getFontFamily(selectedLanguage),
                    }}
                  >
                    {getText(selectedHadees)}
                  </Text>

                  {selectedHadees.reference && (
                    <Text
                      style={{
                        marginTop: 10,
                        color: "#2e9e5b",
                        fontSize: 12,
                      }}
                    >
                      {selectedHadees.reference}
                    </Text>
                  )}
                </ScrollView>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* CATEGORY MODAL */}
      <CategoryModal
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        categories={categories}
        onSelect={setSelectedCategory}
      />
    </View>
  );
}
