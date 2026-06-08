import Icon from "@/assets/icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
const IntroScreen = ({ navigation }: any) => {
  const [step, setStep] = useState(1);

  const next = () => {
    if (step == 3) {
      navigation.push("GetStartedScreen");
    } else {
      setStep(step + 1);
    }
  };

  const skip = async () => {
    await AsyncStorage.setItem("intro_complete", "true");
    navigation.reset({ index: 0, routes: [{ name: "WelcomeScreen" }] });
  };

  const imageUrl = () => {
    switch (step) {
      case 1:
        return require("../assets/images/Intro/step1.png");
      case 2:
        return require("../assets/images/Intro/step2.png");
      case 3:
        return require("../assets/images/Intro/step3.png");

      default:
        return require("../assets/images/Intro/step1.png");
    }
  };
  return (
    <View className="relative flex-1  w-full">
      <Image
        source={imageUrl()}
        resizeMode="cover"
        className="absolute z-10 top-0 left-0 h-full w-full"
      />
      <View className="flex gap-8 flex-col justify-end py-10 absolute z-20 top-0 left-0 right-0 bottom-0 ">
        <LinearGradient
          colors={["rgba(15, 23, 41, 0.2),rgba(15, 23, 41, 0.6)", "#0F1729"]}
          locations={[0.4, 0.8, 1]}
          className="flex gap-8 flex-col justify-between py-10 absolute z-20 top-0 left-0 right-0 bottom-0 px-10"
        ></LinearGradient>

        <View className="absolute z-40 flex flex-col  gap-12  py-10 px-10 w-full">
          <View className="w-full flex flex-col gap-2">
            <Text className="text-lightBlue text-cmd font-inter">
              Smarter Logistics
            </Text>
            <View>
              <Text className="text-white font-space-grotesk-bold text-cxl w-full">
                {step == 1 && "Connecting Routes, Enabling Commerce"}
                {step == 2 && "Smarter Handling for Every Shipment"}
                {step == 3 && "Flexible Pickup, Seamless Delivery"}
              </Text>
            </View>
            <Text className="text-csm text-white font-inter">
              {step == 1 &&
                "Manage domestic and global shipments through a streamlined logistics network built for modern operations."}
              {step == 2 &&
                "Optimize packaging, shipment processing, and cargo handling with operational precision."}
              {step == 3 &&
                "Coordinate pickups, manage carriers, and monitor delivery flow through one connected platform."}
            </Text>
          </View>

          <View className="flex flex-row h-fit justify-between items-center">
            <TouchableOpacity onPress={skip}>
              <Text className="text-cno text-white">Skip</Text>
            </TouchableOpacity>
            <View className="flex flex-row gap-2">
              {[1, 2, 3].map((item, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      width: step == item ? 40 : 6,
                    }}
                    className="h-2 transition-transform duration-500 bg-white rounded-full"
                  />
                );
              })}
              {/* <View className="h-2 w-10 bg-white/80 rounded-full" />
              <View className="h-2 w-2 bg-white/80 rounded-full" />
              <View className="h-2 w-2 bg-white/80 rounded-full" /> */}
            </View>

            <Pressable
              onPress={() => next()}
              className="w-11 h-11 flex justify-center items-center border-white  border-[1.5px] rounded-full"
            >
              <Icon name="Arrow" color="#FFFF" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default IntroScreen;
