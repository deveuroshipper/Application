import Icon from "@/assets/icons";
import BackButton from "@/components/BackButton";
import Button, { Variant } from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import { getOrderByIdApiHandler } from "@/helper/Api";
import { CountryImage } from "@/helper/buildFlagUrl";
import { formatDate, formatTimeRange } from "@/helper/formateDateTime";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";
const TOTAL_STEP = 4;

export const enum ORDER_STATUS {
  SUCCESS,
  FAILED,
}
export const IMAGE_URL = process.env.EXPO_PUBLIC_IMAGE_URL;

const PackageDetails = ({ navigation, route }: any) => {
  const [step] = useState(4);
  const { orderId, showCheckOut = true } = route?.params ?? {};
  // const orderId = "34009bcf-e9c6-4b01-bc46-588c0c2fbe5f";

  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState<"air" | "sea">(
    "air",
  );

  const handleCheckout = () => {
    navigation.push("DetailsAndPayment", { orderId: orderId });
  };

  const getDetail = async () => {
    try {
      const response = await getOrderByIdApiHandler(orderId);

      setOrderDetail(response);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Failed to copy address",
      });
    } finally {
      setLoading(false);
    }
  };

  const buildAddress = (data) => {
    return [
      `${data?.fullName} : ${data?.dialCode}${data?.number}`,
      `${data?.addressLine} ${data?.city}, ${data?.state} ${data?.pincode}, ${data?.country}`,
      CountryImage(data?.country),
    ];
  };

  useEffect(() => {
    getDetail();
  }, []);

  return (
    <ScreenWrapper KeyboardAvoiding={false}>
      {loading ? (
        <View className="flex-1 items-center justify-center ">
          <ActivityIndicator size={"large"} color={"#0F1729"} />
        </View>
      ) : (
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
              <View className="flex flex-col gap-2 justify-between">
                <View>
                  <Text className="text-[12px] font-inter-semibold text-[#A7A7A7]">
                    Type of Shipment
                  </Text>
                  <Text className="text-cno font-inter-bold text-primary">
                    Drop Off at Warehouse
                  </Text>
                </View>
                <Text
                  numberOfLines={1}
                  className="text-csm font-inter-semibold text-[#454545] mb-0.5"
                >
                  Order id : #
                  {orderDetail?.id?.toUpperCase()?.replaceAll("-", "")}
                </Text>
              </View>
            </View>

            {/* Delivery Address Card */}
            <View>
              {orderDetail?.deliveryType !== "DROP" ? (
                <View className="bg-white rounded-2xl p-4 gap-2 mt-2">
                  <View className="flex flex-row items-center justify-between">
                    <View className="flex flex-row items-center gap-2">
                      <View className="w-10 h-10 rounded-full bg-[#E3EDFA] items-center justify-center">
                        <Icon name="MapPin" size={22} color="#001C4E" />
                      </View>
                      <Text className="text-cno font-inter-semibold text-primary">
                        Pickup
                      </Text>
                    </View>
                    {/* Belgium flag */}
                    <Image
                      source={{
                        uri: buildAddress(orderDetail?.pickupAddress)[2],
                      }}
                      className="w-11 h-8 rounded-md"
                    />
                  </View>
                  <View>
                    <Text className="text-csm capitalize font-inter-semibold text-[#334155] ml-1">
                      {buildAddress(orderDetail?.pickupAddress)[0]}
                    </Text>
                    <Text className="text-csm font-inter leading-6 text-[#334155] ml-1">
                      {buildAddress(orderDetail?.pickupAddress)[1]}
                    </Text>
                  </View>
                </View>
              ) : null}
              <View className="bg-white rounded-2xl p-4 gap-4 mt-4">
                <View className="flex flex-row items-center justify-between">
                  <View className="flex flex-row items-center gap-2">
                    <View className="w-10 h-10 rounded-full bg-[#E3EDFA] items-center justify-center">
                      <Icon name="MapPin" size={22} color="#001C4E" />
                    </View>
                    <Text className="text-cno font-inter-semibold text-primary">
                      Delivery
                    </Text>
                  </View>
                  {/* Belgium flag */}
                  <Image
                    source={{ uri: buildAddress(orderDetail?.dropAddress)[2] }}
                    className="w-11 h-8 rounded-md"
                  />
                </View>
                <View>
                  <Text className="text-csm capitalize font-inter-semibold text-[#334155] ml-1">
                    {buildAddress(orderDetail?.dropAddress)[0]}
                  </Text>
                  <Text className="text-csm font-inter leading-6 text-[#334155] ml-1">
                    {buildAddress(orderDetail?.dropAddress)[1]}
                  </Text>
                </View>
              </View>
            </View>

            {/* Category / Sub-Category / Wgt.Dim row */}
            <View className="flex flex-row gap-3 mt-3">
              <View className="flex-1 flex flex-col gap-3">
                <Text className="text-[13px] font-inter-semibold text-[#3D3D3D]">
                  Category
                </Text>
                <View
                  className={`flex-1 flex justify-center items-center rounded-3xl border-[1.2px] border-[#E0E0E0] bg-white px-4 py-5`}
                >
                  <View
                    className={`mb-3 h-14 w-14 items-center justify-center  bg-[#D6E0EE] rounded-full`}
                  >
                    {/* <Ionicons name={item.icon} size={22} color="#0F1729" /> */}
                    <Image
                      source={{
                        uri: `${IMAGE_URL}/${orderDetail?.category?.image}`,
                      }}
                      className="w-10 h-10 rounded-md"
                    />
                  </View>
                  <Text
                    className="text-center font-inter-semibold text-[13px] text-[#334155]"
                    numberOfLines={2}
                  >
                    {orderDetail?.category?.name}
                  </Text>
                </View>
              </View>
              <View className="flex-1 flex flex-col gap-3">
                <Text className="text-[13px] font-inter-semibold text-[#3D3D3D]">
                  Sub-Category
                </Text>
                <View
                  className={`flex-1 flex justify-center items-center rounded-3xl border-[1.2px] border-[#E0E0E0] bg-white px-4 py-5`}
                >
                  <View
                    className={`mb-3 h-14 w-14 items-center justify-center  bg-[#D6E0EE] rounded-full`}
                  >
                    {/* <Ionicons name={item.icon} size={22} color="#0F1729" /> */}
                    <Image
                      source={{
                        uri: `${IMAGE_URL}/${orderDetail?.subCategory?.image}`,
                      }}
                      className="w-10 h-10 rounded-md"
                    />
                  </View>
                  <Text
                    className="text-center font-inter-semibold text-[13px] text-[#334155]"
                    numberOfLines={2}
                  >
                    {orderDetail?.subCategory?.name}
                  </Text>
                </View>
              </View>
              <View className="flex-1 flex flex-col gap-3">
                <Text className="text-[13px] font-inter-semibold text-[#3D3D3D]">
                  Wgt/Dim.
                </Text>
                <View
                  className={`flex-1 flex justify-center items-center rounded-3xl border-[1.3px] border-[#E0E0E0] bg-white px-1  py-2`}
                >
                  <Image
                    className={`w-16 h-12  mb-2 items-center justify-center  bg-[#D6E0EE]`}
                    source={{
                      uri: `${IMAGE_URL}/${orderDetail?.box?.boxImage}`,
                    }}
                  />

                  <Text
                    className="text-center font-inter-semibold text-[13px] text-[#334155]"
                    numberOfLines={2}
                  >
                    {orderDetail?.box?.name}
                  </Text>
                  <Text className="text-center font-inter text-[10px] text-primary/80">
                    Max Weight: {orderDetail?.box?.weight} KG
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
                {orderDetail?.submissionDateOnly ? (
                  <Text className="text-csm font-inter-medium text-primary/80">
                    {formatDate(orderDetail?.submissionDateOnly)}
                  </Text>
                ) : null}
              </View>

              {/* Time */}
              <View className="flex-1 bg-white rounded-2xl p-4 border-[1.5px] border-[#B5C3E8]/30">
                <Icon name="Time" size={20} color="#9CA3AF" />
                <Text className="text-csm font-inter-bold text-primary mt-1">
                  Time Submission
                </Text>
                {orderDetail?.submissionTime ? (
                  <Text className="text-csm font-inter-medium text-primary/80">
                    {formatTimeRange(orderDetail?.submissionTime)}
                  </Text>
                ) : null}
              </View>
            </View>

            {/* Type of Shipment */}
            <View className="gap-3 mt-3 mb-6">
              <Text className="text-csm font-inter-bold text-primary/80 tracking-wider uppercase">
                TYPE OF SHIPMENT
              </Text>

              {/* Air Freight Option */}
              {orderDetail?.mode == "AIR" ? (
                <View className="flex flex-row items-center gap-3 border-[1.5px] border-[#B5C3E8]/30 bg-[#F4F9FF] rounded-2xl px-4 py-4">
                  <Icon name="Plan" size={22} color="#BFCDDE" />
                  <Text className="text-cno font-inter-medium text-primary">
                    Air Freight
                  </Text>
                </View>
              ) : (
                <View className="flex flex-row items-center gap-3 border-[1.5px] border-[#B5C3E8]/30 bg-[#F4F9FF] rounded-2xl px-4 py-4">
                  <Icon name="Ship" size={22} color="#BFCDDE" />
                  <Text className="text-cno font-inter-medium text-primary">
                    Ship
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Checkout Button */}
          {showCheckOut ? (
            <View className="px-8 mt-4">
              <Button
                text="Checkout"
                action={handleCheckout}
                variant={Variant.DEFAULT}
              />
            </View>
          ) : null}
        </View>
      )}
    </ScreenWrapper>
  );
};

export default PackageDetails;
