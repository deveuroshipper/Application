import React, { useRef } from "react";
import { Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const OTPInput = ({
  label,
  length = 4,
  value,
  onChange,
}: {
  label?: string;
  length?: number;
  value: string;
  onChange: (val: string) => void;
}) => {
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const char = text.slice(-1);
    const chars = value.split("");
    chars[index] = char;
    const next = chars.join("").slice(0, length);
    onChange(next);

    if (char && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View>
      {label && (
        <Text className="text-csm uppercase mt-2 mb-3 text-primary font-inter-medium">
          {label}
        </Text>
      )}

      <View className="flex flex-row gap-3 justify-evenly">
        {Array.from({ length }).map((_, i) => (
          <View
            key={i}
            className="size-20 aspect-square items-center justify-center bg-white border-[2.5px] border-primary/10 rounded-2xl"
          >
            <TextInput
              ref={(el) => (inputs.current[i] = el)}
              value={value[i] ?? ""}
              onChangeText={(text) => handleChange(text, i)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, i)
              }
              placeholder="_"
              keyboardType="number-pad"
              maxLength={2}
              className="w-full h-full text-center text-clg font-inter-bold text-primary "
              caretHidden
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default OTPInput;
