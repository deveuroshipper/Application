import OrderFail from "@/assets/images/orderFail.png";
import OrderSuccessfully from "@/assets/images/orderSuccess.png";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import React from "react";
import { Image, Text, View } from "react-native";
import { ORDER_STATUS } from "./PackageDetails";

const OrderStatus = ({ navigation, route }: any) => {
  const handleBackToDashboard = () => {
    navigation.push("BottomTabBar");
  };
  const IsSuccess: Boolean = route?.params?.status == ORDER_STATUS.SUCCESS;

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
              source={IsSuccess ? OrderSuccessfully : OrderFail}
              className="w-full rounded-3xl"
              resizeMode="contain"
            />
          </View>

          {/* Text */}
          <View className="items-center gap-2 ">
            <Text className="text-csl leading-[22px]  font-space-grotesk-bold text-primary text-center">
              {IsSuccess ? "Your Order Has Been" : "Your Order Failed!"}
            </Text>
            {IsSuccess ? (
              <Text className="text-csl leading-[22px]  font-space-grotesk-bold text-primary text-center">
                Successfully Created
              </Text>
            ) : null}
            <Text className="text-csm mt-3 font-inter px-4 text-black text-center">
              {IsSuccess
                ? "Your shipment has been created. We’ll keep you updated every step of the way."
                : "Something went wrong while creating your order. Please try again or contact support."}
            </Text>
          </View>
        </View>

        {/* Button */}
        <Button text="Back To Dashboard" action={handleBackToDashboard} />
      </View>
    </ScreenWrapper>
  );
};

export default OrderStatus;
