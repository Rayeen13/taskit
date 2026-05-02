import {
  getHadees,
  getNamazTimes,
  getPosts,
} from "@/services/islamicIshterharApi";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HadeesTab from "./components/HadeesTab";
import HomeTab from "./components/HomeTab";
import IshteharTab from "./components/IshteharTab";
import QiblaTab from "./components/QiblaTab";
import QuranTab from "./components/QuranTab";

type TabType = "home" | "ishtehar" | "hadees" | "quran" | "qibla";

const titles: Record<TabType, string> = {
  home: "Namaz Time",
  hadees: "Hadees Shareef",
  ishtehar: "Islamic Ishtehar",
  quran: "Quran Shareef",
  qibla: "Qibla Direction",
};

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [posts, setPosts] = useState<any[]>([]);
  const [hadees, setHadees] = useState<any[]>([]);
  const [namaz, setNamaz] = useState<any>({});

  const [query, setQuery] = useState("");
  const [fontsLoaded] = useFonts({
    Inter: require("@/assets/fonts/Inter-Regular.ttf"),
    Hindi: require("@/assets/fonts/NotoSansDevanagari-Regular.ttf"),
    Urdu: require("@/assets/fonts/NotoNastaliqUrdu-Regular.ttf"),
  });

  const getFontFamily = (lang: string) => {
    if (lang === "urdu") return "Urdu";
    if (lang === "hindi") return "Hindi";
    return "Inter";
  };

  const getLineHeight = (lang: string) => {
    if (lang === "urdu") return 30;
    return 22;
  };

  // Get title based on active tab
  const getTitle = () => {
    return titles[activeTab];
  };

  /* ================= LOAD DATA ================= */
  // On component mount, load posts, hadees, and namaz times
  useEffect(() => {
    const loadData = async () => {
      try {
        const postsRes = await getPosts();
        setPosts(postsRes?.data || []);
      } catch (e) {
        console.log("Posts fetch failed:", e);
        setPosts([]); // fallback
      }

      try {
        const hadeesRes = await getHadees();
        const normalized = (hadeesRes?.data || []).map((h: any) => ({
          id: h.id,
          title: {
            roman: h.title,
            urdu: h.title_ur,
            hindi: h.title_hi,
          },
          text: {
            roman: h.text,
            urdu: h.text_urdu,
            hindi: h.text_hindi,
          },
          category: h.category_name,
          reference: h.reference,
        }));

        setHadees(normalized);
      } catch (e) {
        console.log("Hadees fetch failed:", e);
        setHadees([]);
      }

      try {
        const namazRes = await getNamazTimes();
        setNamaz(namazRes || {});
      } catch (e) {
        console.log("Namaz fetch failed:", e);
        setNamaz({});
      }
    };

    loadData();
  }, []);

  if (!fontsLoaded) {
    return null;
  }
  
  /* ================= HEADER ================= */
  const Header = () => (
    <>
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
          {getTitle()}
        </Text>

        <Text style={{ color: "#d4f5df", marginTop: 4 }}>
          {new Date().toDateString()}
        </Text>
      </View>
    </>
  );

  /* ================= CONTENT ================= */

  const renderContent = () => {
    if (activeTab === "home") {
      return <HomeTab posts={posts} namaz={namaz} />;
    }

    if (activeTab === "hadees") {
      return <HadeesTab hadees={hadees} />;
    }

    if (activeTab === "ishtehar") {
      return <IshteharTab />;
    }

    if (activeTab === "quran") {
      return <QuranTab />;
    }

    return <QiblaTab />;
  };

  /* ================= UI ================= */

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#f3f5f7" }}
      edges={["left", "right"]}
    >
      <View style={{ flex: 1 }}>
        {activeTab === "home" ? (
          renderContent()
        ) : (
          <View style={{ flex: 1 }}>
            <Header />
            <View style={{ flex: 1 }}>{renderContent()}</View>
          </View>
        )}
      </View>
      {/* ================= BOTTOM NAV ================= */}

      <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "#fff" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            paddingVertical: 10,
            borderTopWidth: 0.5,
            borderColor: "#ddd",
          }}
        >
          {/* ISHTEHAR */}
          <Pressable
            onPress={() => setActiveTab("ishtehar")}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <MaterialCommunityIcons
              name="bullhorn-outline"
              size={22}
              color={activeTab === "ishtehar" ? "#2e9e5b" : "#888"}
            />
            <Text style={{ fontSize: 11 }}>Ishtehar</Text>
          </Pressable>

          {/* HADEES */}
          <Pressable
            onPress={() => setActiveTab("hadees")}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <MaterialCommunityIcons
              name="book-open-variant"
              size={22}
              color={activeTab === "hadees" ? "#2e9e5b" : "#888"}
            />
            <Text style={{ fontSize: 11 }}>Hadees</Text>
          </Pressable>

          {/* 🔥 CENTER HOME */}
          <Pressable
            onPress={() => setActiveTab("home")}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: "#2e9e5b",
              justifyContent: "center",
              alignItems: "center",
              marginTop: -30,
              elevation: 6,
            }}
          >
            <MaterialCommunityIcons name="home" size={26} color="#fff" />
          </Pressable>

          {/* QURAN */}
          <Pressable
            onPress={() => setActiveTab("quran")}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <MaterialCommunityIcons
              name="book-outline"
              size={22}
              color={activeTab === "quran" ? "#2e9e5b" : "#888"}
            />
            <Text style={{ fontSize: 11 }}>Quran Shareef</Text>
          </Pressable>

          {/* QIBLA */}
          <Pressable
            onPress={() => setActiveTab("qibla")}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <MaterialCommunityIcons
              name="compass-outline"
              size={22}
              color={activeTab === "qibla" ? "#2e9e5b" : "#888"}
            />
            <Text style={{ fontSize: 11 }}>Qibla</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}
