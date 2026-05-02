import { useAppColors } from "@/app/hooks/useAppColors";
import { Stack } from "expo-router";

export default function StackLayout() {
  const colors = useAppColors();

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Notes" }} />
      <Stack.Screen name="create" options={{ title: "Create Note" }} />
      <Stack.Screen name="note/[id]" options={{ title: "Edit Note" }} />
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="about" options={{ title: "About" }} />
      <Stack.Screen
        name="islamicishtehar/home"
        options={{ title: "Islamic Home" }}
      />

      <Stack.Screen
        name="islamicishtehar/hadees"
        options={{ title: "Hadees Sharif" }}
      />
    </Stack>
  );
}
