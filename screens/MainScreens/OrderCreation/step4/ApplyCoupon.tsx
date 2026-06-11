import Icon from "@/assets/icons";
import BackButton from "@/components/BackButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import {
  applyCouponApiHandler,
  getCouponsApiHandler,
  priceCalculationsApiHandler,
} from "@/helper/Api";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const TOTAL_STEP = 4;

const getErrorMessage = (error: any, fallback: string) =>
  typeof error === "string" ? error : (error?.message ?? fallback);

const ApplyCoupon = ({ navigation, route }: any) => {
  const [step] = useState(4);
  const { orderId, couponCode: initialCouponCode = "" } = route?.params ?? {};
  const [couponCode, setCouponCode] = useState(initialCouponCode);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);

  const getCouponCode = (coupon: any) =>
    String(coupon?.code ?? coupon?.couponCode ?? coupon?.name ?? "");

  const getCouponDescription = (coupon: any) =>
    coupon?.description ||
    coupon?.title ||
    coupon?.details ||
    "Coupon available for this order";

  const getCoupons = async () => {
    setLoading(true);
    try {
      const response = await getCouponsApiHandler();
      const couponList = Array.isArray(response)
        ? response
        : (response?.coupons ?? response?.data ?? []);
      setCoupons(Array.isArray(couponList) ? couponList : []);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1:
          typeof error === "string"
            ? error
            : (error?.message ?? "Failed to get coupons"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUseCoupon = (coupon: any) => {
    const code = getCouponCode(coupon).trim();
    if (!code) return;

    setCouponCode(code);
  };

  const handleApplyTypedCoupon = async () => {
    const code = couponCode.trim();
    if (!code || applyLoading) return;

    setApplyLoading(true);
    try {
      const response = await applyCouponApiHandler({ code });
      const pricing = await priceCalculationsApiHandler([orderId], code);

      const selectedCoupon =
        coupons.find((coupon) => getCouponCode(coupon) === code) ?? {
          id: "manual",
          code,
          description: "Manual coupon code",
        };

      navigation.navigate({
        name: "DetailsAndPayment",
        params: {
          orderId,
          selectedCoupon: {
            ...selectedCoupon,
            code,
            applyResponse: response,
            pricing,
          },
        },
        merge: true,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Invalid coupon"),
      });
    } finally {
      setApplyLoading(false);
    }
  };

  useEffect(() => {
    getCoupons();
  }, []);

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
          {/* search coupon & apply */}
          <View className="flex flex-row items-center border-2 bg-white border-[#B5C3E8]/30 rounded-xl px-4 py-2 gap-3">
            <Icon name="Percent" size={30} color="#2373CD" />
            <TextInput
              className="flex-1 text-cno font-inter text-primary"
              placeholder="Enter Coupon Code"
              placeholderTextColor="#9CA3AF"
              value={couponCode}
              onChangeText={(text) => {
                setCouponCode(text);
              }}
            />
            <TouchableOpacity
              onPress={handleApplyTypedCoupon}
              disabled={!couponCode.trim() || applyLoading}
            >
              <Text className="text-cno font-inter-medium text-[#2373CD]">
                {applyLoading ? "Applying" : "Apply"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Available Coupons Label */}

          {/* Coupon Cards */}
          <View className="gap-3 mt-4">
            <Text className="text-csm font-inter-bold text-primary tracking-wider uppercase">
              Available Coupons
            </Text>

            {loading ? (
              <View className="items-center py-8">
                <ActivityIndicator color="#0F1729" size="large" />
              </View>
            ) : coupons.length > 0 ? (
              coupons.map((coupon) => {
                const code = getCouponCode(coupon);

                return (
                  <View
                    key={coupon?.id ?? code}
                    className="flex flex-row items-center border-2 bg-white border-[#B5C3E8]/30 rounded-xl px-4 py-2 gap-3"
                  >
                    <Icon name="Percent" size={36} color="#243E85" />
                    <View className="flex-1">
                      <Text className="text-cno font-inter-bold text-[#243E85]">
                        {code}
                      </Text>

                      <Text className="text-cxs font-inter-medium  text-[#243E85]/80 mt-0.5">
                        {getCouponDescription(coupon)}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleUseCoupon(coupon)}>
                      <Text className="text-cno font-inter-medium text-[#243E85]/80">
                        {couponCode.trim() === code ? "Using" : "Use"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            ) : (
              <View className="items-center py-8">
                <Text className="text-csm font-inter-medium text-primary/50">
                  No coupons available
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default ApplyCoupon;
