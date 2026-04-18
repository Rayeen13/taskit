import { Stack } from "expo-router";
import { NotesProvider } from "@/services/notesContext";

export default function RootLayout() {
  return (
    <NotesProvider>
      <Stack />
    </NotesProvider>
  );
}
