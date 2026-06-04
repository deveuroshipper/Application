import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const Input = ({
  label,
  placeholderTxt,
  value,
  onChange,
  icon,
  iconAction,
  secureTextEntry,
  secondLabel,
  secondLabelAction,
  editable = true,
  multiline = false,
  numberOfLines = 1,
  error = "",
  keyboardTypes = "default",
}: {
  label?: string;
  secondLabel?: string;
  secondLabelAction?: any;
  placeholderTxt: string;
  value: any;
  onChange: any;
  icon?: any;
  iconAction?: any;
  secureTextEntry?: boolean;
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  error?: String;
  keyboardTypes?: any;
}) => {
  return (
    <View>
      <View className="flex flex-row mt-2 mb-3 justify-between">
        {label && (
          <Text className="text-csm uppercase   text-primary font-inter-medium">
            {label}
          </Text>
        )}
        <TouchableOpacity onPress={secondLabelAction}>
          <Text className="text-csm  w-fit text-center text-primary font-inter">
            {secondLabel}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        className={`flex gap-2 flex-row px-6 bg-white border-[2.5px] border-primary/10 rounded-2xl font-inter-bold text-cno placeholder:color-primary/30 ${multiline ? "items-start py-3" : "items-center py-1.5"}`}
      >
        <TextInput
          className="flex-1"
          value={value}
          onChangeText={(e) => onChange(e)}
          style={{
            color: "#0F1729",
            flex: 1,
            ...(multiline
              ? {
                  minHeight: (numberOfLines ?? 4) * 24,
                  textAlignVertical: "top",
                }
              : {}),
          }}
          placeholder={placeholderTxt}
          placeholderTextColor={"#CBD5E1"}
          secureTextEntry={secureTextEntry}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardTypes}
        />

        {icon && (
          <TouchableOpacity onPress={iconAction}>{icon}</TouchableOpacity>
        )}
      </View>

      <Text className="text-[10px] font-inter-medium ml-1  mt-1 text-red-500">
        {error} 
      </Text>
    </View>
  );
};

export default Input;
