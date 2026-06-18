import Icon from "@/assets/icons";
import SocialButton, { Size } from "@/components/SocialButton";
import {
  signInWithApple,
  signInWithGoogle,
  storeGoogleLoginApiHandler,
} from "@/helper/Api";
import { useAuthStore } from "@/store/useAuthStore";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";

const WelcomeScreen = ({ navigation }: any) => {
  const handelGoogleLogin = async () => {
    try {
      const AuthResponse = await signInWithGoogle();
      const data = AuthResponse?.data;

      const payload = {
        email: data?.user?.email,
        name: data?.user?.name,
        profile: data?.user?.photo,
        authMethod: "google",
        authId: data?.user?.id,
      };

      console.log("payload for login: ", payload);
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
      Toast.show({
        type: "error",
        text1: error ?? "Failed to remove item",
      });
    }
  };
  return (
    <View className="relative flex-1  w-full bg-[#131B2D]">
      <Image
        source={require("../assets/images/Welcome.png")}
        resizeMode="cover"
        className="absolute z-10 top-0 left-0 h-full w-full"
      />
      <View className="flex gap-8 flex-col justify-between py-10 absolute z-20 top-0 left-0 right-0 bottom-0 px-10 ">
        <View className="h-fit  flex flex-col gap-6 items-center ">
          <View className="flex gap-1 flex-col items-center w-full">
            <View className="flex mt-[60%] flex-col gap-4 w-full">
              <Text className="text-cxxl text-center w-fit text-white font-inter-bold leading-[45px]">
                Welcome
              </Text>
              <Text className="text-gold text-center uppercase w-fit text-cxxl  leading-[45px] font-space-grotesk-bold">
                Euro Shipper
              </Text>
            </View>
            <View className="flex justify-center mt-8 items-center">
              <Text className="text-csm px-1  w-full text-center  text-white/60 font-inter-medium ">
                Effortless Shipping Solutions,
              </Text>
              <Text className="text-csm px-1  w-full text-center text-white/60 font-inter-medium ">
                Powered by Precision and Trust.
              </Text>
            </View>
          </View>
        </View>

        <View className="w-full  flex flex-col gap-6 items-center">
          {/* <SocialButton
            size={Size.Small}
            action={signInWithApple}
            icon={<Icon name="Apple" size={20} />}
            text={"Continue with Apple"}
          /> */}
          <SocialButton
            size={Size.Small}
            action={handelGoogleLogin}
            icon={<Icon name="Google" size={20} />}
            text={"Continue with Google"}
          />

          <View className="flex flex-row items-center w-full">
            <View className="h-[0.8px] flex-auto bg-white/70 " />
            <Text className="z-40 w-fit px-3 pb-2 text-cno mt-2 text-center text-white/70 font-inter-medium ">
              Or sign up with
            </Text>
            <View className="h-[0.8px] flex-auto bg-white/70" />
          </View>

          <SocialButton
            icon={<Icon name="Mail" size={24} color="#FFFF" />}
            action={() => navigation.push("CreateAccount")}
            text={"Sign up with Email"}
            color="#E8A820"
          />

          <View className="flex flex-row gap-2 text-white">
            <Text className="text-csm text-white/80 font-inter">
              Already have an account?
            </Text>
            <Pressable onPress={() => navigation.push("LoginScreen")}>
              <Text className="text-csm text-gold/80 font-inter-bold">
                Log in
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WelcomeScreen;
