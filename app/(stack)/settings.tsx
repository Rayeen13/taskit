import { useAppColors } from "@/app/hooks/useAppColors";
import { useTheme } from "@/services/themeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { theme, setTheme, updateCustomTheme } = useTheme();
  const colors = useAppColors();
  const router = useRouter();

  const data = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { category: "Classic", label: "Dark Pro", value: "dark_pro" },
    { category: "Classic", label: "Rider", value: "rider" },
    { category: "Classic", label: "Midnight", value: "midnight" },
    { category: "Popular", label: "Nord", value: "nord" },
    { category: "Popular", label: "Dracula", value: "dracula" },
    { category: "Popular", label: "One Dark", value: "one_dark" },
    { category: "Popular", label: "Solarized Dark", value: "solarized_dark" },
    { category: "Warm to Cool", label: "Sunset", value: "sunset" },
    { category: "Warm to Cool", label: "Forest", value: "forest" },
    { category: "IDE", label: "VS Code Dark", value: "vscode_dark" },
    { category: "IDE", label: "JetBrains Dark", value: "jetbrains_dark" },
    { category: "IDE", label: "Material Design", value: "material_dark" },
    { category: "IDE", label: "Gruvbox Dark", value: "gruvbox_dark" },
    { category: "IDE", label: "Tokyo Night", value: "tokyo_night" },
  ];

  const presetThemes: {
    [key: string]: {
      background: string;
      card: string;
      text: string;
      subText: string;
      border: string;
    };
  } = {
    dark_pro: {
      background: "#0a0a0a",
      card: "#121212",
      text: "#ffffff",
      subText: "#aaaaaa",
      border: "#222222",
    },
    rider: {
      background: "#1e1f22",
      card: "#2b2d30",
      text: "#e6e6e6",
      subText: "#9ca3af",
      border: "#3a3d41",
    },
    midnight: {
      background: "#111827",
      card: "#1f2937",
      text: "#f9fafb",
      subText: "#9ca3af",
      border: "#374151",
    },
    nord: {
      background: "#2e3440",
      card: "#3b4252",
      text: "#eceff4",
      subText: "#d8dee9",
      border: "#434c5e",
    },
    dracula: {
      background: "#282a36",
      card: "#44475a",
      text: "#f8f8f2",
      subText: "#f1fa8c",
      border: "#6272a4",
    },
    one_dark: {
      background: "#282c34",
      card: "#3e4451",
      text: "#abb2bf",
      subText: "#828997",
      border: "#4c5a75",
    },
    solarized_dark: {
      background: "#002b36",
      card: "#073642",
      text: "#839496",
      subText: "#586e75",
      border: "#268bd2",
    },
    sunset: {
      background: "#2a1810",
      card: "#3d2417",
      text: "#f5d5a8",
      subText: "#e8b996",
      border: "#d4735f",
    },
    forest: {
      background: "#0d2b1f",
      card: "#1a3d2a",
      text: "#a8e6d1",
      subText: "#7ecfb8",
      border: "#2d5a45",
    },
    vscode_dark: {
      background: "#1e1e1e",
      card: "#252526",
      text: "#d4d4d4",
      subText: "#858585",
      border: "#3e3e42",
    },
    jetbrains_dark: {
      background: "#2b2d30",
      card: "#3c3f46",
      text: "#e8e8e8",
      subText: "#a0a0a0",
      border: "#555759",
    },
    material_dark: {
      background: "#121212",
      card: "#1e1e1e",
      text: "#ffffff",
      subText: "#b0bec5",
      border: "#2c2c2c",
    },
    gruvbox_dark: {
      background: "#282828",
      card: "#3c3836",
      text: "#ebdbb2",
      subText: "#bdae93",
      border: "#504945",
    },
    tokyo_night: {
      background: "#1a1b26",
      card: "#292e42",
      text: "#c0caf5",
      subText: "#7aa2f7",
      border: "#3f3f59",
    },
  };

  const MenuItem = ({ icon, label, onPress }: any) => (
    <Pressable
      android_ripple={{ color: colors.border }}
      style={({ pressed }) => [styles.menuItem, { opacity: pressed ? 0.6 : 1 }]}
      onPress={onPress}
    >
      <MaterialIcons name={icon} size={20} color={colors.text} />
      <Text style={[styles.menuText, { color: colors.text }]}>{label}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: colors.background }]}
      edges={["top", "left", "right", "bottom"]}
    >
      <Stack.Screen
        options={{
          title: "Settings",
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text },
          headerTintColor: colors.text,
          headerShown: true,
        }}
      />

      <View style={styles.container}>
        {/* APPEARANCE */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Appearance
          </Text>

          <Dropdown
            style={[
              styles.dropdown,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
            containerStyle={{
              backgroundColor: colors.card,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
              maxHeight: 250,
            }}
            itemTextStyle={{ color: colors.text }}
            selectedTextStyle={{ color: colors.text }}
            placeholderStyle={{ color: colors.subText }}
            data={data}
            labelField="label"
            valueField="value"
            value={theme}
            onChange={(item) => {
              setTheme(item.value as any);
              if (presetThemes[item.value]) {
                updateCustomTheme(presetThemes[item.value]);
              }
            }}
            renderItem={(item: any) => {
              return (
                <View>
                  {item.category && (
                    <Text
                      style={{
                        padding: 10,
                        paddingBottom: 4,
                        color: colors.subText,
                        fontSize: 11,
                        fontWeight: "600",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.category}
                    </Text>
                  )}
                  <View
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      backgroundColor:
                        item.value === theme ? colors.border : colors.card,
                    }}
                  >
                    <Text style={{ color: colors.text, fontSize: 14 }}>
                      {item.label}
                    </Text>
                  </View>
                </View>
              );
            }}
          />

          <MenuItem icon="file-upload" label="Export Theme" />
          <MenuItem icon="file-download" label="Import Theme" />
        </View>

        {/* CUSTOM */}
        {theme === "custom" && (
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Customize Theme
            </Text>

            <MenuItem
              icon="palette"
              label="Dark Blue"
              onPress={() =>
                updateCustomTheme({
                  background: "#0f172a",
                  card: "#1e293b",
                  text: "#ffffff",
                  subText: "#94a3b8",
                  border: "#334155",
                })
              }
            />

            <MenuItem
              icon="palette"
              label="Warm Light"
              onPress={() =>
                updateCustomTheme({
                  background: "#fff7ed",
                  card: "#ffedd5",
                  text: "#7c2d12",
                  subText: "#9a3412",
                  border: "#fdba74",
                })
              }
            />

            <MenuItem
              icon="palette"
              label="Midnight"
              onPress={() =>
                updateCustomTheme({
                  background: "#111827",
                  card: "#1f2937",
                  text: "#f9fafb",
                  subText: "#9ca3af",
                  border: "#374151",
                })
              }
            />

            <MenuItem icon="file-upload" label="Export Theme (.taskit.json)" />
          </View>
        )}

        {/* GENERAL */}
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            General
          </Text>

          <MenuItem icon="file-upload" label="Export Notes" />
          <MenuItem icon="file-download" label="Import Notes" />
          <MenuItem icon="backup" label="Backup" />

          <MenuItem
            icon="info-outline"
            label="About"
            onPress={() => router.push("/about")}
          />
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
    padding: 14,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
  },

  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 4,
  },

  menuText: {
    fontSize: 14,
  },
});
