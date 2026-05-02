import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type Props = {
  selected: string;
  onChange: (val: string) => void;
  show: boolean;
  setShow: (v: boolean) => void;
};

export default function LanguageDropdown({
  selected,
  onChange,
  show,
  setShow,
}: Props) {
  const options = ["roman", "urdu", "hindi"];

  const getLabel = (l: string) =>
    l === "roman" ? "Roman Urdu" : l === "urdu" ? "Urdu" : "Hindi";

  return (
    <View style={{ marginLeft: 8 }}>
      {/* BUTTON */}
      <Pressable
        onPress={() => setShow(!show)}
        style={{
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 12,
          elevation: 2,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          minWidth: 130,
        }}
      >
        {/* LEFT ICON + TEXT */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons name="translate" size={18} color="#666" />
          <Text style={{ marginLeft: 6 }}>{getLabel(selected)}</Text>
        </View>

        {/* RIGHT ICON */}
        <MaterialCommunityIcons name="chevron-down" size={18} color="#666" />
      </Pressable>

      {/* DROPDOWN */}
      {show && (
        <View
          style={{
            position: "absolute",
            top: 50,
            right: 0,
            backgroundColor: "#fff",
            borderRadius: 12,
            elevation: 10,
            zIndex: 9999,
            minWidth: 153,
          }}
        >
          {options.map((l) => (
            <Pressable
              key={l}
              onPress={() => {
                onChange(l);
                setShow(false);
              }}
              style={{
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* <MaterialCommunityIcons name="translate" size={16} color="#666" /> */}
              <Text style={{ marginLeft: 8 }}>{getLabel(l)}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
