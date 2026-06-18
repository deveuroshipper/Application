import Icon from "@/assets/icons";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const BASE = "https://countriesnow.space/api/v0.1";

type Mode = "country" | "state" | "city";

type LocationItem = {
  name: string;
  iso2?: string;
};

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
  const [items, setItems] = useState<LocationItem[]>([]);
  const [filtered, setFiltered] = useState<LocationItem[]>([]);
  const [search, setSearch] = useState("");
  const cacheRef = useRef<Record<string, LocationItem[]>>({});

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
      let list: LocationItem[] = [];

      if (mode === "country") {
        const res = await fetch(`${BASE}/countries/states`);
        const json = await res.json();
        list = (json.data as any[])
          .map((c) => ({
            name: c.name,
            iso2: c.iso2,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
      } else if (mode === "state") {
        const res = await fetch(`${BASE}/countries/states`);
        const json = await res.json();
        const found = (json.data as any[]).find(
          (c) => c.name?.toLowerCase() === country?.toLowerCase(),
        );
        list = found
          ? (found.states as any[])
              .map((s: any) => ({ name: s.name }))
              .sort((a, b) => a.name.localeCompare(b.name))
          : [];
      } else {
        const res = await fetch(
          `${BASE}/countries/state/cities/q?country=${encodeURIComponent(
            country ?? "",
          )}&state=${encodeURIComponent(state ?? "")}`,
        );
        const json = await res.json();
        list = Array.isArray(json.data)
          ? (json.data as string[])
              .map((city) => ({ name: city }))
              .sort((a, b) => a.name.localeCompare(b.name))
          : [];
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
    setFiltered(items.filter((item) => item.name.toLowerCase().includes(q)));
  };

  const handleSelect = (item: LocationItem) => {
    onSelect(item.name);
    setModalVisible(false);
    setSearch("");
    setFiltered(items);
  };

  const getFlagUrl = (item?: LocationItem) => {
    if (mode !== "country" || !item?.iso2) return "";
    return `https://flagsapi.com/${item.iso2.toUpperCase()}/flat/64.png`;
  };

  const selectedCountry = items.find(
    (item) => item.name.toLowerCase() === value.toLowerCase(),
  );
  const selectedFlagUrl = getFlagUrl(selectedCountry);

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
        className={`flex-row items-center justify-between px-6 py-4 bg-white  rounded-2xl ${
          disabled
            ? "border-[1.5px] opacity-50 border-[#B5C3E8]/30 rounded-2xl "
            : "border-[1.5px] border-[#B5C3E8]/30 rounded-2xl "
        }`}
      >
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <>
            {!!selectedFlagUrl && (
              <Image
                source={{ uri: selectedFlagUrl }}
                className="w-8 h-6 rounded-md mr-3"
              />
            )}
            <Text
              className={`font-inter-medium capitalize text-csm flex-1 ${
                value ? "text-primary" : "text-primary/30"
              }`}
            >
              {value || placeholder}
            </Text>
            <Text className="text-primary/40 text-xs ml-2">
              <Icon name="Arrow" size={18} />
            </Text>
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
            <Text className="text-primary font-space-grotesk-bold text-csl">
              {titleMap[mode]}
            </Text>
            <Pressable
              style={{ transform: [{ rotate: "45deg" }] }}
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-primary/50 text-base">
                <Icon size={20} name="Plus" />
              </Text>
            </Pressable>
          </View>

          <TextInput
            value={search}
            onChangeText={handleSearch}
            style={{ paddingVertical: 10 }}
            placeholder={`Search ${mode}...`}
            className={`flex mb-6 gap-2 flex-row px-6 bg-white border-[1.5px] border-[#B5C3E8]/30 rounded-2xl font-inter text-cno placeholder:color-primary/30 `}
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
              keyExtractor={(item) => `${item.name}-${item.iso2 ?? ""}`}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item, index }) => (
                <Pressable
                  key={item?.name || item || index}
                  onPress={() => handleSelect(item)}
                  className="flex-row items-center py-3 border-b border-primary/5"
                >
                  {!!getFlagUrl(item) && (
                    <Image
                      source={{ uri: getFlagUrl(item) }}
                      className="w-11 h-8 rounded-md mr-3"
                    />
                  )}
                  <Text
                    className={`flex-1 font-inter-medium text-csm ${
                      item.name === value
                        ? "text-primary font-inter-bold"
                        : "text-primary"
                    }`}
                  >
                    {item.name}
                  </Text>
                  {item.name === value && (
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
