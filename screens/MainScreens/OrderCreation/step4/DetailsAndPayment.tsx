import Icon from "@/assets/icons";
import BackButton from "@/components/BackButton";
import Button, { Size, Variant } from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import { addToCartApiHandler, getOrderByIdApiHandler } from "@/helper/Api";
import { useCartStore } from "@/store/useCartStore";
import React, { useEffect, useState } from "react";
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

const DetailsAndPayment = ({ navigation, route }: any) => {
  const [step] = useState(4);
  const [couponCode, setCouponCode] = useState("");
  const [orderDetail, setOrderDetail] = useState(null);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const { orderId } = route?.params ?? {};



  const handleSubmit = () => {
    navigation.push("PackageDetails");
  };
  const handleSaveToCart = async () => {
    try {
      const response = await addToCartApiHandler(orderId);
    
      await fetchCart();
      navigation.push("CartScreen");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error ?? "Failed to add to cart",
      });
    }
  };
  const handleApplyCoupon = () => {
    navigation.push("ApplyCoupon");
  };
  const handleViewAllDetails = () => {
    navigation.push("PackageDetails", { orderId: orderId });
  };
  const handleAvailableCoupons = () => {};

  const getDetail = async () => {
    try {
      const response = await getOrderByIdApiHandler(orderId);
     
      setOrderDetail(response);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error ?? "Failed to get details",
      });
    }
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <ScreenWrapper KeyboardAvoiding={false}>
      <View className="flex-1 pb-8 ">
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
                onChangeText={setCouponCode}
              />
              <TouchableOpacity onPress={handleApplyCoupon}>
                <Text className="text-cno font-inter-medium text-[#2373CD]">
                  Apply
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
                $70.00
              </Text>
            </View>

            {/* Dashed Separator */}

            {/* Tax & Fee */}
            <View className="flex flex-row justify-between items-center py-1 mb-2">
              <Text className="text-csm font-inter-bold text-primary/60">
                Tax & Fee
              </Text>
              <Text className="text-csm font-inter-bold text-primary/60">
                $5.00
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
                $105.00
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
            action={handleSubmit}
            variant={Variant.DEFAULT}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default DetailsAndPayment;
