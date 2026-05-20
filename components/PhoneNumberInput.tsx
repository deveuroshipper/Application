import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput as RNTextInput,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface Country {
  name: { common: string };
  idd: { root: string; suffixes?: string[] };
  flag: string;
}

interface SelectedCountry {
  dialCode: string;
  flag: string;
  name: string;
}

const getDialCode = (idd: Country["idd"]): string => {
  if (!idd?.root) return "";
  if (idd.suffixes?.length === 1) return idd.root + idd.suffixes[0];
  return idd.root;
};

const DEFAULT_COUNTRY: SelectedCountry = {
  dialCode: "+1",
  flag: "🇺🇸",
  name: "United States",
};

const PhoneNumberInput = ({
  label,
  placeholderTxt,
  value,
  onChange,
  selectedCode,
  onCodeChange,
}: {
  label: String;
  placeholderTxt: String;
  value: any;
  onChange: any;
  selectedCode?: SelectedCountry;
  onCodeChange?: (country: SelectedCountry) => void;
}) => {
  const [countries, setCountries] = useState<SelectedCountry[]>([]);
  const [filtered, setFiltered] = useState<SelectedCountry[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SelectedCountry>(
    selectedCode ?? DEFAULT_COUNTRY
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
        "https://restcountries.com/v3.1/all?fields=name,idd,flag"
      );
      const data: Country[] = await res.json();
      const mapped: SelectedCountry[] = data
        .filter((c) => c.idd?.root)
        .map((c) => ({
          name: c.name.common,
          flag: c.flag,
          dialCode: getDialCode(c.idd),
        }))
        .filter((c) => c.dialCode)
        .sort((a, b) => a.name.localeCompare(b.name));
      setCountries(mapped);
      setFiltered(mapped);
    } catch {
      // silently fall back to current selection
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
        (c) =>
          c.name.toLowerCase().includes(q) || c.dialCode.includes(q)
      )
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

      <View className="flex gap-2 flex-row items-center px-6 py-2 bg-white border-[2.5px] border-primary/10 rounded-2xl font-inter-medium text-csm placeholder:color-primary/30">
        <Pressable
          onPress={fetchCountries}
          className="flex-row items-center gap-1 pr-2 border-r border-primary/20"
        >
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <>
              <Text className="text-lg">{selected.flag}</Text>
              <Text className="text-csm font-inter-medium text-primary">
                {selected.dialCode}
              </Text>
              <Text className="text-primary/40 text-xs">▾</Text>
            </>
          )}
        </Pressable>

        <TextInput
          value={value}
          onChangeText={onChange}
          className="flex-1"
          placeholder={placeholderTxt as string}
          keyboardType="phone-pad"
        />
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-white px-4 pt-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-primary font-space-grotesk-bold text-lg">
              Select Country
            </Text>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text className="text-primary/50 text-base">✕</Text>
            </Pressable>
          </View>

          <RNTextInput
            value={search}
            onChangeText={handleSearch}
            placeholder="Search country or code..."
            className="bg-primary/5 rounded-xl px-4 py-3 mb-4 text-primary font-inter-medium"
            autoFocus
          />

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.name + item.dialCode}
            keyboardShouldPersistTaps="handled"
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
