import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import LocationPickerInput from "@/components/LocationPickerInput";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import ScreenWrapper from "@/components/ScreenWrapper";
import {
  createNewAddressApiHandler,
  getAddressByIdApiHandler,
  updateAddressApiHandler,
} from "@/helper/Api";
import { CommonActions } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";

const TOTAL_STEP = 4;

const COUNTRY_CODE_OVERRIDES: Record<string, string> = {
  "united states": "US",
  "united kingdom": "GB",
  "south korea": "KR",
  "north korea": "KP",
  "united arab emirates": "AE",
  russia: "RU",
  "czech republic": "CZ",
  "south africa": "ZA",
};

type MobileCountry = {
  dialCode: string;
  flag: string;
  name: string;
};

const DEFAULT_MOBILE_COUNTRY: MobileCountry = {
  dialCode: "",
  flag: "",
  name: "",
};

const FALLBACK_MOBILE_COUNTRIES: Record<string, MobileCountry> = {
  "united states": {
    dialCode: "+1",
    flag: "🇺🇸",
    name: "United States",
  },
  "united kingdom": {
    dialCode: "+44",
    flag: "🇬🇧",
    name: "United Kingdom",
  },
  india: {
    dialCode: "+91",
    flag: "🇮🇳",
    name: "India",
  },
  belgium: {
    dialCode: "+32",
    flag: "🇧🇪",
    name: "Belgium",
  },
  "united arab emirates": {
    dialCode: "+971",
    flag: "🇦🇪",
    name: "United Arab Emirates",
  },
};

const getFlagEmoji = (countryCode?: string) => {
  if (!countryCode || countryCode.length !== 2)
    return DEFAULT_MOBILE_COUNTRY.flag;

  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

const getMobileCountry = async (
  countryName: string,
): Promise<MobileCountry> => {
  const normalizedCountry = countryName.trim().toLowerCase();
  if (!normalizedCountry) return DEFAULT_MOBILE_COUNTRY;

  const fallback = FALLBACK_MOBILE_COUNTRIES[normalizedCountry];

  try {
    const response = await fetch(
      "https://countriesnow.space/api/v0.1/countries/codes",
    );
    const json = await response.json();
    const country = (json.data as any[])?.find(
      (item) => item.name?.trim().toLowerCase() === normalizedCountry,
    );

    if (country?.dial_code) {
      return {
        dialCode: country.dial_code,
        flag: getFlagEmoji(country.code),
        name: country.name,
      };
    }
  } catch {
    // Use the local fallback below when the country service is unavailable.
  }

  return (
    fallback ?? {
      ...DEFAULT_MOBILE_COUNTRY,
      name: countryName || DEFAULT_MOBILE_COUNTRY.name,
    }
  );
};

const AddNewAddress = ({ navigation, route }: any) => {
  const address_id = route?.params?.address_id ?? null;
  const countryName = route?.params?.countryName?.trim() ?? "";
  const isCountryLocked = !address_id && Boolean(countryName);
  const [step, setStep] = useState(2);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    mobile: "",
    mobileCode: DEFAULT_MOBILE_COUNTRY,
    code: "",
    addressLine1: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    mobile: "",
    addressLine1: "",
    pincode: "",
    country: "",
    state: "",
    city: "",
  });

  const pincodeDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (address_id || !countryName) return;

    let isActive = true;
    setData((prev) => ({
      ...prev,
      country: countryName,
      state: "",
      city: "",
    }));

    getMobileCountry(countryName).then((mobileCode) => {
      if (!isActive) return;
      setData((prev) => ({ ...prev, mobileCode }));
    });

    return () => {
      isActive = false;
    };
  }, [address_id, countryName]);

  const getCountryIso2 = async (
    countryName: string,
  ): Promise<string | null> => {
    const override = COUNTRY_CODE_OVERRIDES[countryName.toLowerCase()];
    if (override) return override;
    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/codes",
      );
      const json = await res.json();
      const found = (json.data as any[])?.find(
        (c) => c.name?.toLowerCase() === countryName.toLowerCase(),
      );
      return found?.code ?? null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!data.country || !data.pincode.trim()) return;

    if (pincodeDebounceRef.current) clearTimeout(pincodeDebounceRef.current);
    pincodeDebounceRef.current = setTimeout(async () => {
      const pincode = data.pincode.trim();

      try {
        if (data.country.toLowerCase() === "india") {
          const res = await fetch(
            `https://api.postalpincode.in/pincode/${encodeURIComponent(pincode)}`,
          );
          if (!res.ok) return;
          const json = await res.json();
          const postOffice = json?.[0]?.PostOffice?.[0];
          if (!postOffice) return;

          setData((prev) => ({
            ...prev,
            state: postOffice.State ?? prev.state,
            city: postOffice.District ?? prev.city,
          }));
          setErrors((e) => ({ ...e, state: "", city: "" }));
          return;
        }

        const iso2 = await getCountryIso2(data.country);
        if (!iso2) return;

        const res = await fetch(
          `https://api.zippopotam.us/${iso2}/${encodeURIComponent(pincode)}`,
        );
        if (!res.ok) return;
        const json = await res.json();
        const place = json?.places?.[0];
        if (!place) return;

        setData((prev) => ({
          ...prev,
          state: place["state"] ?? prev.state,
          city: place["place name"] ?? prev.city,
        }));
        setErrors((e) => ({ ...e, state: "", city: "" }));
      } catch {
        // ignore lookup errors, allow manual selection
      }
    }, 600);

    return () => {
      if (pincodeDebounceRef.current) clearTimeout(pincodeDebounceRef.current);
    };
  }, [data.pincode, data.country]);

  useEffect(() => {
    if (!address_id) return;
    getAddressByIdApiHandler(address_id)
      .then(async (addr) => {
        const addressCountry = addr.country ?? "";
        const fallbackMobileCode = addressCountry
          ? await getMobileCountry(addressCountry)
          : DEFAULT_MOBILE_COUNTRY;

        setData((prev) => ({
          ...prev,
          name: addr.fullName ?? "",
          mobile: addr.number ?? "",
          mobileCode:
            addr.dialCode || addr.coname
              ? {
                  dialCode:
                    addr.dialCode ||
                    fallbackMobileCode.dialCode ||
                    DEFAULT_MOBILE_COUNTRY.dialCode,
                  flag: fallbackMobileCode.flag || DEFAULT_MOBILE_COUNTRY.flag,
                  name:
                    addr.coname ??
                    fallbackMobileCode.name ??
                    addressCountry ??
                    DEFAULT_MOBILE_COUNTRY.name,
                }
              : fallbackMobileCode,
          addressLine1: addr.addressLine ?? "",
          pincode: addr.pincode ?? "",
          country: addressCountry,
          state: addr.state ?? "",
          city: addr.city ?? "",
        }));
      })
      .catch((error: any) => {
        Toast.show({
          type: "error",
          text1: typeof error === "string" ? error : "Failed to load address.",
        });
      });
  }, [address_id]);

  const validate = (): boolean => {
    const newErrors = {
      name: "",
      mobile: "",
      addressLine1: "",
      pincode: "",
      country: "",
      state: "",
      city: "",
    };

    if (!data.name.trim()) newErrors.name = "Full name is required.";

    if (!data.mobile.trim()) newErrors.mobile = "Mobile number is required.";
    else if (!/^\d{7,15}$/.test(data.mobile.trim()))
      newErrors.mobile = "Enter a valid mobile number.";

    if (!data.addressLine1.trim())
      newErrors.addressLine1 = "Address is required.";

    if (!data.pincode.trim()) newErrors.pincode = "Pin code is required.";
    else if (!/^[A-Za-z0-9\s-]{4,10}$/.test(data.pincode.trim()))
      newErrors.pincode = "Enter a valid pin code.";

    if (!data.country) newErrors.country = "Country is required.";
    if (!data.state) newErrors.state = "State is required.";
    if (!data.city) newErrors.city = "City is required.";

    setErrors(newErrors);
    return Object.values(newErrors).every((e) => !e);
  };

  const handelSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    const payload = {
      fullName: data.name,
      number: data.mobile,
      addressLine: data.addressLine1,
      pincode: data.pincode,
      state: data.state,
      city: data.city,
      country: data.country,
      dialCode: data?.mobileCode?.dialCode,
      coname: data?.mobileCode?.name,
    };

    try {
      if (address_id) {
        await updateAddressApiHandler(address_id, payload);
        // Toast.show({ type: "success", text1: "Address updated successfully." });
      } else {
        await createNewAddressApiHandler(payload);
        Toast.show({ type: "success", text1: "Address saved successfully." });
      }
      const routes = navigation.getState()?.routes ?? [];
      const previousRoute = routes[routes.length - 2];
      if (previousRoute?.key) {
        navigation.dispatch({
          ...CommonActions.setParams({ refreshAddress: Date.now() }),
          source: previousRoute.key,
        });
      }
      navigation.goBack();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1:
          typeof error === "string"
            ? error
            : (error?.message ?? "Something went wrong"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper KeyboardAvoiding={true}>
      <View className="flex-1 px-8 pb-8">
        <View className="flex flex-row items-center justify-between">
          <BackButton navigation={navigation} />
          {/* <View className="px-4 py-1  bg-[#BFCDDE] rounded-full">
            <Text className="text-cno  text-primary font-inter-medium">
              {step}/{TOTAL_STEP}
            </Text>
          </View> */}
        </View>

        <View className="mt-10 flex flex-col justify-between content-between flex-1">
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex flex-col">
              <Input
                label={"Full Name"}
                placeholderTxt={"Enter your name"}
                value={data?.name}
                onChange={(text: string) => {
                  setData({ ...data, name: text });
                  if (errors.name) setErrors((e) => ({ ...e, name: "" }));
                }}
                error={errors.name}
              />
              <PhoneNumberInput
                label={"Mobile Number"}
                placeholderTxt={"Enter your mobile number"}
                value={data?.mobile}
                selectedCode={data?.mobileCode}
                disableCode={isCountryLocked}
                onCodeChange={(e) => setData({ ...data, mobileCode: e })}
                onChange={(text: string) => {
                  setData({ ...data, mobile: text });
                  if (errors.mobile) setErrors((e) => ({ ...e, mobile: "" }));
                }}
                error={errors.mobile}
              />

              <LocationPickerInput
                mode="country"
                label="Country"
                placeholder="Select Country"
                value={data.country}
                disabled={isCountryLocked}
                onSelect={(val) => {
                  setData({
                    ...data,
                    country: val,
                    state: "",
                    city: "",
                    mobileCode: DEFAULT_MOBILE_COUNTRY,
                  });
                  getMobileCountry(val).then((mobileCode) => {
                    setData((prev) =>
                      prev.country === val ? { ...prev, mobileCode } : prev,
                    );
                  });
                  if (errors.country) setErrors((e) => ({ ...e, country: "" }));
                }}
                error={errors.country}
              />

              <Input
                label={"Address"}
                placeholderTxt={"Enter your address"}
                value={data?.addressLine1}
                onChange={(text: string) => {
                  setData({ ...data, addressLine1: text });
                  if (errors.addressLine1)
                    setErrors((e) => ({ ...e, addressLine1: "" }));
                }}
                multiline={true}
                numberOfLines={4}
                error={errors.addressLine1}
              />
              <Input
                label={"Pin code"}
                placeholderTxt={"Enter Pin code"}
                value={data?.pincode}
                onChange={(text: string) => {
                  setData({ ...data, pincode: text });
                  if (errors.pincode) setErrors((e) => ({ ...e, pincode: "" }));
                }}
                error={errors.pincode}
              />
              <View className="flex flex-row gap-4">
                <View className="flex-1">
                  <LocationPickerInput
                    mode="state"
                    label="State"
                    placeholder="Select State"
                    value={data.state}
                    country={data.country}
                    disabled={!data.country}
                    onSelect={(val) => {
                      setData({ ...data, state: val, city: "" });
                      if (errors.state) setErrors((e) => ({ ...e, state: "" }));
                    }}
                    error={errors.state}
                  />
                </View>
                <View className="flex-1">
                  <LocationPickerInput
                    mode="city"
                    label="City"
                    placeholder="Select City"
                    value={data.city}
                    country={data.country}
                    state={data.state}
                    disabled={!data.state}
                    onSelect={(val) => {
                      setData({ ...data, city: val });
                      if (errors.city) setErrors((e) => ({ ...e, city: "" }));
                    }}
                    error={errors.city}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
          <View className="mt-10">
            <Button text="Continue" loading={loading} action={handelSubmit} />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default AddNewAddress;
