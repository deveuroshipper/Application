import Icon from "@/assets/icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type ServiceInfoModalProps = {
  visible: boolean;
  title: string;
  description: string;
  onClose: () => void;
};

const ServiceInfoModal = ({
  visible,
  title,
  description,
  onClose,
}: ServiceInfoModalProps) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
        className="flex-1 justify-center items-center px-6"
      >
        <View className="bg-white w-full rounded-3xl overflow-hidden">
          <View className="bg-primary px-6 pt-6 pb-5">
            <TouchableOpacity
              onPress={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full justify-center items-center z-10"
              accessibilityRole="button"
              accessibilityLabel="Close service information"
            >
              <View
                style={{
                  transform: [{ rotate: "45deg" }],
                }}
              >
                <Icon name="Plus" color="#FFFF" size={20} />
              </View>
            </TouchableOpacity>

            <View className="w-14 h-14 rounded-full bg-white/10 justify-center items-center mb-4">
              <Icon name="Info" size={28} color="#FFFFFF" />
            </View>

            <Text className="text-cxl font-space-grotesk-bold text-white pr-10">
              {title}
            </Text>
            <Text className="text-csm font-inter text-white/60 mt-1">
              Order Service
            </Text>
          </View>

          <View className="p-6">
            <View className="bg-[#F3F5F8] rounded-2xl p-4 mb-5">
              <Text className="text-csm font-inter text-[#5C6574] leading-6">
                {description}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="w-full flex h-14 rounded-full bg-primary flex-row justify-center items-center"
            >
              <Text className="text-cno text-white font-inter-bold pb-1">
                Got it
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ServiceInfoModal;
