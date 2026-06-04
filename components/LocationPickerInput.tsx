import Icon from "@/assets/icons";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const BASE = "https://countriesnow.space/api/v0.1";

type Mode = "country" | "state" | "city";

interface Props {
  mode: Mode;
  label: string;
  placeholder: string;
  value: string;
  country?: string;
  state?: string;
  onSelect: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const LocationPickerInput = ({
  mode,
  label,
  placeholder,
  value,
  country,
  state,
  onSelect,
  error = "",
  disabled = false,
}: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const cacheRef = useRef<Record<string, string[]>>({});

  const getCacheKey = () => {
    if (mode === "country") return "countries";
    if (mode === "state") return `states:${country}`;
    return `cities:${country}:${state}`;
  };

  const fetchItems = async () => {
    const key = getCacheKey();
    if (cacheRef.current[key]) {
      const cached = cacheRef.current[key];
      setItems(cached);
      setFiltered(cached);
      setModalVisible(true);
      return;
    }

    setLoading(true);
    try {
      let list: string[] = [];

      if (mode === "country") {
        const res = await fetch(`${BASE}/countries/states`);
        const json = await res.json();
        list = (json.data as any[]).map((c) => c.name).sort();
      } else if (mode === "state") {
        const res = await fetch(`${BASE}/countries/states`);
        const json = await res.json();
        const found = (json.data as any[]).find(
          (c) => c.name.toLowerCase() === country?.toLowerCase(),
        );
        list = found
          ? (found.states as any[]).map((s: any) => s.name).sort()
          : [];
      } else {
        const res = await fetch(
          `${BASE}/countries/state/cities/q?country=${encodeURIComponent(
            country ?? "",
          )}&state=${encodeURIComponent(state ?? "")}`,
        );
        const json = await res.json();
        list = Array.isArray(json.data) ? (json.data as string[]).sort() : [];
      }

      cacheRef.current[key] = list;
      setItems(list);
      setFiltered(list);
    } catch {
      // silently keep modal empty
    } finally {
      setLoading(false);
      setModalVisible(true);
    }
  };

  const handleOpen = () => {
    if (disabled) return;
    fetchItems();
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    const q = text.toLowerCase();
    setFiltered(items.filter((item) => item.toLowerCase().includes(q)));
  };

  const handleSelect = (item: string) => {
    onSelect(item);
    setModalVisible(false);
    setSearch("");
    setFiltered(items);
  };

  const titleMap: Record<Mode, string> = {
    country: "Select Country",
    state: "Select State",
    city: "Select City",
  };

  return (
    <View>
      <Text className="text-csm uppercase mt-2 mb-3 text-primary font-inter-medium">
        {label}
      </Text>

      <Pressable
        onPress={handleOpen}
        className={`flex-row items-center justify-between px-6 py-4 bg-white border-[2.5px] rounded-2xl ${
          disabled ? "border-primary/5 opacity-40" : "border-primary/10"
        }`}
      >
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <>
            <Text
              className={`font-inter-medium capitalize text-csm flex-1 ${
                value ? "text-primary" : "text-primary/30"
              }`}
            >
              {value || placeholder}
            </Text>
            <Text className="text-primary/40 text-xs ml-2"><Icon name="Arrow" size={18} /></Text>
          </>
        )}
      </Pressable>

      <Text className="text-[12px] font-inter-medium ml-1 mt-1 text-red-500">
        {error}
      </Text>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-white px-4 pt-10">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-primary font-space-grotesk-bold text-lg">
              {titleMap[mode]}
            </Text>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text className="text-primary/50 text-base">✕</Text>
            </Pressable>
          </View>

          <TextInput
            value={search}
            onChangeText={handleSearch}
            placeholder={`Search ${mode}...`}
            className="bg-primary/5 rounded-xl px-4 py-3 mb-4 text-primary font-inter-medium"
            autoFocus
          />

          {filtered.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-primary/40 font-inter-medium">
                No results found
              </Text>
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => handleSelect(item)}
                  className="flex-row items-center py-3 border-b border-primary/5"
                >
                  <Text
                    className={`flex-1 font-inter-medium text-csm ${
                      item === value
                        ? "text-primary font-inter-bold"
                        : "text-primary"
                    }`}
                  >
                    {item}
                  </Text>
                  {item === value && (
                    <Text className="text-primary text-xs">
                      <Icon name="Check" />
                    </Text>
                  )}
                </Pressable>
              )}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default LocationPickerInput;
