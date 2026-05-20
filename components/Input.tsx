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
  secureTextEntry,
  secondLabel,
  secondLabelAction,
}: {
  label: String;
  secondLabel?: String;
  secondLabelAction?: any;
  placeholderTxt: String;
  value: any;
  onChange: any;
  icon?: any;
  iconAction?: any;
  secureTextEntry?: boolean;
}) => {
  return (
    <View>
      <View className="flex flex-row mt-2 mb-3 justify-between">
        <Text className="text-csm uppercase   text-primary font-inter-medium">
          {label}
        </Text>

        <TouchableOpacity onPress={secondLabelAction}>
          <Text className="text-csm  w-fit text-center text-primary font-inter">
            {secondLabel}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex gap-2 flex-row items-center px-6 py-2 bg-white border-[2.5px] border-primary/10 rounded-2xl font-inter-medium text-csm placeholder:color-primary/30">
        <TextInput
          value={value}
          onChangeText={(e) => onChange(e)}
          className="flex-1"
          placeholder={placeholderTxt}
          secureTextEntry={secureTextEntry}
        />

        {icon && (
          <TouchableOpacity onPress={iconAction}>{icon}</TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Input;
