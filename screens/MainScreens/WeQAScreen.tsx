import Icon from "@/assets/icons";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import ScreenWrapper from "@/components/ScreenWrapper";
import ServiceInfoModal from "@/components/ServiceInfoModal";
import { submitServiceQueryApiHandler } from "@/helper/Api";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const WeQAScreen = ({ navigation }: any) => {
  const [infoVisible, setInfoVisible] = useState(false);
  const [data, SetData] = useState({
    name: "",
    email: "",
    mobile: "",
    code: {
      dialCode: "",
      flag: "",
      name: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const phoneNumber = data.mobile.trim();
  const isFormFilled = Boolean(
    data.name.trim() && data.email.trim() && phoneNumber,
  );

  const validate = (): boolean => {
    const newErrors = { name: "", email: "", mobile: "" };

    if (!data.name.trim()) newErrors.name = "Full name is required.";

    if (!data.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
      newErrors.email = "Please enter a valid email address.";

    if (!phoneNumber) newErrors.mobile = "Phone number is required.";
    else if (!/^\d{10}$/.test(data.mobile.trim())) {
      newErrors.mobile = "Phone number must be exactly 10 digits.";
    }

    if (data?.code?.dialCode == "" || data?.code?.name == "") {
      newErrors.mobile = "Please select a mobile country code";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.mobile;
  };

  const handelSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await submitServiceQueryApiHandler({
        fullName: data.name.trim(),
        email: data.email.trim(),
        phone: phoneNumber,
        type: "weqa",
      });
      Toast.show({
        type: "success",
        text1: "Query submitted successfully",
      });
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "MainScreens",
            params: {
              screen: "BottomTabBar",
              params: { screen: "HomeScreen" },
            },
          },
        ],
      });
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
    // <ScreenWrapper KeyboardAvoiding={true}>
    //   <View className="px-8 pb-8 flex-1">
    //     <BackButton navigation={navigation} />

    //     <View className="mt-10 flex flex-col justify-between content-between flex-1">
    //       <View className="w-full">
    //         <View
    //           className="flex-1 max-h-80 min-h-52 mb-8 overflow-hidden rounded-lg"
    //           style={{
    //             shadowColor: "#e3e6e9",
    //             shadowOffset: { width: 0, height: 4 },
    //             shadowOpacity: 0.02,
    //             shadowRadius: 32,
    //             elevation: 10,
    //           }}
    //         >
    //           <Image
    //             className="flex-1 w-full flex items-start bg-cover"
    //             source={require("../../assets/images/WeQAPage.png")}
    //           />
    //         </View>

    //         <View>
    //           <Text className="text-primary font-space-grotesk-bold text-cxl w-full">
    //             WeQA
    //           </Text>
    //         </View>
    //         <Text className="text-csm mt-2 mb-6 text-[#5C6574] font-inter">
    //           Submit your details let us inspect your shipment for accuracy and
    //           quality before dispatch.
    //         </Text>
    //       </View>

    //       <View className="flex flex-col gap-2">
    //         <Input
    //           label={"FULL NAME"}
    //           placeholderTxt={"Enter Full Name"}
    //           value={data?.name}
    //           onChange={(text: string) => {
    //             SetData({ ...data, name: text });
    //             if (errors.name) setErrors((e) => ({ ...e, name: "" }));
    //           }}
    //           error={errors.name}
    //         />
    //         <Input
    //           label={"Email Address"}
    //           placeholderTxt={"jen@gmail.com"}
    //           value={data?.email}
    //           onChange={(text: string) => {
    //             SetData({ ...data, email: text });
    //             if (errors.email) setErrors((e) => ({ ...e, email: "" }));
    //           }}
    //           error={errors.email}
    //         />
    //         <PhoneNumberInput
    //           label={"Phone Number*"}
    //           placeholderTxt={"987654321"}
    //           value={data?.mobile}
    //           selectedCode={data?.code}
    //           onCodeChange={(e) => SetData({ ...data, code: e })}
    //           onChange={(text: string) => {
    //             SetData({ ...data, mobile: text });
    //             if (errors.mobile) setErrors((e) => ({ ...e, mobile: "" }));
    //           }}
    //           error={errors.mobile}
    //         />
    //       </View>

    //       <View className="mt-auto">
    //         {/* <Text className="text-csm mt-2 mb-6 text-center text-primary/60 font-inter">
    //           By signing up, you confirm that you agree to our Terms of Service
    //           and Privacy Policy.
    //         </Text> */}

    //         <Button
    //           text="Submit"
    //           action={handelSubmit}
    //           loading={loading}
    //           disabled={!isFormFilled || loading}
    //         />
    //       </View>
    //     </View>
    //   </View>
    // </ScreenWrapper>

    <ScreenWrapper KeyboardAvoiding={true}>
      <View className="px-8 pb-8 flex-1">
        <ServiceInfoModal
          visible={infoVisible}
          title="WeQA"
          description="WeQA is a quality inspection and verification service. Before your goods are shipped, our team checks product quality, quantity, specifications, packaging, and overall condition to ensure everything meets your requirements."
          onClose={() => setInfoVisible(false)}
        />

        <View className="flex-row items-center justify-between">
          <BackButton navigation={navigation} />
          <TouchableOpacity
            onPress={() => setInfoVisible(true)}
            className="h-10 px-4 rounded-full bg-[#E4E8EF] flex-row items-center gap-2"
            accessibilityRole="button"
            accessibilityLabel="WeQA information"
          >
            <Icon name="Info" size={18} color="#0F1729" />
            <Text className="text-csm text-primary font-inter-bold pb-0.5">
              Info
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-10 flex flex-col justify-between content-between flex-1">
          <View className="w-full">
            <View
              className="w-full max-h-80 min-h-52 mb-6 overflow-hidden rounded-lg"
              style={{
                shadowColor: "#e3e6e9",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.02,
                shadowRadius: 32,
                elevation: 10,
              }}
            >
              <Image
                className="flex-1 w-full flex items-start bg-cover"
                source={require("../../assets/images/WeQAPage.png")}
              />
            </View>

            <View>
              <Text className="text-primary font-space-grotesk-bold text-cxl w-full">
                WeQA
              </Text>
            </View>
            <Text className="text-csm mt-2 mb-6 text-[#5C6574] font-inter">
              Submit your details let us inspect your shipment for accuracy and
              quality before dispatch.
            </Text>
          </View>

          <View className="flex flex-col gap-0">
            <Input
              label={"FULL NAME"}
              placeholderTxt={"Enter Full Name"}
              value={data?.name}
              onChange={(text: string) => {
                SetData({ ...data, name: text });
                if (errors.name) setErrors((e) => ({ ...e, name: "" }));
              }}
              error={errors.name}
            />
            <Input
              label={"Email Address"}
              placeholderTxt={"jen@gmail.com"}
              value={data?.email}
              onChange={(text: string) => {
                SetData({ ...data, email: text });
                if (errors.email) setErrors((e) => ({ ...e, email: "" }));
              }}
              error={errors.email}
            />
            <PhoneNumberInput
              label={"Phone Number"}
              placeholderTxt={"987654321"}
              value={data?.mobile}
              selectedCode={data?.code}
              onCodeChange={(e) => SetData({ ...data, code: e })}
              onChange={(text: string) => {
                SetData({ ...data, mobile: text });
                if (errors.mobile) setErrors((e) => ({ ...e, mobile: "" }));
              }}
              error={errors.mobile}
            />
          </View>

          <View className="mt-auto">
            {/* <Text className="text-csm mt-2 mb-6 text-center text-primary/60 font-inter">
              By signing up, you confirm that you agree to our Terms of Service
              and Privacy Policy.
            </Text> */}

            <Button
              text="Submit"
              action={handelSubmit}
              loading={loading}
              disabled={!isFormFilled || loading}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default WeQAScreen;
