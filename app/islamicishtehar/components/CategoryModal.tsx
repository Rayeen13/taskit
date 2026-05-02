import { useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  categories: string[];
  onSelect: (c: string | null) => void;
};

export default function CategoryModal({
  visible,
  onClose,
  categories,
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");

  const filtered = categories.filter((c) =>
    c.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 16,
            maxHeight: "70%",
          }}
        >
          <TextInput
            placeholder="Search category..."
            value={query}
            onChangeText={setQuery}
            style={{
              backgroundColor: "#f3f3f3",
              padding: 10,
              borderRadius: 10,
              marginBottom: 10,
            }}
          />

          {filtered.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No Categories Available
            </Text>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item, i) => i.toString()}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                  style={{ paddingVertical: 12 }}
                >
                  <Text>{item}</Text>
                </Pressable>
              )}
            />
          )}

          <Pressable onPress={onClose} style={{ marginTop: 10 }}>
            <Text style={{ textAlign: "center", color: "#2e9e5b" }}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
