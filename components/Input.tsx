import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const Input = ({
  label,
  placeholderTxt,
  value,
  onChange,
  icon,
  iconAction,
}: {
  label: String;
  placeholderTxt: String;
  value: any;
  onChange: any;
  icon?: any;
  iconAction?: any;
}) => {
  return (
    <View>
      <Text className="text-csm uppercase mt-2 mb-3 text-primary font-inter-medium">
        {label}
      </Text>

      <View className="flex gap-2 flex-row items-center px-6 py-2 bg-white border-[2.5px] border-primary/10 rounded-2xl font-inter-medium text-csm placeholder:color-primary/30">
        <TextInput
          value={value}
          onChangeText={onChange}
          className="flex-1"
          placeholder={placeholderTxt}
        />

        {icon && (
          <TouchableOpacity onPress={iconAction}>{icon}</TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Input;
