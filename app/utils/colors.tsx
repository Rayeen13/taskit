import { ThemeColors } from "@/services/themeContext";
export const COLORS = [
  "#ffffff",
  "#f28b82",
  "#fbbc04",
  "#fff475",
  "#ccff90",
  "#a7ffeb",
  "#cbf0f8",
  "#aecbfa",
  "#d7aefb",
];

export const LIGHT: ThemeColors = {
  background: "#f8f9fa",
  card: "#ffffff",
  text: "#111",
  subText: "#666",
  border: "#e0e0e0",
};

export const DARK: ThemeColors = {
  background: "#121212",
  card: "#1e1e1e",
  text: "#ffffff",
  subText: "#aaa",
  border: "#333",
};
export const getRandomColor = () => {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
};
