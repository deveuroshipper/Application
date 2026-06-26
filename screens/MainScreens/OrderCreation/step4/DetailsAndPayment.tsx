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
  checkCartApiHandler,
  discardCheckoutApiHandler,
  getCheckoutOrderHandler,
  priceCalculationsApiHandler,
  removeFromCartApiHandler,
} from "@/helper/Api";
import { useCartStore } from "@/store/useCartStore";
import { PaymentSheetError, useStripe } from "@stripe/stripe-react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { ORDER_STATUS } from "./PackageDetails";

const TOTAL_STEP = 4;
export const IMAGE_URL = process.env.EXPO_PUBLIC_IMAGE_URL;

type PaymentModalState = {
  type: "success" | "fail";
  title: string;
  message: string;
} | null;

const getErrorMessage = (error: any, fallback: string) =>
  typeof error === "string" ? error : (error?.message ?? fallback);

const isPaymentSheetCanceled = (error: any) =>
  error?.code === PaymentSheetError.Canceled || error?.code === "Canceled";

const DetailsAndPayment = ({ navigation, route }: any) => {
  const [step] = useState(4);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState(null);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const [pricing, setPricing] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddToCart, setShowAddToCart] = useState(false);
  const [paymentModal, setPaymentModal] = useState<PaymentModalState>(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [cartActionLoading, setCartActionLoading] = useState<
    "add" | "discard" | null
  >(null);
  const allowLeaveRef = useRef(false);
  const { orderId, selectedCoupon } = route?.params ?? {};
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const getAppliedCouponCode = () =>
    appliedCoupon?.code === couponCode.trim() ? couponCode.trim() : "";

  async function resetPricingWithoutCoupon() {
    try {
      const response = await priceCalculationsApiHandler([orderId], "");
      setPricing(response);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Failed to get details"),
      });
    }
  }

  const handleBackToHome = () => {
    allowLeaveRef.current = true;
    setPaymentModal(null);
    setShowExitModal(false);
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
    if (cartActionLoading) return;

    setCartActionLoading("add");
    try {
      await addToCartApiHandler(orderId);

      await fetchCart();
      setShowAddToCart(false);
      handleBackToHome();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error ?? "Failed to add to cart",
      });
    } finally {
      setCartActionLoading(null);
    }
  };

  const handleDiscardCheckout = async () => {
    if (cartActionLoading) return;

    setCartActionLoading("discard");
    try {
      await discardCheckoutApiHandler(orderId);
      await fetchCart();
      handleBackToHome();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Failed to discard checkout"),
      });
    } finally {
      setCartActionLoading(null);
    }
  };
  const handleApplyCoupon = async () => {
    const code = couponCode.trim();
    if (!code || couponLoading) return;

    setCouponLoading(true);
    try {
      const response = await applyCouponApiHandler({ code });
      const pricingResponse = await priceCalculationsApiHandler(
        [orderId],
        code,
      );

      setPricing(pricingResponse);
      setAppliedCoupon({
        code,
        applyResponse: response,
      });
    } catch (error: any) {
      setAppliedCoupon(null);
      await resetPricingWithoutCoupon();
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Failed to apply coupon"),
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
      // setLoading(true);
  
      const response = await getCheckoutOrderHandler(orderId);
     
      setOrderDetail(response);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Failed to get details"),
      });
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  const getPricing = useCallback(
    async (code = "") => {
      try {
        const response = await priceCalculationsApiHandler([orderId], code);
        setPricing(response);
        return response;
      } catch (error: any) {
        setAppliedCoupon((currentCoupon: any) =>
          currentCoupon?.code === code ? null : currentCoupon,
        );
        Toast.show({
          type: "error",
          text1: getErrorMessage(error, "Failed to get details"),
        });
        throw error;
      }
    },
    [orderId],
  );

  const payNow = async () => {
    if (checkoutLoading) return;
    setCheckoutLoading(true);
    try {
      const res = await api.post("/payments/checkout", {
        checkoutId: orderId,
        couponCode: getAppliedCouponCode(),
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
     
       

        if (isPaymentSheetCanceled(payment.error)) return;

        navigation.push("OrderStatus", { status: ORDER_STATUS.FAILED });
      } else {
        try {
          await removeFromCartApiHandler(orderId);
          await fetchCart();
        } catch (cartError) {}
        // setPaymentModal({
        //   type: "success",
        //   title: "Payment Successful",
        //   message: "Your payment has been completed successfully.",
        // });
        

        allowLeaveRef.current = true;
        navigation.reset({
          index: 1,
          routes: [
            {
              name: "BottomTabBar",
              params: { screen: "HomeScreen" },
            },
            {
              name: "OrderStatus",
              params: { status: ORDER_STATUS.SUCCESS },
            },
          ],
        });
      }
    } catch (error: any) {
      // setPaymentModal({
      //   type: "fail",
      //   title: "Payment Failed",
      //   message:
      //     typeof error === "string"
      //       ? error
      //       : (error?.message ?? "Unable to start payment."),
      // });
     

      if (isPaymentSheetCanceled(error)) return;

      navigation.push("OrderStatus", { status: ORDER_STATUS.FAILED });
    } finally {
      setCheckoutLoading(false);
    }
  };

  useEffect(() => {
    getDetail();
    if (!selectedCoupon?.code) {
      getPricing();
    }
  }, [getDetail, getPricing, selectedCoupon]);

  useEffect(() => {
    if (!orderId) {
      setShowAddToCart(false);
      return;
    }

    let isActive = true;

    checkCartApiHandler(orderId).then((canAddToCart) => {
    
      if (!isActive) return;

      setShowAddToCart(!canAddToCart);
    });

    return () => {
      isActive = false;
    };
  }, [orderId]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (event: any) => {
      if (allowLeaveRef.current || !orderId) return;

      event.preventDefault();
      setShowExitModal(true);
    });

    return unsubscribe;
  }, [navigation, orderId]);

  useEffect(() => {
    const code = selectedCoupon?.code?.trim();
    if (!code) return;

    const applySelectedCoupon = async () => {
      setCouponLoading(true);
      setCouponCode(code);
      try {
        const pricingResponse =
          selectedCoupon?.pricing ??
          (await priceCalculationsApiHandler([orderId], code));

        setPricing(pricingResponse);
        setAppliedCoupon(selectedCoupon);
      } catch (error: any) {
        setAppliedCoupon(null);
        await resetPricingWithoutCoupon();
        Toast.show({
          type: "error",
          text1: getErrorMessage(error, "Failed to apply coupon"),
        });
      } finally {
        setCouponLoading(false);
      }
    };

    applySelectedCoupon();
  }, [orderId, selectedCoupon]);

  const isCouponApplied =
    Boolean(appliedCoupon?.code) &&
    appliedCoupon?.code === couponCode.trim() &&
    !couponLoading;

  return (
    <ScreenWrapper KeyboardAvoiding={false}>
      {loading ? (
        <View className="flex-1 items-center justify-center ">
          <ActivityIndicator size={"large"} color={"#0F1729"} />
        </View>
      ) : (
        <View className="flex-1 pb-8 ">
          <Modal
            transparent
            animationType="fade"
            visible={showExitModal}
            onRequestClose={() => setShowExitModal(false)}
          >
            <View className="flex-1 justify-center bg-black/45 px-8">
              <View
                className="rounded-3xl bg-white p-5"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.16,
                  shadowRadius: 18,
                  elevation: 10,
                }}
              >
                <View className="items-center">
                  <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <View className="h-14 w-14 items-center justify-center rounded-full bg-primary">
                      <Icon name="Cart" color="#FFFFFF" size={28} />
                    </View>
                  </View>

                  <View className="items-center gap-2">
                    {/* <View className="rounded-full bg-[#E3EDFA] px-3 py-1">
                      <Text className="text-csm font-inter-semibold text-[#2373CD]">
                        Recommended
                      </Text>
                    </View> */}
                    <Text className="text-center text-cmd font-space-grotesk-bold text-primary">
                      Save this checkout to cart?
                    </Text>
                    <Text className="text-center text-csm font-inter leading-5 text-primary/55">
                      Keep this shipment ready and finish payment whenever you
                      are ready.
                    </Text>
                  </View>
                </View>

                <View className="mt-5 rounded-2xl border border-[#B5C3E8]/30 bg-[#F8FAFD] px-4 py-3">
                  <View className="flex-row items-center gap-3">
                    <View className="h-7 w-7 items-center justify-center rounded-full bg-[#2373CD]/10">
                      <Icon name="CheckCircle" color="#2373CD" size={16} />
                    </View>
                    <Text className="flex-1 text-csm font-inter-medium text-primary/70">
                      Your pickup and package details stay saved.
                    </Text>
                  </View>
                  <View className="mt-3 flex-row items-center gap-3">
                    <View className="h-7 w-7 items-center justify-center rounded-full bg-[#2373CD]/10">
                      <Icon name="Shield" color="#2373CD" size={16} />
                    </View>
                    <Text className="flex-1 text-csm font-inter-medium text-primary/70">
                      You can checkout later from the cart.
                    </Text>
                  </View>
                </View>

                <View className="mt-5 gap-3">
                  <Button
                    text="Add To Cart"
                    action={handleSaveToCart}
                    loading={cartActionLoading === "add"}
                    disabled={Boolean(cartActionLoading)}
                    icon={<Icon name="NextArrow" color="#FFFFFF" size={18} />}
                  />
                  <TouchableOpacity
                    onPress={
                      cartActionLoading ? undefined : handleDiscardCheckout
                    }
                    disabled={Boolean(cartActionLoading)}
                    className="h-12 flex-row items-center justify-center gap-2 rounded-xl border border-[#D92D20]/15 bg-[#D92D20]/5"
                    style={{ opacity: cartActionLoading ? 0.6 : 1 }}
                  >
                    {cartActionLoading === "discard" ? (
                      <ActivityIndicator color="#D92D20" />
                    ) : (
                      <>
                        <Icon name="Trash" color="#D92D20" size={16} />
                        <Text className="text-csm font-inter-bold text-[#D92D20]">
                          Discard checkout
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

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
                    source={{
                      uri: `${IMAGE_URL}/${orderDetail?.box?.boxImage}`,
                    }}
                    style={{ width: 64, height: 64 }}
                    resizeMode="contain"
                  />

                  <Text className="text-csm font-inter-bold text-primary mt-1">
                    ${orderDetail?.box?.price?.price}
                  </Text>
                </View>

                {/* Order Details */}
                <View className="flex-1 gap-1 ">
                  <Text className="text-csm mb-2 font-inter-semibold text-[#334155]">
                    Order Id :{" "}
                    {orderDetail?.shortId
                      ? orderDetail?.shortId?.toUpperCase()
                      : orderDetail?.id
                          ?.toUpperCase()
                          ?.slice(0, 10)
                          ?.replaceAll("-", "") + "..."}
                  </Text>
                  <Text className="text-csm font-inter text-[#334155]">
                    Size: {orderDetail?.box?.name}
                  </Text>
                  <Text className="text-csm font-inter text-[#334155]">
                    Max Weight: {orderDetail?.box?.weight} KG
                  </Text>
                  <Text className="text-csm font-inter text-[#334155]">
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
              <View className="flex flex-row items-center border-2 bg-white border-[#B5C3E8]/30 rounded-2xl px-4 py-2 gap-3">
                <Icon name="Percent" size={30} color="#2373CD" />
                <TextInput
                  className={`flex-1 text-cno font-inter-medium ${isCouponApplied ? "text-[#2373CD]" : "text-primary"}`}
                  placeholder="Enter Coupon Code"
                  placeholderTextColor="#CBD5E1"
                  value={couponCode}
                  onChangeText={(text) => {
                    setCouponCode(text);
                    if (appliedCoupon) {
                      setAppliedCoupon(null);
                      resetPricingWithoutCoupon();
                    }
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
                <Text className="text-csm font-inter-semibold text-[#8E8E93]">
                  Sub Total
                </Text>
                <Text className="text-csm font-inter-semibold text-[#8E8E93]">
                  ${pricing?.subtotal ?? "N/A"}
                </Text>
              </View>

              {pricing?.discount > 0 ? (
                <View className="flex flex-row justify-between items-center py-1">
                  <Text className="text-csm font-inter-semibold text-[#8E8E93]">
                    Discount
                  </Text>
                  <Text className="text-csm font-inter-semibold text-[#8E8E93]">
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
                <Text className="text-csm font-inter-semibold text-[#8E8E93]">
                  Tax & Fee
                </Text>
                <Text className="text-csm font-inter-semibold text-[#8E8E93]">
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
                <Text className="text-cno font-inter-semibold text-primary">
                  Total
                </Text>
                <Text className="text-cno font-inter-bold text-primary">
                  ${pricing?.total ? pricing?.total?.toFixed(2) : "N/A"}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
          </ScrollView>
          <View className="flex flex-col gap-5  px-8">
            {showAddToCart ? (
              <Button
                text="Save To Cart"
                action={handleSaveToCart}
                loading={cartActionLoading === "add"}
                disabled={Boolean(cartActionLoading)}
                variant={Variant.OUTLINE}
              />
            ) : null}
            <Button
              text="Quick Checkout"
              action={() => payNow()}
              loading={checkoutLoading}
              disabled={checkoutLoading}
              variant={Variant.DEFAULT}
            />
          </View>
        </View>
      )}
    </ScreenWrapper>
  );
};

export default DetailsAndPayment;
