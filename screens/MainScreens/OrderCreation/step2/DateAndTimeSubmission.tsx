import Icon from "@/assets/icons";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import { SHIPMENT_TYPE } from "@/constants/enums";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { Image, Platform, Pressable, Text, View, Share } from "react-native";

import DoorPIck from "@/assets/images/DoorPIck.png";
import earthMap from "@/assets/images/earthmap.png";
import { getWarehouseApiHandler } from "@/helper/Api";
import { CountryImage } from "@/helper/buildFlagUrl";
import { useAddressStore } from "@/store/useAddress";
import Toast from "react-native-toast-message";

const TOTAL_STEP = 4;

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const DateAndTimeSubmission = ({ navigation, route }: any) => {
  const [step, setStep] = useState(2);
  const ShipmentType: SHIPMENT_TYPE = route?.params?.ShipmentType ?? null;
  const IsDropAt = ShipmentType == SHIPMENT_TYPE.DROP_AT_WAREHOUSE;
  const [data, setData] = useState<{ date: Date; time: Date | null }>({
    date: new Date(),
    time: null,
  });
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [warehouseAddress, setWarehouseAddress] = useState(null);

  const onDateChange = (_event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowDate(false);
    if (selectedDate) useAddressStore.getState().setDate(selectedDate);
    if (selectedDate) setData((prev) => ({ ...prev, date: selectedDate }));
  };

  const onTimeChange = (_event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") setShowTime(false);
    if (selectedTime) useAddressStore.getState().setTime(selectedTime);
    if (selectedTime) setData((prev) => ({ ...prev, time: selectedTime }));
  };

  const handelSubmit = (type: any) => {
    navigation.push("AddShipmentAddresses", {
      ShipmentType: ShipmentType,
    });
  };

  const getWarehouseAddress = async () => {
    try {
      const routedId = useAddressStore.getState().route ?? null;
   
      const data = await getWarehouseApiHandler(routedId);
      setWarehouseAddress(data);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1:
          typeof error === "string"
            ? error
            : (error?.message ?? "Something went wrong"),
      });
    }
  };

  const buildAddress = (data: any) => {
    return `${data?.name}, ${data?.address}, ${data?.city}, ${data?.country}`;
  };

  const copyAddressToClipboard = async () => {
    if (!warehouseAddress) return;
    const addressText = buildAddress(warehouseAddress);
    try {
      await Share.share({
        message: addressText,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Failed to copy address",
      });
    }
  };

  useEffect(() => {
    getWarehouseAddress();
  }, []);
  return (
    <ScreenWrapper KeyboardAvoiding={false}>
      {showDate && (
        <DateTimePicker
          value={data.date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      {showTime && (
        <DateTimePicker
          value={data.time ?? new Date()}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
      <View className="px-8 pb-8 flex-1">
        <View className="flex flex-row items-center justify-between">
          <BackButton
            navigation={navigation}
            onPress={step > 1 ? () => setStep((prev) => prev - 1) : undefined}
          />
          <View className="px-4 py-1  bg-[#BFCDDE] rounded-full">
            <Text className="text-cno  text-primary font-inter-medium">
              {step}/{TOTAL_STEP}
            </Text>
          </View>
        </View>

        <View className="mt-10 flex flex-col justify-between content-between flex-1">
          <View className="w-full">
            <View className="flex flex-row items-center justify-between gap-2">
              <View>
                <Text className="text-primary font-space-grotesk-bold text-cml leading-[40px]">
                  {IsDropAt ? "Drop Off at" : "Doorstep Pickup"}
                </Text>
                {IsDropAt ? (
                  <Text className="text-primary font-space-grotesk-bold text-cml leading-[40px]">
                    Warehouse
                  </Text>
                ) : null}
              </View>
              <Image
                className="w-28 h-28 flex items-start bg-cover"
                source={earthMap.default}
              />
            </View>
            <Text className="text-csm mt-2 mb-6 text-primary/60 font-inter">
              {IsDropAt
                ? "Set your shipment destination and explore the best available delivery routes."
                : "Choose a pickup date and time for your shipment collection. "}
            </Text>

            {IsDropAt ? (
              <View>
                <View className="flex flex-row mt-2 mb-3 justify-between">
                  <Text className="text-csm uppercase   text-primary font-inter-medium">
                    Choose Your Shipping Path
                  </Text>
                </View>

                <Pressable
                  onPress={copyAddressToClipboard}
                  className="flex gap-4 flex-row items-center px-6 py-4 bg-white border-[2.5px] border-primary/10 rounded-2xl font-inter-medium text-csm placeholder:color-primary/30"
                >
                  {warehouseAddress && (
                    <Image
                      className="w-11 h-8 rounded-md"
                      source={{ uri: CountryImage(warehouseAddress?.country) }}
                    />
                  )}
                  <Text className="w-2/3 capitalize">
                    {buildAddress(warehouseAddress)}
                  </Text>
                  <Icon name="Copy" />
                </Pressable>
              </View>
            ) : (
              <View className="w-full overflow-hidden rounded-3xl">
                <Image className="w-full bg-cover" source={DoorPIck} />
              </View>
            )}

            <View className="mt-6 flex flex-col gap-4">
              <Pressable onPress={() => setShowDate(true)}>
                <Input
                  label={"Date Submission (Expected)"}
                  placeholderTxt={"Enter Date"}
                  value={formatDate(data.date)}
                  onChange={() => {}}
                  icon={<Icon name="Calendar" color="#BFCDDE" />}
                  editable={false}
                />
              </Pressable>
              <Pressable onPress={() => setShowTime(true)}>
                <Input
                  label={"Time Submission"}
                  placeholderTxt={"Enter Time"}
                  value={data.time ? formatTime(data.time) : ""}
                  onChange={() => {}}
                  icon={<Icon name="Time" color="#BFCDDE" />}
                  editable={false}
                />
              </Pressable>
            </View>
          </View>

          <View className="mt-auto">
            <Button
              disabled={!data.time || !data.date}
              text="Continue"
              action={handelSubmit}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default DateAndTimeSubmission;
