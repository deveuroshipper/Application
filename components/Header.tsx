import Icon from "@/assets/icons";
import React from "react";
import { Image, Text, View } from "react-native";

const Header = () => {
  return (
    <View className="bg-white flex flex-row justify-between items-center px-8 py-6">
      <View className="flex flex-row gap-4">
        <View className="h-12 w-12 overflow-hidden bg-gold/20 rounded-md">
          <Image
            className="h-full w-full bg-cover"
            source={require("../assets/images/user.jpg")}
          ></Image>
        </View>
        <View>
          <Text className="text-cxs font-inter text-primary/50">
            Welcome to Euro Shipper
          </Text>
          <Text className="text-csl font-inter-bold text-primary">
            Hi, Julian
          </Text>
        </View>
      </View>

      <View className="flex flex-row gap-6">
        <View className="relative h-9 w-9 flex justify-center items-center">
          <View className="absolute -top-1 z-10 -right-1 h-5 w-5 border-2 border-white aspect-square flex justify-center items-center rounded-full bg-gold">
            <Text className="text-cxs text-white font-inter-bold z-20">1</Text>
          </View>
          <Icon name="Cart" size={26} />
        </View>
        <View className="relative h-9 w-9 flex justify-center items-center">
          <View className="absolute top-0.5 z-10 right-1 h-4 w-4 border-2 border-white aspect-square flex justify-center items-center rounded-full bg-red-500" />
          <Icon name="Bell" size={25} />
        </View>
      </View>
    </View>
  );
};

export default Header;
