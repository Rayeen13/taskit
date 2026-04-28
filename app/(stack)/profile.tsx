import { useAppColors } from "@/app/hooks/useAppColors";
import { useAuth } from "@/services/authContext";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { userProfile, updateUserProfile } = useAuth();
  const colors = useAppColors();
  const [selectedImage, setSelectedImage] = useState<string | null>(
    userProfile?.avatar || null,
  );
  const { firstTime } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (firstTime) {
      alert("Choose your avatar");
    }
  }, []);

  useEffect(() => {
    if (firstTime) {
      router.setParams({});
    }
  }, []);

  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        setSelectedImage(uri);
        if (userProfile) {
          await updateUserProfile({
            ...userProfile,
            avatar: uri,
          });
        }
      }
    } catch (error) {
      console.log("Image picker error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatLastUpdated = (timestamp: number | undefined) => {
    if (!timestamp) return "Never";

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["left", "right", "bottom"]}
    >
      <>
        <Stack.Screen
          options={{
            headerStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
            headerTitle: "Profile",
            headerTitleStyle: { color: colors.text },
            headerBackVisible: !firstTime,
            gestureEnabled: !firstTime,
          }}
        />

        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          {/* 🔥 AVATAR SECTION */}
          <View style={styles.avatarSection}>
            <View
              style={[
                styles.avatarContainer,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              {selectedImage ? (
                <Image
                  source={{
                    uri:
                      selectedImage ||
                      userProfile?.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        userProfile?.name || "User",
                      )}&background=random&color=fff&bold=true`,
                  }}
                  style={styles.avatar}
                />
              ) : (
                <FontAwesome name="user" size={60} color={colors.subText} />
              )}

              {/* 🔥 EDIT BUTTON (PEN ICON) */}
              <Pressable
                onPress={pickImage}
                style={[
                  styles.editButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color={colors.text} />
                ) : (
                  <FontAwesome name="pencil" size={14} color={colors.text} />
                )}
              </Pressable>
            </View>
          </View>

          {/* 🔥 INFO SECTION */}
          <View style={styles.infoSection}>
            {/* NAME */}
            <View style={styles.infoItem}>
              <Text style={[styles.label, { color: colors.subText }]}>
                Name
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {userProfile?.name || "N/A"}
              </Text>
            </View>

            {/* EMAIL */}
            <View style={[styles.infoItem, { borderTopColor: colors.border }]}>
              <Text style={[styles.label, { color: colors.subText }]}>
                Email
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {userProfile?.email || "N/A"}
              </Text>
            </View>

            {/* LAST UPDATED */}
            <View style={[styles.infoItem, { borderTopColor: colors.border }]}>
              <Text style={[styles.label, { color: colors.subText }]}>
                Last Updated
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {formatLastUpdated(userProfile?.lastUpdated)}
              </Text>
            </View>
          </View>
        </View>
        {firstTime && (
          <View style={styles.bottomBar}>
            <Pressable
              style={({ pressed }) => [
                styles.continueBtn,
                pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
              ]}
              onPress={() => router.replace("/")}
            >
              <Text style={styles.continueText}>Continue</Text>
            </Pressable>
          </View>
        )}
      </>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  avatarSection: {
    alignItems: "center",
    marginBottom: 40,
  },

  avatarContainer: {
    position: "relative",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    overflow: "hidden",
  },

  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 60,
  },

  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
  },

  infoSection: {
    marginTop: 20,
  },

  infoItem: {
    paddingVertical: 16,
    borderTopWidth: 1,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    letterSpacing: 0.5,
  },

  value: {
    fontSize: 16,
    fontWeight: "500",
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 60,
    paddingHorizontal: 20,
  },

  continueBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#1da1f2",

    justifyContent: "center",
    alignItems: "center",

    // 🔥 premium shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },

  continueText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
