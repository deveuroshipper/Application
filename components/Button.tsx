import React from "react";
import { Text, TouchableOpacity } from "react-native";

const Button = ({
  color = "#0F1729",
  action,
  text,
  icon,
}: {
  color?: String;
  action: any;
  text: String;
  icon: any;
}) => {
  return (
    <TouchableOpacity
      onPress={action}
      className="h-16 w-full flex flex-row gap-4 justify-center items-center rounded-2xl"
      style={{
        backgroundColor: color,
      }}
    >
      <Text
        style={{ color: color ? "white" : "black" }}
        className="text-cmd font-inter-bold"
      >
        {text}
      </Text>
      {icon && icon}
    </TouchableOpacity>
  );
};

export default Button;
