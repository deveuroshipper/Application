import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const LetsBeginScreen = ({ navigation }: any) => {
  return (
    <View className="relative flex-1  w-full">
      <Image
        source={require("../assets/images/SplashBg.png")}
        resizeMode="cover"
        className="absolute z-10 top-0 left-0 h-full w-full"
      />
      <View className="flex gap-8 flex-col justify-between py-10 absolute z-20 top-0 left-0 right-0 bottom-0 px-10 bg-[#131B2D]/80">
        <View className="h-fit  flex flex-col gap-6 items-center ">
          <View className="mt-28">
            <Image
              source={require("../assets/logos/Logo.png")}
              resizeMode="cover"
              className="h-fit w-32"
            />
          </View>
          <View className="flex gap-1 flex-col items-center w-full">
            <View className="flex  flex-row justify-center items-center gap-4 w-full">
              <Text className="text-cxxl w-fit text-white font-space-grotesk-bold">
                EURO
              </Text>
              <Text className="text-gold w-fit text-cxxl font-space-grotesk-bold">
                SHIPPER
              </Text>
            </View>
            <View className="h-1 w-40 bg-gold rounded-full" />
            <Text className="text-csm mt-4 w-full text-center text-white/60 font-inter-medium tracking-[3px] uppercase">
              The Precision Navigator
            </Text>
          </View>
        </View>

        <View className="w-full  flex flex-col gap-16 items-center">
          <TouchableOpacity
            onPress={() => navigation.push("IntroScreen")}
            className="bg-gold h-16 w-full flex justify-center items-center rounded-md"
          >
            <Text className="text-cmd uppercase font-space-grotesk-bold tracking-[2px]">
              Let's Begin
            </Text>
          </TouchableOpacity>

          <View className="flex flex-row items-center w-full">
            <View className="h-0.5 flex-auto bg-gold/50 " />

            <Text className="z-40 flex-auto pb-2 text-cxs mt-2 w-fit text-center text-white/50 font-inter-medium tracking-[2.5px] uppercase">
              European Logistics Authority
            </Text>
            <View className="h-0.5 flex-auto bg-gold/40" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default LetsBeginScreen;
