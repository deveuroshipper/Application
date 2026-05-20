import Icon from "@/assets/icons";
import Button from "@/components/Button";
import Input from "@/components/Input";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import ScreenWrapper from "@/components/ScreenWrapper";
import SocialButton from "@/components/SocialButton";
import React, { useState } from "react";
import { Image, Text, View } from "react-native";

const LoginScreen = ({ navigation }: any) => {
  const [data, SetData] = useState({
    password: "",
    mobile: "",
    code: {
      dialCode: "+1",
      flag: "🇺🇸",
      name: "United States",
    },
  });
  const [showPass, setShowPass] = useState(false);

  const handelSubmit = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "MainScreens",
          params: { screen: "BottomTabBar", params: { screen: "HomeScreen" } },
        },
      ],
    });
  };
  const handelForgotPass = () => {
    navigation.push("ForgotPasswordScreen");
  };
  return (
    <ScreenWrapper>
      <View className="px-8 pb-8 flex-1">
        <View className="mt-8 flex flex-col justify-start content-between  flex-1">
          <View className="h-fit  flex flex-col gap-6 items-center ">
            <View className="">
              <Image
                source={require("../assets/logos/Logo.png")}
                resizeMode="cover"
                className="h-fit w-32"
              />
            </View>
            <View className="flex gap-1 flex-col items-center w-full">
              <View className="flex  flex-row justify-center gap-4 w-full">
                <Text className="text-cxxl w-fit text-primary font-space-grotesk-bold">
                  EURO
                </Text>
                <Text className="text-gold w-fit text-cxxl font-space-grotesk-bold">
                  SHIPPER
                </Text>
              </View>
              <View className="h-1 w-40 bg-gold rounded-full" />
              <Text className="text-csm mt-4 w-full text-center text-primary font-inter-medium tracking-[3px] uppercase">
                The Precision Navigator
              </Text>
            </View>
          </View>

          <View className="flex mt-6 flex-col gap-2">
            {/* <Text className="text-cxxl w-fit text-primary font-space-grotesk-bold">
              log in
            </Text> */}

            <PhoneNumberInput
              label={"Phone Number*"}
              placeholderTxt={"987654321"}
              value={data?.mobile}
              selectedCode={data?.code}
              onCodeChange={(e) => SetData({ ...data, code: e })}
              onChange={(text: string) => SetData({ ...data, mobile: text })}
            />

            <Input
              label={"Password"}
              secondLabel="Forgot Password?"
              secondLabelAction={handelForgotPass}
              placeholderTxt={"●●●●●●"}
              value={data?.password}
              secureTextEntry={!showPass}
              onChange={(text: string) => SetData({ ...data, password: text })}
              icon={showPass ? <Icon name="CloseEye" /> : <Icon name="Eye" />}
              iconAction={() => setShowPass(!showPass)}
            />
          </View>

          <View className="w-full mt-8  flex flex-col gap-6 items-center">
            <Button text="Log in" action={handelSubmit} />

            <View className="flex flex-row items-center w-full">
              <View className="h-0.5 flex-auto bg-primary/40 " />
              <Text className="z-40 w-fit px-3 pb-2 text-cno mt-2 text-center text-primary/70 font-inter-medium ">
                Or sign up with
              </Text>
              <View className="h-0.5 flex-auto bg-primary/40" />
            </View>

            <SocialButton
              icon={<Icon name="Apple" size={22} />}
              text={"Continue with Apple"}
            />
            <SocialButton
              icon={<Icon name="Google" size={22} />}
              text={"Continue with Google"}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default LoginScreen;
