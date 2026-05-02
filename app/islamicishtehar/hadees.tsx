import { getHadees } from "@/services/islamicIshterharApi";
import { useEffect, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";

export default function HadeesScreen() {
  const [data, setData] = useState<any[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    getHadees().then((res) => setData(res.data || []));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f5f7" }}>
      {/* HEADER */}
      <View
        style={{
          backgroundColor: "#2e9e5b",
          paddingTop: 40,
          paddingBottom: 20,
          paddingHorizontal: 16,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "700" }}>
          Hadees Sharif
        </Text>
      </View>

      {/* SEARCH */}
      <View style={{ padding: 12 }}>
        <TextInput
          placeholder="Search Hadees..."
          value={query}
          onChangeText={setQuery}
          style={{
            backgroundColor: "#fff",
            padding: 12,
            borderRadius: 12,
            elevation: 2,
          }}
        />
      </View>

      {/* LIST */}
      <FlatList
        data={data}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#fff",
              margin: 10,
              padding: 14,
              borderRadius: 14,
              elevation: 2,
            }}
          >
            <Text style={{ fontWeight: "600", marginBottom: 6 }}>
              {item.title}
            </Text>

            <Text style={{ lineHeight: 22 }}>{item.text}</Text>

            <Text style={{ marginTop: 10, color: "#2e9e5b" }}>(Reference)</Text>
          </View>
        )}
      />
    </View>
  );
}
