import Icon from "@/assets/icons";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import SocialButton, { Size } from "@/components/SocialButton";
import {
  loginApiHandler,
  signInWithGoogle,
  storeGoogleLoginApiHandler,
} from "@/helper/Api";
import { useAuthStore } from "@/store/useAuthStore";
import React, { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";

const LoginScreen = ({ navigation }: any) => {
  const [data, SetData] = useState({
    password: "",
    email: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validate = (): boolean => {
    const newErrors = { email: "", password: "" };

    if (!data.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      newErrors.email = "Please enter a valid email address.";

    if (!data.password) newErrors.password = "Password is required.";
    else if (data.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handelSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await loginApiHandler(data.email, data.password);
      await useAuthStore.getState().login(response.token, response.user);
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

  const handelForgotPass = () => {
    navigation.push("ForgotPasswordScreen");
  };

  const handelGoogleLogin = async () => {
    let backendRequestStarted = false;

    try {
      const AuthResponse = await signInWithGoogle();

      if (!AuthResponse) return;

      const data = AuthResponse?.data;

      const payload = {
        email: data?.user?.email,
        name: data?.user?.name,
        profile: data?.user?.photo,
        authMethod: "google",
        authId: data?.user?.id,
      };

      backendRequestStarted = true;
      const response = await storeGoogleLoginApiHandler(payload);

      await useAuthStore.getState().login(response.token, response.user);
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
      if (!backendRequestStarted) return;

      Toast.show({
        type: "error",
        text1:
          typeof error === "string"
            ? error
            : (error?.message ?? "Google login failed"),
      });
    }
  };
  return (
    <ScreenWrapper KeyboardAvoiding={true}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View className="px-8 pb-8 flex-1">
          <View className="mt-8 flex flex-col justify-start content-between  flex-1">
            <View className="h-fit  flex flex-col gap-3 items-center ">
              <View className="">
                <Image
                  source={require("../assets/logos/Logo.png")}
                  resizeMode="cover"
                  className="h-fit w-fit"
                />
              </View>
              <View className="flex gap-1 flex-col items-center w-full">
                <View className="flex  flex-row justify-center gap-4 w-full">
                  <Text className="text-[36px] w-fit text-primary font-space-grotesk-bold">
                    EURO
                  </Text>
                  <Text className="text-gold w-fit text-[36px] font-space-grotesk-bold">
                    SHIPPER
                  </Text>
                </View>
                <View className="h-1 w-40 bg-gold rounded-full" />
                <Text className="text-[10px] mt-4 w-full text-center text-primary/90 font-inter-bold tracking-[3px] uppercase">
                  The Precision Navigator
                </Text>
              </View>
            </View>

            <View className="flex mt-6 flex-col">
              {/* <Text className="text-cxxl w-fit text-primary font-space-grotesk-bold">
              log in
            </Text> */}

              {/* <PhoneNumberInput
              label={"Email Address"}
              placeholderTxt={"jen@gmail.com"}
              value={data?.email}
              selectedCode={data?.code}
              onCodeChange={(e) => SetData({ ...data, code: e })}
              onChange={(text: string) => SetData({ ...data, email: text })}
            /> */}
              <Input
                label={"Email Address"}
                placeholderTxt={"Jen@gmail.com"}
                value={data?.email}
                onChange={(text: string) => {
                  SetData({ ...data, email: text });
                  if (errors.email) setErrors((e) => ({ ...e, email: "" }));
                }}
                error={errors.email}
              />

              <Input
                label={"Password"}
                secondLabel="Forgot Password?"
                secondLabelAction={handelForgotPass}
                placeholderTxt={"●●●●●●"}
                value={data?.password}
                secureTextEntry={!showPass}
                onChange={(text: string) => {
                  SetData({ ...data, password: text });
                  if (errors.password)
                    setErrors((e) => ({ ...e, password: "" }));
                }}
                icon={showPass ? <Icon name="CloseEye" /> : <Icon name="Eye" />}
                iconAction={() => setShowPass(!showPass)}
                error={errors.password}
              />
            </View>

            <View className="w-full mt-4 flex flex-col gap-6 items-center">
              <Button text="Log in" loading={loading} action={handelSubmit} />

              <View className="flex flex-row items-center w-full">
                <View className="h-[0.9px] flex-auto bg-primary/30 " />
                <Text className="z-40 w-fit px-3 pb-2 text-cno mt-2 text-center text-primary/70 font-inter-medium ">
                  Or Log In with
                </Text>
                <View className="h-[0.9px] flex-auto bg-primary/30" />
              </View>

              {/* <SocialButton
                size={Size.Small}
                icon={<Icon name="Apple" size={20} />}
                text={"Continue with Apple"}
              /> */}
              <SocialButton
                size={Size.Small}
                action={handelGoogleLogin}
                icon={<Icon name="Google" size={20} />}
                text={"Continue with Google"}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default LoginScreen;
