import React from "react";
import { Text, TouchableOpacity } from "react-native";

const Button = ({
  color = "#0F1729",
  action,
  text,
  icon,
}: {
  color?: string;
  action: any;
  text: string;
  icon?: any;
}) => {
  return (
    <TouchableOpacity
      onPress={action}
      className="h-16 w-full flex flex-row gap-4 justify-center items-center rounded-2xl"
      style={{
        backgroundColor: color,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
      }}
    >
      <Text
        style={{ color: color ? "white" : "black" }}
        className="text-cmd font-inter-bold pb-1"
      >
        {text}
      </Text>
      {icon && icon}
    </TouchableOpacity>
  );
};

export default Button;
