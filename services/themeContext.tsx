import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

/* 🔥 SINGLE SOURCE OF TRUTH FOR COLORS */
export type ThemeColors = {
  background: string;
  card: string;
  text: string;
  subText: string;
  border: string;
};

/* 🔥 THEME TYPES */
export type ThemeType =
  | "light"
  | "dark"
  | "custom"
  | "dark_pro"
  | "rider"
  | "midnight"
  | "nord"
  | "dracula"
  | "one_dark"
  | "solarized_dark"
  | "sunset"
  | "forest"
  | "vscode_dark"
  | "jetbrains_dark"
  | "material_dark"
  | "gruvbox_dark"
  | "tokyo_night";

/* 🔥 CONTEXT TYPE */
type ThemeContextType = {
  theme: ThemeType;
  customTheme: ThemeColors;
  setTheme: (t: ThemeType) => Promise<void>;
  updateCustomTheme: (updates: Partial<ThemeColors>) => Promise<void>;
};

/* 🔥 CONTEXT */
const ThemeContext = createContext<ThemeContextType | null>(null);

/* 🔥 STORAGE KEYS */
const STORAGE_KEY = "TASKIT_THEME";
const CUSTOM_KEY = "TASKIT_CUSTOM_THEME";

/* 🔥 DEFAULT CUSTOM THEME */
const DEFAULT_CUSTOM: ThemeColors = {
  background: "#ffffff",
  card: "#ffffff",
  text: "#111111",
  subText: "#666666",
  border: "#e0e0e0",
};

/* 🔥 PRESET THEMES */
export const PRESET_THEMES: {
  [key: string]: ThemeColors;
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

export function getThemeColors(
  theme: ThemeType,
  customTheme: ThemeColors,
): ThemeColors {
  if (theme === "dark") {
    return {
      background: "#121212",
      card: "#1e1e1e",
      text: "#ffffff",
      subText: "#aaa",
      border: "#333",
    };
  }

  if (theme === "light") {
    return {
      background: "#f8f9fa",
      card: "#ffffff",
      text: "#111",
      subText: "#666",
      border: "#e0e0e0",
    };
  }

  return PRESET_THEMES[theme] ?? customTheme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>("light");
  const [customTheme, setCustomTheme] = useState<ThemeColors>(DEFAULT_CUSTOM);

  /* 🔥 LOAD FROM STORAGE */
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(STORAGE_KEY);
        const storedCustom = await AsyncStorage.getItem(CUSTOM_KEY);

        let loadedTheme: ThemeType = "light";
        if (
          storedTheme === "light" ||
          storedTheme === "dark" ||
          storedTheme === "custom" ||
          storedTheme === "dark_pro" ||
          storedTheme === "rider" ||
          storedTheme === "midnight" ||
          storedTheme === "nord" ||
          storedTheme === "dracula" ||
          storedTheme === "one_dark" ||
          storedTheme === "solarized_dark" ||
          storedTheme === "sunset" ||
          storedTheme === "forest" ||
          storedTheme === "vscode_dark" ||
          storedTheme === "jetbrains_dark" ||
          storedTheme === "material_dark" ||
          storedTheme === "gruvbox_dark" ||
          storedTheme === "tokyo_night"
        ) {
          loadedTheme = storedTheme as ThemeType;
        }

        setThemeState(loadedTheme);

        // Initialize customTheme - either from storage or from preset
        if (storedCustom && loadedTheme === "custom") {
          setCustomTheme(JSON.parse(storedCustom));
        } else if (PRESET_THEMES[loadedTheme]) {
          setCustomTheme(PRESET_THEMES[loadedTheme]);
        }
      } catch (e) {
        console.log("Theme load error:", e);
      }
    };

    loadTheme();
  }, []);

  /* 🔥 SET THEME */
  const setTheme = async (t: ThemeType) => {
    try {
      setThemeState(t);
      if (PRESET_THEMES[t]) {
        setCustomTheme(PRESET_THEMES[t]);
      }
      await AsyncStorage.setItem(STORAGE_KEY, t);
    } catch (e) {
      console.log("Theme save error:", e);
    }
  };

  /* 🔥 UPDATE CUSTOM THEME */
  const updateCustomTheme = async (updates: Partial<ThemeColors>) => {
    try {
      const updated = { ...customTheme, ...updates };
      setCustomTheme(updated);
      await AsyncStorage.setItem(CUSTOM_KEY, JSON.stringify(updated));
    } catch (e) {
      console.log("Custom theme save error:", e);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        customTheme,
        setTheme,
        updateCustomTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/* 🔥 HOOK */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return ctx;
}
