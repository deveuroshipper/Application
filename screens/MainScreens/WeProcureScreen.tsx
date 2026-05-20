import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import ScreenWrapper from "@/components/ScreenWrapper";
import React, { useState } from "react";
import { Image, Text, View } from "react-native";

const WeProcureScreen = ({ navigation }: any) => {
  const [data, SetData] = useState({
    name: "",
    email: "",
    mobile: "",
    code: {
      dialCode: "+1",
      flag: "🇺🇸",
      name: "United States",
    },
  });

  const handelSubmit = () => {
    console.log(data);
    navigation.push("EmailVerification", { screenFor: "EMAIL_VERIFICATION" });
  };

  return (
    <ScreenWrapper>
      <View className="px-8 pb-8 flex-1">
        <BackButton navigation={navigation} />

        <View className="mt-10 flex flex-col justify-between content-between flex-1">
          <View className="w-full">
            <View
              className="w-full h-40 mb-8 overflow-hidden rounded-lg"
              style={{
                shadowColor: "#e3e6e9",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.02,
                shadowRadius: 32,
                elevation: 10,
              }}
            >
              <Image
                className="w-full h-full flex items-start bg-cover"
                source={require("../../assets/images/WeProcurePage.png")}
              />
            </View>

            <View>
              <Text className="text-primary font-space-grotesk-bold text-cxl w-full">
                WeProcure{" "}
              </Text>
            </View>
            <Text className="text-csm mt-2 mb-6 text-primary/60 font-inter">
              Tell us what you need we’ll help you procure it from trusted
              suppliers.
            </Text>
          </View>

          <View className="flex flex-col gap-2">
            <Input
              label={"FULL NAME"}
              placeholderTxt={"Enter Full Name"}
              value={data?.name}
              onChange={(text: string) => SetData({ ...data, name: text })}
            />
            <Input
              label={"Email Address"}
              placeholderTxt={"jen@gmail.com"}
              value={data?.email}
              onChange={(text: string) => SetData({ ...data, email: text })}
            />
            <PhoneNumberInput
              label={"Phone Number*"}
              placeholderTxt={"987654321"}
              value={data?.mobile}
              selectedCode={data?.code}
              onCodeChange={(e) => SetData({ ...data, code: e })}
              onChange={(text: string) => SetData({ ...data, mobile: text })}
            />
          </View>

          <View className="mt-auto">
            {/* <Text className="text-csm mt-2 mb-6 text-center text-primary/60 font-inter">
              By signing up, you confirm that you agree to our Terms of Service
              and Privacy Policy.
            </Text> */}

            <Button text="Submit" action={handelSubmit} />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default WeProcureScreen;
