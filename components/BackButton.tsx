import Icon from "@/assets/icons";
import React from "react";
import { Text, View } from "react-native";

const BackButton = () => {
  return (
    <View className="flex flex-row gap-4 items-center">
      <Icon name="BackArrow" size={16} />
      <Text className="text-cno font-inter-bold">Back</Text>
    </View>
  );
};

export default BackButton;
