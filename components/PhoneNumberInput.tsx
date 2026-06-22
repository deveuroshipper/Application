import Icon from "@/assets/icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  TextInput as RNTextInput,
  Text,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface Country {
  name: string;
  dial_code?: string;
  code?: string;
}

interface SelectedCountry {
  dialCode: string;
  flag: string;
  name: string;
}

const getFlagEmoji = (countryCode?: string) => {
  if (!countryCode || countryCode.length !== 2) return "🏳️";

  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

const DEFAULT_COUNTRY: SelectedCountry = {
  dialCode: "+1",
  flag: "🇺🇸",
  name: "United States",
};

const FALLBACK_COUNTRIES: SelectedCountry[] = [
  DEFAULT_COUNTRY,
  { name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { name: "India", dialCode: "+91", flag: "🇮🇳" },
  { name: "Belgium", dialCode: "+32", flag: "🇧🇪" },
  { name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪" },
];

const PhoneNumberInput = ({
  label,
  placeholderTxt,
  value,
  onChange,
  selectedCode,
  onCodeChange,
  disableCode = false,
  error = "",
}: {
  label: String;
  placeholderTxt: String;
  value: any;
  onChange: any;
  selectedCode?: SelectedCountry;
  onCodeChange?: (country: SelectedCountry) => void;
  disableCode?: boolean;
  error?: string;
}) => {
  const [countries, setCountries] = useState<SelectedCountry[]>([]);
  const [filtered, setFiltered] = useState<SelectedCountry[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SelectedCountry>(
    selectedCode ?? DEFAULT_COUNTRY,
  );

  useEffect(() => {
    if (selectedCode) setSelected(selectedCode);
  }, [selectedCode]);

  const fetchCountries = async () => {
    if (countries.length > 0) {
      setModalVisible(true);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/codes",
      );
      const json = await res.json();
      const data: Country[] = Array.isArray(json?.data) ? json.data : [];
      const mapped: SelectedCountry[] = data
        .filter((c) => c.name && c.dial_code)
        .map((c) => ({
          name: c.name,
          flag: getFlagEmoji(c.code),
          dialCode: c.dial_code ?? "",
        }))
        .filter((c) => c.dialCode)
        .sort((a, b) => a.name.localeCompare(b.name));
      const countryList = mapped.length > 0 ? mapped : FALLBACK_COUNTRIES;
      setCountries(countryList);
      setFiltered(countryList);
    } catch {
      setCountries(FALLBACK_COUNTRIES);
      setFiltered(FALLBACK_COUNTRIES);
    } finally {
      setLoading(false);
      setModalVisible(true);
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    const q = text.toLowerCase();
    setFiltered(
      countries.filter(
        (c) => c.name.toLowerCase().includes(q) || c.dialCode.includes(q),
      ),
    );
  };

  const handleSelect = (country: SelectedCountry) => {
    setSelected(country);
    onCodeChange?.(country);
    setModalVisible(false);
    setSearch("");
    setFiltered(countries);
  };

  return (
    <View>
      <Text className="text-csm uppercase mt-2 mb-3 text-primary font-inter-medium">
        {label}
      </Text>

      <View className="flex gap-2 flex-row items-center px-6 py-2 bg-white border-[1.5px] border-[#B5C3E8]/30 rounded-2xl font-inter-medium text-csm placeholder:color-primary/80">
        <Pressable
          onPress={disableCode ? undefined : fetchCountries}
          disabled={disableCode}
          className={`flex-row items-center gap-1 pr-2 border-r border-primary/20 ${
            disableCode ? "opacity-60" : ""
          }`}
        >
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <>
              <Text className="text-lg">{selected.flag}</Text>
              <Text className="text-csm font-inter-medium text-primary">
                {selected.dialCode}
              </Text>
              {!disableCode && (
                <Text className="text-primary/40 text-xs">▾</Text>
              )}
            </>
          )}
        </Pressable>

        <TextInput
          value={value}
          onChangeText={onChange}
          className="flex-1"
          placeholder={placeholderTxt as string}
          keyboardType="phone-pad"
          placeholderTextColor={"#C3C5C9"}
          style={{ paddingVertical: 10 }}
        />
      </View>

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
              Select Country
            </Text>
            <Pressable
              style={{ transform: [{ rotate: "45deg" }] }}
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-primary/50 text-base">
                {" "}
                <Icon size={20} name="Plus" />
              </Text>
            </Pressable>
          </View>

          <RNTextInput
            value={search}
            onChangeText={handleSearch}
            style={{ paddingVertical: 20 }}
            placeholder="Search country or code..."
            className={`flex mb-6 gap-2 flex-row px-6 bg-white border-[1.5px] border-[#B5C3E8]/30 rounded-2xl font-inter text-cno placeholder:color-primary/30 `}
            autoFocus
          />

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.name + item.dialCode}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-10">
                <Text className="text-primary/40 font-inter-medium">
                  No countries found
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelect(item)}
                className="flex-row items-center gap-3 py-3 border-b border-primary/5"
              >
                <Text className="text-2xl">{item.flag}</Text>
                <Text className="flex-1 text-primary font-inter-medium text-csm">
                  {item.name}
                </Text>
                <Text className="text-primary/50 font-inter-medium text-csm">
                  {item.dialCode}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

export default PhoneNumberInput;
