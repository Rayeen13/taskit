import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

type Props = {
  posts: any[];
  namaz: any;
};

export default function HomeTab({ posts, namaz }: Props) {
  const [query, setQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("roman");
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ zIndex: 10 }}>
        {/* ================= NAMAZ HEADER ================= */}
        <View
          style={{
            backgroundColor: "#2e9e5b",
            paddingTop: 40,
            paddingBottom: 20,
            paddingHorizontal: 16,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700" }}>
            Namaz Time
          </Text>

          <Text style={{ color: "#d4f5df", marginTop: 4 }}>
            {new Date().toDateString()}
          </Text>

          {/* NAMAZ ROW */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "row", marginTop: 16 }}>
              {[
                {
                  label: "End Sehri",
                  value: `${namaz?.sehri_end || "--:--"}`,
                },
                {
                  label: "Fajr",
                  value: `${namaz?.fajr || "--:--"}`,
                },
                {
                  label: "Sunrise",
                  value: `${namaz?.sunrise || "--:--"}`,
                },
                {
                  label: "Dahwa-e-Qubra",
                  value: `${namaz?.sunrise || "--:--"}`,
                },
                {
                  label: "Dhuhr",
                  value: `${namaz?.dhuhr || "--:--"}`,
                },
                {
                  label: "Asr",
                  value: `${namaz?.asr || "--:--"}`,
                },
                {
                  label: "Maghrib",
                  value: `${namaz?.maghrib || "--:--"}`,
                },
                {
                  label: "Isha",
                  value: `${namaz?.isha || "--:--"}`,
                },
              ].map((t, i) => (
                <View
                  key={i}
                  style={{
                    backgroundColor: "#fff",
                    padding: 12,
                    borderRadius: 12,
                    marginRight: 10,
                    minWidth: 120,
                    elevation: 2,
                  }}
                >
                  <Text style={{ fontWeight: "600", fontSize: 12 }}>
                    {t.label}
                  </Text>

                  <Text style={{ marginTop: 4, fontSize: 14 }}>{t.value}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* ================= MENU STRIP ================= */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 10,
              paddingVertical: 12,
            }}
          >
            {[
              { key: "ramzan", label: "Ramzan", icon: "moon-waning-crescent" },

              { key: "zikr", label: "Live Group Zikr", icon: "counter" },

              { key: "faraiz", label: "Faraiz-e-Islam", icon: "star-crescent" },

              {
                key: "seerat",
                label: "Seerat-e-Mustafa ﷺ",
                icon: "mosque",
              },

              {
                key: "mojzat",
                label: "Mojzat-e-Rasool ﷺ",
                icon: "dome-light",
              },

              { key: "urs", label: "Urs Mubarak", icon: "flower" },

              { key: "tasbeeh", label: "Tasbeeh", icon: "counter" },

              {
                key: "masjid",
                label: "Masjid Finder",
                icon: "map-marker-radius",
              },

              {
                key: "halal",
                label: "Halal Places",
                icon: "silverware-fork-knife",
              },

              { key: "naat", label: "Hamd-o-Naat", icon: "music" },
            ].map((item, i) => (
              <Pressable
                key={i}
                onPress={() => {
                  console.log("Category:", item.key);
                  // 🔥 later: call API filter here
                }}
                style={{
                  alignItems: "center",
                  marginRight: 14,
                  width: 80, // 🔥 important for long labels
                }}
              >
                {/* ICON CIRCLE */}
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 32,
                    backgroundColor: "#fff",
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 3,
                  }}
                >
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={24}
                    color="#2e9e5b"
                  />
                </View>

                {/* LABEL */}
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 11,
                    marginTop: 6,
                    textAlign: "center",
                  }}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* ================= SEARCH + LANGUAGE ================= */}
        <View style={{ flexDirection: "row", padding: 12 }}>
          <TextInput
            placeholder="Search..."
            value={query}
            onChangeText={setQuery}
            style={{
              flex: 1,
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 10,
            }}
          />

          <View style={{ marginLeft: 8 }}>
            <Pressable
              onPress={() => setShowLangDropdown(!showLangDropdown)}
              style={{
                backgroundColor: "#fff",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Text>Language ▼</Text>
            </Pressable>

            {showLangDropdown && (
              <View
                style={{
                  position: "absolute",
                  top: 45,
                  right: 0,
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  elevation: 10,
                  zIndex: 9999,
                }}
              >
                {["Roman", "Urdu", "Hindi"].map((l) => (
                  <Pressable key={l} style={{ padding: 10 }}>
                    <Text>{l}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
      {/* ================= POSTS ================= */}
      <FlatList
        contentContainerStyle={{
          paddingBottom: 80, // prevents bottom cutoff
        }}
        data={posts}
        keyExtractor={(item: any, i) => item?.id?.toString() || i.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              margin: 10,
              backgroundColor: "#fff",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {item?.image && (
              <Image source={{ uri: item.image }} style={{ height: 180 }} />
            )}

            <Text style={{ padding: 10 }}>{item?.text || item?.content}</Text>
          </View>
        )}
      />
    </View>
  );
}
