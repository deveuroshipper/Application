import Icon from "@/assets/icons";
import SmallBox from "@/assets/images/boxes/smallBox.png";
import BackButton from "@/components/BackButton";
import Button, { Variant } from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
const TOTAL_STEP = 4;

export const enum ORDER_STATUS {
  SUCCESS,
  FAILED,
}

const PackageDetails = ({ navigation }: any) => {
  const [step] = useState(4);
  const [selectedShipment, setSelectedShipment] = useState<"air" | "sea">(
    "air",
  );

  const handleCheckout = () => {
    navigation.push("OrderStatus", { status: ORDER_STATUS.FAILED });
  };

  return (
    <ScreenWrapper KeyboardAvoiding={false}>
      <View className="flex-1 pb-8">
        {/* Header */}
        <View className="flex flex-row items-center justify-between px-8">
          <BackButton navigation={navigation} />
          <View className="px-4 py-1 bg-[#BFCDDE] rounded-full">
            <Text className="text-cno text-primary font-inter-medium">
              {step}/{TOTAL_STEP}
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 mt-6 px-8 "
          contentContainerStyle={{ paddingBottom: 16, gap: 16 }}
        >
          {/* Title + Order Info */}
          <View className="gap-6">
            <Text className="text-2xl font-space-grotesk-bold text-primary">
              Package Details
            </Text>
            <View className="flex flex-row items-end justify-between">
              <View>
                <Text className="text-csm font-inter-medium text-primary/50">
                  Type of Shipment
                </Text>
                <Text className="text-cno font-inter-bold text-primary">
                  Drop Off at Warehouse
                </Text>
              </View>
              <Text className="text-csm font-inter-bold text-primary mb-0.5">
                Order id :#58588
              </Text>
            </View>
          </View>

          {/* Delivery Address Card */}
          <View className="bg-white rounded-2xl p-4 gap-4 mt-2">
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-2">
                <View className="w-10 h-10 rounded-full bg-[#E3EDFA] items-center justify-center">
                  <Icon name="MapPin" size={22} color="#001C4E" />
                </View>
                <Text className="text-cno font-inter-bold text-primary">
                  Delivery
                </Text>
              </View>
              {/* Belgium flag */}
              <Image
                source={{ uri: "https://flagcdn.com/w80/se.png" }}
                className="w-11 h-8 rounded-md"
              />
            </View>
            <Text className="text-csm font-inter-medium text-primary/80 ml-1">
              45 King Street, Manchester M2 4WU, Belgium
            </Text>
          </View>

          {/* Category / Sub-Category / Wgt.Dim row */}
          <View className="flex flex-row gap-3 mt-3">
            <View className="flex-1 flex flex-col gap-3">
              <Text className="text-csm font-inter-bold text-primary">
                Category
              </Text>
              <View
                className={`flex-1 flex justify-center items-center rounded-2xl border-[1.5px] border-[#B5C3E8]/30 bg-white px-4 py-2`}
              >
                <View
                  className={`mb-3 h-14 w-14 items-center justify-center  bg-[#D6E0EE] rounded-full`}
                >
                  {/* <Ionicons name={item.icon} size={22} color="#0F1729" /> */}
                </View>
                <Text
                  className="text-center font-inter-bold text-csm text-primary"
                  numberOfLines={2}
                >
                  Furniture Home Decor
                </Text>
              </View>
            </View>
            <View className="flex-1 flex flex-col gap-3">
              <Text className="text-csm font-inter-bold text-primary">
                Sub-Category
              </Text>
              <View
                className={`flex-1 flex justify-center items-center rounded-2xl border-[1.5px] border-[#B5C3E8]/30 bg-white px-4 py-2`}
              >
                <View
                  className={`mb-3 h-14 w-14 items-center justify-center  bg-[#D6E0EE] rounded-full`}
                >
                  {/* <Ionicons name={item.icon} size={22} color="#0F1729" /> */}
                </View>
                <Text
                  className="text-center font-inter-bold text-csm text-primary"
                  numberOfLines={2}
                >
                  Baby Car Toys
                </Text>
              </View>
            </View>
            <View className="flex-1 flex flex-col gap-3">
              <Text className="text-csm font-inter-bold text-primary">
                Wgt/Dim.
              </Text>
              <View
                className={`flex-1 flex justify-center items-center rounded-2xl border-[1.5px] border-[#B5C3E8]/30 bg-white px-3 py-2`}
              >
                <Image
                  className={`w-full  items-center justify-center  bg-[#D6E0EE] rounded-full`}
                  source={SmallBox}
                />

                <Text
                  className="text-center font-inter-bold text-csm text-primary"
                  numberOfLines={2}
                >
                  Size: Medium
                </Text>
                <Text className="text-center font-inter text-[12px] text-primary/80">
                  Max Weight: 3 KG
                </Text>
              </View>
            </View>
          </View>

          {/* Date & Time Submission row */}
          <View className="flex flex-row gap-3 mt-3">
            {/* Date */}
            <View className="flex-1 bg-white rounded-2xl p-4 border-[1.5px] border-[#B5C3E8]/30">
              <Icon name="Calendar" size={20} color="#9CA3AF" />
              <Text className="text-csm font-inter-bold text-primary mt-1">
                Date Submission
              </Text>
              <Text className="text-csm font-inter-medium text-primary/80">
                May 25, 2026
              </Text>
            </View>

            {/* Time */}
            <View className="flex-1 bg-white rounded-2xl p-4 border-[1.5px] border-[#B5C3E8]/30">
              <Icon name="Time" size={20} color="#9CA3AF" />
              <Text className="text-csm font-inter-bold text-primary mt-1">
                Time Submission
              </Text>
              <Text className="text-csm font-inter-medium text-primary/80">
                10 AM - 12 PM
              </Text>
            </View>
          </View>

          {/* Type of Shipment */}
          <View className="gap-3 mt-3">
            <Text className="text-csm font-inter-bold text-primary/80 tracking-wider uppercase">
              TYPE OF SHIPMENT
            </Text>

            {/* Air Freight Option */}
            <TouchableOpacity
              onPress={() => setSelectedShipment("air")}
              className="flex flex-row items-center gap-3 border-[1.5px] border-[#B5C3E8]/30 bg-[#F4F9FF] rounded-2xl px-4 py-4"
            >
              <Icon name="Plan" size={22} color="#BFCDDE" />
              <Text className="text-cno font-inter-medium text-primary">
                Air Freight
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Checkout Button */}
        <View className="px-8 mt-4">
          <Button
            text="Checkout"
            action={handleCheckout}
            variant={Variant.DEFAULT}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default PackageDetails;
