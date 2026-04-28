import { useAppColors } from "@/app/hooks/useAppColors";
import { Stack } from "expo-router";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AboutScreen() {
  const colors = useAppColors();

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={["top", "left", "right", "bottom"]}
    >
      <Stack.Screen
        options={{
          title: "About",
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text },
          headerTintColor: colors.text,
          headerShown: true,
        }}
      />

      <View style={styles.container}>
        {/* 🔥 HERO CARD */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.appName, { color: colors.text }]}>Taskit</Text>

          <Text style={[styles.version, { color: colors.subText }]}>
            Version 1.0.0
          </Text>

          <Text style={[styles.desc, { color: colors.text }]}>
            A simple, fast, and clean notes app built to help you capture ideas
            instantly and stay organized.
          </Text>
        </View>

        {/* 🔥 LINKS CARD */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Connect
          </Text>

          <Pressable
            style={styles.item}
            onPress={() =>
              Linking.openURL("https://github.com/Rayeen13/Taskit")
            }
          >
            <Text style={[styles.itemText, { color: colors.text }]}>
              GitHub Repository
            </Text>
          </Pressable>

          <Pressable
            style={styles.item}
            onPress={() => Linking.openURL("mailto:support@taskit.com")}
          >
            <Text style={[styles.itemText, { color: colors.text }]}>
              Contact Support
            </Text>
          </Pressable>
        </View>

        {/* 🔥 INFO CARD */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About App
          </Text>

          <Text style={[styles.infoText, { color: colors.subText }]}>
            Built with React Native + Expo. Designed for simplicity, speed, and
            focus — no clutter, just notes.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  container: {
    flex: 1,
    padding: 16,
    gap: 14,
  },

  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
  },

  appName: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },

  version: {
    fontSize: 12,
    marginBottom: 10,
  },

  desc: {
    fontSize: 14,
    lineHeight: 20,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },

  item: {
    paddingVertical: 10,
  },

  itemText: {
    fontSize: 14,
  },

  infoText: {
    fontSize: 13,
    lineHeight: 18,
  },
});
