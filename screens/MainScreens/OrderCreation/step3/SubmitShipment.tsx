import submitSuccessfully from "@/assets/images/submitSuccessfully.png";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import React from "react";
import { Image, Text, View } from "react-native";

const SubmitShipment = ({ navigation }: any) => {
  const handleBackToDashboard = () => {
    navigation.push("SubmitShipment");
  };

  return (
    <ScreenWrapper KeyboardAvoiding={false}>
      <View className="flex-1 px-8 pb-8">
        {/* Header */}
        <View className="flex flex-row items-center">
          <BackButton navigation={navigation} />
        </View>

        {/* Content */}
        <View className="flex-1 justify-center items-center gap-6">
          {/* Success Illustration Card */}
          <View className="w-full  h-fit rounded-2xl overflow-hidden">
            <Image
              source={submitSuccessfully}
              className="w-full rounded-3xl"
              resizeMode="contain"
            />
          </View>

          {/* Text */}
          <View className="items-center gap-2">
            <Text className="text-cmd font-space-grotesk-bold text-primary text-center">
              Inquiry Submitted Successfully!
            </Text>
            <Text className="text-csm font-inter text-primary/50 text-center">
              Our team will get back to you soon.
            </Text>
          </View>
        </View>

        {/* Button */}
        <Button text="Back To Dashboard" action={handleBackToDashboard} />
      </View>
    </ScreenWrapper>
  );
};

export default SubmitShipment;
