import React from "react";
import {
  ActivityIndicator,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";

export const enum Variant {
  DEFAULT,
  OUTLINE,
}

export const enum Size {
  SMALL,
  NORMAL,
}

const Button = ({
  color = "#0F1729",
  action,
  text,
  icon,
  variant = Variant.DEFAULT,
  size = Size.NORMAL,
  frontIcon,
  loading = false,
  disabled = false,
}: {
  color?: string;
  action: any;
  text: string;
  icon?: any;
  variant?: Variant;
  size?: Size;
  frontIcon?: any;
  loading?: Boolean;
  disabled?: Boolean;
}) => {
  if (!loading) {
    return (
      <TouchableOpacity
        onPress={disabled ? null : action}
        className="w-full flex flex-row gap-4 justify-center items-center"
        style={{
          opacity: disabled ? 0.6 : 1,
          height: size == Size.NORMAL ? 60 : 48,
          borderRadius: size == Size.NORMAL ? 16 : 10,
          backgroundColor: variant == Variant.DEFAULT ? color : "transparent",
          // borderColor: variant == Variant.DEFAULT && color,
          borderWidth: variant == Variant.DEFAULT ? 0 : 1.5,
          // shadowColor: variant == Variant.DEFAULT ? "#0F1729" : "white",
          // shadowOffset: { width: 0, height: 4 },
          // shadowOpacity: 1,
          // shadowRadius: 8,
          // elevation: 16,

          ...Platform.select({
            ios: {
              shadowColor: variant == Variant.DEFAULT ? "#0F1729" : "white",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.5,
              shadowRadius: 8,
            },
            android: {
              elevation: 10,
              shadowColor: variant == Variant.DEFAULT ? "#0F1729" : "white",
            },
          }),
        }}
      >
        {frontIcon && frontIcon}
        <Text
          style={{
            color: variant == Variant.DEFAULT ? "white" : color,
            fontSize: size == Size.NORMAL ? 18 : 14,
          }}
          className="text-cmd font-inter-bold"
        >
          {text}
        </Text>
        {icon && icon}
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        className="w-full opacity-80 flex flex-row gap-4 justify-center items-center"
        style={{
          height: size == Size.NORMAL ? 60 : 48,
          borderRadius: size == Size.NORMAL ? 16 : 10,
          backgroundColor: variant == Variant.DEFAULT ? color : "transparent",
          borderColor: variant == Variant.DEFAULT && color,
          borderWidth: variant == Variant.DEFAULT ? 0 : 1.5,
          shadowColor: variant == Variant.DEFAULT ? "#000" : "white",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <ActivityIndicator
          color={variant == Variant.DEFAULT ? "#FFFF" : "#0F1729"}
          size={"large"}
        />
      </TouchableOpacity>
    );
  }
};

export default Button;
