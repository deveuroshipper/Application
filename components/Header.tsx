import Icon from "@/assets/icons";
import { useAuthStore } from "@/store/useAuthStore";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const Header = ({ CartClick, NotificationClick }: any) => {
  const user = useAuthStore((state) => state.user);

  const displayName = user?.fullName?.split(" ")[0] ?? "Guest";
  const profileImageUri = user?.profileImage ? String(user.profileImage) : null;

  return (
    <View className="bg-white flex flex-row justify-between items-center px-8 py-6">
      <View className="flex flex-row gap-4">
        <View className="h-12 w-12 overflow-hidden bg-gold/20 rounded-md">
          <Image
            className="h-full w-full bg-cover"
            source={
              profileImageUri
                ? { uri: profileImageUri }
                : require("../assets/images/user.jpg")
            }
          />
        </View>
        <View>
          <Text className="text-cxs font-inter text-primary/50">
            Welcome to Euro Shipper
          </Text>
          <Text className="text-csl font-inter-bold text-primary capitalize">
            Hi, {displayName}
          </Text>
        </View>
      </View>

      <View className="flex flex-row gap-6">
        <Pressable
          onPress={CartClick}
          className="relative h-9 w-9 flex justify-center items-center"
        >
          <View className="absolute -top-1 z-10 -right-1 h-5 w-5 border-2 border-white aspect-square flex justify-center items-center rounded-full bg-gold">
            <Text className="text-cxs text-white font-inter-bold z-20">1</Text>
          </View>
          <Icon name="Cart" size={26} />
        </Pressable>
        <Pressable
          onPress={NotificationClick}
          className="relative h-9 w-9 flex justify-center items-center"
        >
          <View className="absolute top-0.5 z-10 right-1 h-4 w-4 border-2 border-white aspect-square flex justify-center items-center rounded-full bg-red-500" />
          <Icon name="Bell" size={25} />
        </Pressable>
      </View>
    </View>
  );
};

export default Header;
