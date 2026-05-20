import React from "react";
import { Text, TouchableOpacity } from "react-native";

const SocialButton = (props: any) => {
  const icon = props?.icon || null;
  const color = props.color || "#F0F0F0";

  return (
    <TouchableOpacity
      onPress={props?.action}
      className="h-16 w-full flex flex-row gap-4 justify-center items-center rounded-lg"
      style={{
        backgroundColor: color,
      }}
    >
      {icon && icon}
      <Text
        style={{ color: props?.color ? "white" : "black" }}
        className="text-cno font-inter-bold"
      >
        {props?.text}
      </Text>
    </TouchableOpacity>
  );
};

export default SocialButton;
