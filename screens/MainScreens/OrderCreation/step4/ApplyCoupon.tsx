import Icon from "@/assets/icons";
import BackButton from "@/components/BackButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TOTAL_STEP = 4;

const COUPONS = [
  {
    id: "1",
    code: "DL3243",
    description: "Get 25% Discount upto $50 on shipping",
  },
  {
    id: "2",
    code: "DL3243",
    description: "Get 25% Discount upto $50 on shipping",
  },
  {
    id: "3",
    code: "DL3243",
    description: "Get 25% Discount upto $50 on shipping",
  },
  {
    id: "4",
    code: "DL3243",
    description: "Get 25% Discount upto $50 on shipping",
  },
];

const ApplyCoupon = ({ navigation }: any) => {
  const [step] = useState(4);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const handleApply = (code: string) => {
    setAppliedCoupon(code);
    setCouponCode(code);
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
          className="flex-1 mt-6 px-8"
          contentContainerStyle={{ paddingBottom: 16, gap: 20 }}
        >
          <View className="flex flex-row items-center border-2 bg-white border-[#B5C3E8]/30 rounded-xl px-4 py-2 gap-3">
            <Icon name="Percent" size={30} color="#2373CD" />
            <TextInput
              className="flex-1 text-cno font-inter text-primary"
              placeholder="Enter Coupon Code"
              placeholderTextColor="#9CA3AF"
              value={couponCode}
              onChangeText={setCouponCode}
            />
            <TouchableOpacity onPress={() => {}}>
              <Text className="text-cno font-inter-medium text-[#2373CD]">
                Apply
              </Text>
            </TouchableOpacity>
          </View>

          {/* Available Coupons Label */}

          {/* Coupon Cards */}
          <View className="gap-3 mt-4">
            <Text className="text-csm font-inter-bold text-primary tracking-wider uppercase">
              Available Coupons
            </Text>

            {COUPONS.map((coupon) => (
              <View className="flex flex-row items-center border-2 bg-white border-[#B5C3E8]/30 rounded-xl px-4 py-2 gap-3">
                <Icon name="Percent" size={36} color="#243E85" />
                <View className="flex-1">
                  <Text className="text-cno font-inter-bold text-[#243E85]">
                    {coupon.code}
                  </Text>

                  <Text className="text-cxs font-inter-medium  text-[#243E85]/80 mt-0.5">
                    {coupon.description}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => {}}>
                  <Text className="text-cno font-inter-medium text-[#243E85]/80">
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default ApplyCoupon;
