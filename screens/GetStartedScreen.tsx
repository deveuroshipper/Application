import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
const GetStartedScreen = ({ navigation }: any) => {
  return (
    <View className="relative flex-1  w-full">
      <Image
        source={require("../assets/images/letsBegin.png")}
        resizeMode="cover"
        className="absolute z-10 top-0 left-0 h-full w-full"
      />
      <View className="flex gap-8 flex-col justify-end py-10 absolute z-20 top-0 left-0 right-0 bottom-0 ">
        <LinearGradient
          colors={[
            "rgba(15, 23, 41, 0.0)",
            "rgba(15, 23, 41, 0.9)",
            "#0F1729",
            "#0F1729",
          ]}
          locations={[0, 0.5, 0.7, 1]}
          style={[
            StyleSheet.absoluteFillObject,
            {
              zIndex: 20,
              paddingHorizontal: 40,
              paddingVertical: 40,
              justifyContent: "space-between",
              gap: 32,
            },
          ]}
          className="flex gap-8 flex-col justify-between py-10 absolute z-20 top-0 left-0 right-0 bottom-0 px-10"
        ></LinearGradient>

        <View className="absolute z-40 flex flex-col   gap-12  py-10 px-10 w-full">
          <View className="w-full flex flex-col gap-0">
            <Text className="text-lightBlue text-center text-cmd font-inter">
              Smarter Logistics
            </Text>
            <View>
              <Text className="text-white text-center font-space-grotesk-bold text-cxl w-full">
                Control Every Shipment
              </Text>
            </View>
            <Text className="text-csm mt-6 text-center text-white font-inter">
              Monitor shipments and streamline logistics operations with greater
              efficiency.
            </Text>
          </View>

          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.setItem("intro_complete", "true");
              navigation.push("WelcomeScreen");
            }}
            className="bg-gold h-16 w-full flex justify-center items-center rounded-md"
          >
            <Text className="text-cmd text-white uppercase font-space-grotesk-bold tracking-[2px]">
              Let’s Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default GetStartedScreen;
