import { getThemeColors, useTheme } from "@/services/themeContext";

export function useAppColors() {
  const { theme, customTheme } = useTheme();
  return getThemeColors(theme, customTheme);
}
