import Icon from "@/assets/icons";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

const BackButton = ({ navigation, color }: any) => {
  const handelBack = () => {
    navigation.pop();
  };
  return (
    <TouchableOpacity
      onPress={handelBack}
      className={`flex flex-row gap-4 items-center ${color ? color : "text-primary"}`}
    >
      <Icon name="BackArrow" size={16} color={color ?? "#0F1729"} />
      <Text
        style={{ color: color ?? "#0F1729" }}
        className={`text-cno font-inter-bold `}
      >
        Back
      </Text>
    </TouchableOpacity>
  );
};

export default BackButton;
