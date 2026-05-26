import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "../assets/icons";

export type DropdownOption = {
  label: string;
  value: string;
  icon?: string; // icon name from the icons index (e.g. "Box", "Door")
  iconNode?: React.ReactNode; // or pass a custom icon node directly
};

const Dropdown = ({
  label,
  placeholder = "Select",
  options,
  value,
  onChange,
}: {
  label?: string;
  placeholder?: string;
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  const selected = options.find((o) => o.value === value);

  return (
    <View>
      {/* Label */}
      {label && (
        <View className="flex flex-row mt-2 mb-3">
          <Text className="text-csm uppercase text-primary font-inter-medium">
            {label}
          </Text>
        </View>
      )}

      {/* Trigger */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setOpen((prev) => !prev)}
        className={`flex flex-row items-center gap-2 px-6 py-4 bg-white border-[2.5px] border-primary/10 rounded-2xl ${open ? "rounded-b-none border-b-0" : "border-b-[2.5px] rounded-b-2xl"}`}
      >
        {/* Selected icon */}
        {selected?.icon && (
          <Icon name={selected.icon} size={24} color="#BFCDDE" />
        )}
        {selected?.iconNode && !selected.icon && selected.iconNode}

        {/* Selected label / placeholder */}
        <Text className={`flex-1 text-cno font-inter-medium text-primary `}>
          {selected ? selected.label : placeholder}
        </Text>

        {/* Chevron */}
        <View
          style={{
            transform: [{ rotate: open ? "-90deg" : "90deg" }],
          }}
        >
          <Icon name="Arrow" size={18} color="#0F1729" />
        </View>
      </TouchableOpacity>

      {/* Options list */}
      {open && (
        <View className="bg-white px-6 border-[2.5px] border-primary/10 rounded-2xl rounded-t-none border-t-0 overflow-hidden">
          {options.map((option, index) => (
            <TouchableOpacity
              key={option.value}
              activeOpacity={0.7}
              onPress={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`flex flex-row items-center gap-3  py-4 
                border-t border-t-primary/10
              `}
            >
              {/* Option icon */}
              {option.icon && (
                <Icon name={option.icon} size={24} color="#BFCDDE" />
              )}
              {option.iconNode && !option.icon && option.iconNode}

              <Text className="text-cno font-inter-medium text-primary">
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default Dropdown;
