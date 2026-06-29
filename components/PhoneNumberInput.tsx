import Icon from "@/assets/icons";
import { nameMap, normalizeCountryName } from "@/constants/country";
import React, { useCallback, useEffect, useRef, useState } from "react";
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

type SelectedCountryInput = SelectedCountry | string | null | undefined;

const getFlagEmoji = (countryCode?: string) => {
  if (!countryCode || countryCode.length !== 2) return "🏳️";

  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

const getCountryCodeByName = (name?: string) => {
  const normalizedName = normalizeCountryName(name);
  if (!normalizedName) return "";

  return nameMap[normalizedName] ?? "";
};

const DEFAULT_COUNTRY: SelectedCountry = {
  dialCode: "+1",
  flag: "🇺🇸",
  name: "United States",
};

const UNKNOWN_COUNTRY_FLAG = "🏳️";

const FALLBACK_COUNTRIES: SelectedCountry[] = [
  DEFAULT_COUNTRY,
  { name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { name: "India", dialCode: "+91", flag: "🇮🇳" },
  { name: "Belgium", dialCode: "+32", flag: "🇧🇪" },
  { name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪" },
];

const normalizeDialCode = (dialCode?: string) => {
  const trimmed = String(dialCode ?? "").trim();
  if (!trimmed) return "";
  return trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
};

const getFallbackCountryByDialCode = (dialCode?: string) => {
  const normalizedDialCode = normalizeDialCode(dialCode);
  return FALLBACK_COUNTRIES.find(
    (country) => country.dialCode === normalizedDialCode,
  );
};

const getFallbackCountryByName = (name?: string) => {
  const normalizedName = String(name ?? "")
    .trim()
    .toLowerCase();
  if (!normalizedName) return undefined;

  const fallbackCountry = FALLBACK_COUNTRIES.find(
    (country) => country.name.toLowerCase() === normalizedName,
  );

  if (fallbackCountry) return fallbackCountry;

  const countryCode = getCountryCodeByName(normalizedName);
  if (!countryCode) return undefined;

  return {
    name: name?.trim() || DEFAULT_COUNTRY.name,
    dialCode: "",
    flag: getFlagEmoji(countryCode),
  };
};

const MAX_PHONE_DIGITS = 10;

const sanitizePhoneNumber = (text: any) =>
  String(text ?? "")
    .replace(/\D/g, "")
    .slice(0, MAX_PHONE_DIGITS);

const mapCountryCodes = (data: Country[]) =>
  data
    .filter((c) => c.name && c.dial_code)
    .map((c) => ({
      name: c.name,
      flag: getFlagEmoji(c.code),
      dialCode: normalizeDialCode(c.dial_code),
    }))
    .filter((c) => c.dialCode)
    .sort((a, b) => a.name.localeCompare(b.name));

const normalizeSelectedCountry = (
  country?: SelectedCountryInput,
): SelectedCountry | null => {
  if (typeof country === "string") {
    const dialCode = normalizeDialCode(country);
    if (!dialCode) return null;

    const fallbackCountry = getFallbackCountryByDialCode(dialCode);

    return (
      fallbackCountry ?? {
        dialCode: dialCode || DEFAULT_COUNTRY.dialCode,
        flag:
          dialCode === DEFAULT_COUNTRY.dialCode
            ? DEFAULT_COUNTRY.flag
            : UNKNOWN_COUNTRY_FLAG,
        name: dialCode === DEFAULT_COUNTRY.dialCode ? DEFAULT_COUNTRY.name : "",
      }
    );
  }

  if (country?.dialCode || country?.flag || country?.name) {
    const dialCode = normalizeDialCode(country.dialCode);
    const fallbackByName = getFallbackCountryByName(country.name);
    const fallbackByDialCode = getFallbackCountryByDialCode(dialCode);

    return {
      dialCode:
        dialCode ||
        fallbackByName?.dialCode ||
        fallbackByDialCode?.dialCode ||
        "",
      flag:
        country.flag ||
        fallbackByName?.flag ||
        fallbackByDialCode?.flag ||
        (dialCode === DEFAULT_COUNTRY.dialCode
          ? DEFAULT_COUNTRY.flag
          : UNKNOWN_COUNTRY_FLAG),
      name:
        country.name ||
        fallbackByDialCode?.name ||
        fallbackByName?.name ||
        "",
    };
  }

  return null;
};

const shouldEnrichSelectedCountry = (country: SelectedCountry | null) =>
  Boolean(
    country?.dialCode &&
      (!country.flag ||
        country.flag === UNKNOWN_COUNTRY_FLAG ||
        !country.name.trim()),
  );

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
  label: string;
  placeholderTxt: string;
  value: any;
  onChange: any;
  selectedCode?: SelectedCountryInput;
  onCodeChange?: (country: SelectedCountry) => void;
  disableCode?: boolean;
  error?: string;
}) => {
  const [countries, setCountries] = useState<SelectedCountry[]>([]);
  const [filtered, setFiltered] = useState<SelectedCountry[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const phoneInputRef = useRef<any>(null);
  const [selected, setSelected] = useState<SelectedCountry | null>(
    normalizeSelectedCountry(selectedCode),
  );

  useEffect(() => {
    setSelected(normalizeSelectedCountry(selectedCode));
  }, [selectedCode]);

  const loadCountries = useCallback(async () => {
    if (countries.length > 0) {
      return countries;
    }

    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/codes",
      );
      const json = await res.json();
      const data: Country[] = Array.isArray(json?.data) ? json.data : [];
      const mapped = mapCountryCodes(data);
      const countryList = mapped.length > 0 ? mapped : FALLBACK_COUNTRIES;
      setCountries(countryList);
      setFiltered(countryList);
      return countryList;
    } catch {
      setCountries(FALLBACK_COUNTRIES);
      setFiltered(FALLBACK_COUNTRIES);
      return FALLBACK_COUNTRIES;
    }
  }, [countries]);

  useEffect(() => {
    const selectedCountry = normalizeSelectedCountry(selectedCode);

    if (!shouldEnrichSelectedCountry(selectedCountry)) return;

    let isActive = true;

    loadCountries().then((countryList) => {
      if (!isActive) return;

      const matchedCountry = countryList.find(
        (country) => country.dialCode === selectedCountry?.dialCode,
      );

      if (!matchedCountry) return;

      const enrichedCountry = {
        ...selectedCountry,
        ...matchedCountry,
      };

      setSelected(enrichedCountry);
      onCodeChange?.(enrichedCountry);
    });

    return () => {
      isActive = false;
    };
  }, [loadCountries, onCodeChange, selectedCode]);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      await loadCountries();
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

  const handlePhoneChange = (text: string) => {
    const sanitizedText = sanitizePhoneNumber(text);

    if (text !== sanitizedText) {
      phoneInputRef.current?.setNativeProps({ text: sanitizedText });
    }

    onChange(sanitizedText);
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
              {selected ? (
                <>
                  <Text className="text-lg">{selected.flag}</Text>
                  <Text className="text-csm font-inter-medium text-primary">
                    {selected.dialCode}
                  </Text>
                </>
              ) : null}
              {!disableCode && (
                <View
                  style={{ transform: [{ rotate: "90deg" }] }}
                  className="text-primary/40 mr-2 text-xs"
                >
                  <Icon name="Arrow" size={18} />
                </View>
              )}
            </>
          )}
        </Pressable>

        <TextInput
          ref={phoneInputRef}
          value={sanitizePhoneNumber(value)}
          onChangeText={handlePhoneChange}
          className="flex-1"
          placeholder={placeholderTxt as string}
          keyboardType="number-pad"
          maxLength={MAX_PHONE_DIGITS}
          placeholderTextColor={"#C3C5C9"}
          style={{ paddingVertical: 10, color: "#0F1729" }}
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
            style={{ paddingVertical: 14 }}
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
