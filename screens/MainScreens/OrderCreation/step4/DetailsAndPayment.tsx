import Icon from "@/assets/icons";
import OrderFail from "@/assets/images/orderFail.png";
import OrderSuccessfully from "@/assets/images/orderSuccess.png";
import BackButton from "@/components/BackButton";
import Button, { Size, Variant } from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import SuccessModel from "@/components/SuccessModel";
import {
  addToCartApiHandler,
  api,
  applyCouponApiHandler,
  getOrderByIdApiHandler,
  priceCalculationsApiHandler,
} from "@/helper/Api";
import { useCartStore } from "@/store/useCartStore";
import { useStripe } from "@stripe/stripe-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const TOTAL_STEP = 4;
export const IMAGE_URL = process.env.EXPO_PUBLIC_IMAGE_URL;

type PaymentModalState = {
  type: "success" | "fail";
  title: string;
  message: string;
} | null;

const DetailsAndPayment = ({ navigation, route }: any) => {
  const [step] = useState(4);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const [pricing, setPricing] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [paymentModal, setPaymentModal] = useState<PaymentModalState>(null);
  const { orderId, selectedCoupon } = route?.params ?? {};
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const handleBackToHome = () => {
    setPaymentModal(null);
    navigation.reset({
      index: 0,
      routes: [
        {
          name: "BottomTabBar",
          params: { screen: "HomeScreen" },
        },
      ],
    });
  };

  const handleSaveToCart = async () => {
    try {
      await addToCartApiHandler(orderId);

      await fetchCart();
      navigation.push("CartScreen");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error ?? "Failed to add to cart",
      });
    }
  };
  const handleApplyCoupon = async () => {
    const code = couponCode.trim();
    if (!code || couponLoading) return;

    setCouponLoading(true);
    try {
      const response = await applyCouponApiHandler({ code });
      setAppliedCoupon({
        code,
        applyResponse: response,
      });
    } catch (error: any) {
      setAppliedCoupon(null);
      Toast.show({
        type: "error",
        text1: error ?? "Failed to apply coupon",
      });
    } finally {
      setCouponLoading(false);
    }
  };
  const handleViewAllDetails = () => {
    navigation.push("PackageDetails", { orderId: orderId });
  };
  const handleAvailableCoupons = () => {
    navigation.push("ApplyCoupon", {
      orderId,
      couponCode,
    });
  };

  const getDetail = useCallback(async () => {
    try {
      const response = await getOrderByIdApiHandler(orderId);

      setOrderDetail(response);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error ?? "Failed to get details",
      });
    }
  }, [orderId, couponCode]);

  const getPricing = useCallback(async () => {
    try {
      const response = await priceCalculationsApiHandler([orderId], couponCode);
      setPricing(response);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error ?? "Failed to get details",
      });
    }
  }, [orderId, couponCode]);

  const payNow = async () => {
    if (checkoutLoading) return;
    setCheckoutLoading(true);
    try {
      const res = await api.post("/payments/checkout", {
        orderId,
        couponCode,
        paymentMethod: "STRIPE",
      });
      const clientSecret = res.data?.data?.clientSecret;
      if (!clientSecret) {
        setPaymentModal({
          type: "fail",
          title: "Payment Failed",
          message: "Payment client secret missing. Please try again.",
        });
        return;
      }
      const init = await initPaymentSheet({
        merchantDisplayName: "EuroShipper",
        paymentIntentClientSecret: clientSecret,
      });
      if (init.error) {
        setPaymentModal({
          type: "fail",
          title: "Payment Failed",
          message: init.error.message,
        });
        return;
      }
      const payment = await presentPaymentSheet();
      if (payment.error) {
        setPaymentModal({
          type: "fail",
          title: "Payment Failed",
          message: payment.error.message,
        });
      } else {
        try {
          await removeFromCartApiHandler(orderId);
          await fetchCart();
        } catch (cartError) {}
        setPaymentModal({
          type: "success",
          title: "Payment Successful",
          message: "Your payment has been completed successfully.",
        });
      }
    } catch (error: any) {
      setPaymentModal({
        type: "fail",
        title: "Payment Failed",
        message:
          typeof error === "string"
            ? error
            : (error?.message ?? "Unable to start payment."),
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  useEffect(() => {
    getDetail();
    getPricing();
  }, [getDetail, getPricing]);

  useEffect(() => {
    getPricing();
  }, [couponCode, getPricing]);

  useEffect(() => {
    if (!selectedCoupon?.code) return;

    setCouponCode(selectedCoupon.code);
    setAppliedCoupon(selectedCoupon);
  }, [selectedCoupon]);

  const isCouponApplied =
    Boolean(appliedCoupon?.code) &&
    appliedCoupon?.code === couponCode.trim() &&
    !couponLoading;

  return (
    <ScreenWrapper KeyboardAvoiding={false}>
      <View className="flex-1 pb-8 ">
        <SuccessModel
          show={Boolean(paymentModal)}
          onclose={handleBackToHome}
          body={
            <View className="flex-1 bg-black/40 justify-center px-8">
              <View className="bg-white rounded-3xl p-6 items-center gap-5">
                <Image
                  source={
                    paymentModal?.type === "success"
                      ? OrderSuccessfully
                      : OrderFail
                  }
                  className="w-full h-56 rounded-3xl"
                  resizeMode="contain"
                />

                <View className="items-center gap-2">
                  <Text className="text-cmd font-space-grotesk-bold text-primary text-center">
                    {paymentModal?.title}
                  </Text>
                  <Text className="text-csm font-inter text-primary/50 text-center">
                    {paymentModal?.message}
                  </Text>
                </View>

                <Button text="Done" action={handleBackToHome} />
              </View>
            </View>
          }
        />

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
          className="flex-1 mt-8 pt-2 px-8 "
          contentContainerStyle={{ gap: 16, paddingBottom: 16 }}
        >
          {/* Order Summary Card */}
          <View
            className="bg-white rounded-2xl p-4 flex flex-col gap-4 mb-4"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View className="flex flex-row items-center gap-2">
              {/* Box Image + Price */}
              <View className="items-center pr-2">
                <Image
                  source={{ uri: `${IMAGE_URL}/${orderDetail?.box?.boxImage}` }}
                  style={{ width: 64, height: 64 }}
                  resizeMode="contain"
                />

                <Text className="text-csm font-inter-bold text-primary mt-1">
                  ${orderDetail?.box?.price}
                </Text>
              </View>

              {/* Order Details */}
              <View className="flex-1 gap-1 ">
                <Text className="text-csm mb-2 font-inter-bold text-primary">
                  Order Id : {orderDetail?.id?.slice(0, 10) + "..."}
                </Text>
                <Text className="text-csm font-inter text-primary/60">
                  Size: {orderDetail?.box?.name}
                </Text>
                <Text className="text-csm font-inter text-primary/60">
                  Max Weight: {orderDetail?.box?.weight} KG
                </Text>
                <Text className="text-csm font-inter text-primary/60">
                  Max Size: {orderDetail?.box?.height} X{" "}
                  {orderDetail?.box?.width} X {orderDetail?.box?.length}cm
                </Text>
              </View>

              {/* Airplane / Ship Icon */}
              <View className="w-12 h-12 mb-auto  items-center justify-center bg-[#E3EDFA] rounded-full">
                {orderDetail?.box?.mode === "SHIP" ? (
                  <Icon name="ShipOutline" size={26} color="#000000" />
                ) : (
                  <Icon name="PlanOutline" size={26} color="#000000" />
                )}
                {/* <Icon name="PlanOutline" size={26} color="#000000" /> */}
                {/* <Icon name="ShipOutline" size={26} color="#000000" /> */}
              </View>
            </View>

            <Button
              text="View All Details"
              action={handleViewAllDetails}
              variant={Variant.OUTLINE}
              size={Size.SMALL}
            />
          </View>

          {/* Coupon Card */}

          {/* Coupon Input Row */}
          <View className="mb-4">
            <View className="flex flex-row items-center border-2 bg-white border-[#B5C3E8]/30 rounded-xl px-4 py-2 gap-3">
              <Icon name="Percent" size={28} color="#2373CD" />
              <TextInput
                className="flex-1 text-cno font-inter text-primary"
                placeholder="Enter Coupon Code"
                placeholderTextColor="#9CA3AF"
                value={couponCode}
                onChangeText={(text) => {
                  setCouponCode(text);
                  setAppliedCoupon(null);
                }}
              />
              <TouchableOpacity
                onPress={handleApplyCoupon}
                disabled={
                  !couponCode.trim() || couponLoading || isCouponApplied
                }
              >
                <Text className="text-cno font-inter-medium text-[#2373CD]">
                  {isCouponApplied
                    ? "Applied"
                    : couponLoading
                      ? "Applying"
                      : "Apply"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Available Coupons */}
            <TouchableOpacity
              onPress={handleAvailableCoupons}
              className="mt-2 flex flex-row items-center justify-end gap-1"
            >
              <Text className="text-csm font-inter-medium text-green-500">
                Available Coupons
              </Text>
              <View className="w-6 h-6 rounded-full bg-green-500 rotate-180 items-center justify-center">
                <Icon name="BackArrow" size={10} color="#FFFF" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Price Breakdown Card */}
          <View className="border-2 bg-white border-[#B5C3E8]/30 rounded-2xl px-5 py-4">
            {/* Sub Total */}
            <View className="flex flex-row justify-between items-center py-1">
              <Text className="text-csm font-inter-bold text-primary/60">
                Sub Total
              </Text>
              <Text className="text-csm font-inter-bold text-primary/60">
                ${pricing?.subtotal ?? "N/A"}
              </Text>
            </View>

            {pricing?.discount > 0 ? (
              <View className="flex flex-row justify-between items-center py-1">
                <Text className="text-csm font-inter-bold text-primary/60">
                  Discount
                </Text>
                <Text className="text-csm font-inter-bold text-primary/60">
                  ${pricing?.discount ?? "N/A"}{" "}
                  {!pricing?.isFlated
                    ? `(${pricing?.discountPercentage}%)`
                    : null}
                </Text>
              </View>
            ) : null}

            {/* Dashed Separator */}

            {/* Tax & Fee */}
            <View className="flex flex-row justify-between items-center py-1 mb-2">
              <Text className="text-csm font-inter-bold text-primary/60">
                Tax & Fee
              </Text>
              <Text className="text-csm font-inter-bold text-primary/60">
                ${pricing?.tax ?? "N/A"}
              </Text>
            </View>

            {/* Solid Separator */}
            <View
              style={{
                borderTopWidth: 1.5,
                borderTopColor: "#CBD5E1",
                borderStyle: "dashed",
              }}
            />

            {/* Total */}
            <View className="flex flex-row justify-between items-center pt-3">
              <Text className="text-cno font-inter-bold text-primary">
                Total
              </Text>
              <Text className="text-cno font-inter-bold text-primary">
                ${pricing?.total ?? "N/A"}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
        </ScrollView>
        <View className="flex flex-col gap-4 mt- px-8">
          <Button
            text="Save To Cart"
            action={handleSaveToCart}
            variant={Variant.OUTLINE}
          />
          <Button
            text="Quick Checkout"
            action={() => payNow()}
            loading={checkoutLoading}
            disabled={checkoutLoading}
            variant={Variant.DEFAULT}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default DetailsAndPayment;
