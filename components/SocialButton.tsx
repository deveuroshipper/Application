import React from "react";
import { Text, TouchableOpacity } from "react-native";

export const enum Size {
  Small = "Small",
  Large = "Large",
}
const SocialButton = (props: any) => {
  const icon = props?.icon || null;
  const color = props.color || "#F0F0F0";
  const size: Size = props.size || Size.Large;

  return (
    <TouchableOpacity
      onPress={props?.action}
      className=" w-full flex flex-row gap-4 justify-center items-center rounded-xl border-[2px] border-primary/10"
      style={{
        backgroundColor: color,
        height: size == Size.Large ? 54 : 50,
      }}
    >
      {icon && icon}
      <Text
        style={{ color: props?.color ? "white" : "#383838" }}
        className="text-cno font-inter-bold"
      >
        {props?.text}
      </Text>
    </TouchableOpacity>
  );
};

export default SocialButton;
