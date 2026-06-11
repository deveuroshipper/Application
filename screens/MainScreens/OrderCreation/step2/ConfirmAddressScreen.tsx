import Icon from "@/assets/icons";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import { SHIPMENT_TYPE } from "@/constants/enums";
import { getWarehouseApiHandler } from "@/helper/Api";
import { CountryImage } from "@/helper/buildFlagUrl";
import { useAddressStore } from "@/store/useAddress";
import { useEffect, useState } from "react";
import { Image, Pressable, Share, Text, View } from "react-native";
import Toast from "react-native-toast-message";

const TOTAL_STEP = 4;

const ConfirmAddressScreen = ({ navigation, route }: any) => {
  const [step, setStep] = useState(2);
  const dropAddress = useAddressStore.getState()?.deliverAddress ?? null;
  const pickupAddress = useAddressStore.getState()?.pickupAddress ?? null;
  const shipWay = useAddressStore.getState()?.shipmentType ?? null;
  const [warehouseAddress, setWarehouseAddress] = useState(null);

  const handelSubmit = () => {
    navigation.push("Specification");
  };
  const handelUpdate = async (id: string) => {
    navigation.goBack();
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
    return `${data?.name}, ${data?.address}`;
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
      <View className="flex-1 px-8 pb-8">
        <View className="flex flex-row items-center justify-between">
          <BackButton navigation={navigation} />
          <View className="px-4 py-1  bg-[#BFCDDE] rounded-full">
            <Text className="text-cno  text-primary font-inter-medium">
              {step}/{TOTAL_STEP}
            </Text>
          </View>
        </View>

        <View className="mt-10 flex flex-col justify-between content-between flex-1">
          <View className="flex flex-col gap-8">
            {shipWay === SHIPMENT_TYPE.DOORSTEP_PICKUP ? (
              <View
                style={{
                  shadowColor: "#e3e6e9",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.02,
                  shadowRadius: 32,
                  elevation: 10,
                }}
                className=" flex flex-col gap-2"
              >
                <Text className="text-csm text-[#334155] font-inter-semibold uppercase">
                  Pickup Address
                </Text>
                <View className="px-4 py-6 pb-4 flex flex-col gap-4 rounded-3xl bg-white">
                  <View className="flex flex-row justify-between items-center">
                    <View className="flex  flex-1  flex-row gap-2 items-center">
                      <View className="h-12 w-12 pr-0.5 flex justify-center items-center bg-[#CBD5E1] rounded-full">
                        <Icon name="User" size={24} />
                      </View>
                      <View>
                        <Text className="text-csm font-inter-bold">
                          {pickupAddress?.fullName}
                        </Text>
                        <Text className="w-2/3 text-[11px] font-inter-bold text-primary/80">
                          {pickupAddress?.number}
                        </Text>
                      </View>
                    </View>

                    <View className="flex flex-row gap-2">
                      <Pressable
                        onPress={() => handelUpdate(pickupAddress?.id)}
                        className="h-9 w-9 flex justify-center items-center border-[#D3D8E7]   border-[1.5px] rounded-lg"
                      >
                        <Icon name="Pencil" size={20} color="#334155" />
                      </Pressable>
                      {/* <Pressable
                      onPress={() => handelDelete(dropAddress?.id)}
                      disabled={deletingId === dropAddress?.id}
                      className="h-9 w-9 flex justify-center items-center border-[#D3D8E7] border-[1.5px] rounded-lg"
                    >
                      {deletingId === dropAddress?.id ? (
                        <ActivityIndicator size={16} color="#334155" />
                      ) : (
                        <Icon name="Trash" size={20} color="#334155" />
                      )}
                    </Pressable> */}
                    </View>
                  </View>

                  <View className="flex flex-row justify-between items-end">
                    <View>
                      <Text className="w-2/3 text-csm font-inter text-[#334155] capitalize">
                        {pickupAddress?.addressLine.slice(0, 100)}
                      </Text>
                      <Text className="w-2/3 text-csm font-inter-medium text-primary/80 capitalize">
                        {pickupAddress?.state} - {pickupAddress?.city}
                      </Text>
                    </View>
                    <Image
                      className="w-11 h-8 rounded-md"
                      source={{ uri: CountryImage(pickupAddress?.country) }}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <View
                style={{
                  shadowColor: "#e3e6e9",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.02,
                  shadowRadius: 32,
                  elevation: 10,
                }}
                className=" flex flex-col gap-2"
              >
                <Text className="text-csm text-[#334155] font-inter-semibold uppercase">
                  DroP-off Address
                </Text>
                {warehouseAddress && (
                  <View className="px-4 py-6 pb-4 flex flex-col gap-4 rounded-3xl bg-white">
                    <View className="flex flex-row justify-between items-center">
                      <View className="flex  flex-1  flex-row gap-2 items-center">
                        <View className="h-12 w-12 pr-0.5 flex justify-center items-center bg-[#CBD5E1] rounded-full">
                          <Icon name="Warehouse" size={26} />
                        </View>
                        <View>
                          <Text className="text-csm font-inter-bold">
                            {warehouseAddress?.name}
                          </Text>
                          <Text className="w-full text-[11px] font-inter-bold text-primary/80">
                            Warehouse address
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View className="flex flex-row justify-between items-end">
                      <View className="flex-1">
                      <Text className="w-2/3 text-csm font-inter text-[#334155] capitalize">
                          {buildAddress(warehouseAddress)}
                        </Text>
                        <Text className="w-2/3 text-csm font-inter-medium text-primary/80 capitalize">
                          {warehouseAddress?.city} - {warehouseAddress?.country}
                        </Text>
                      </View>
                      <Image
                        className="w-11 h-8 rounded-md"
                        source={{
                          uri: CountryImage(warehouseAddress?.country),
                        }}
                      />
                    </View>
                  </View>
                )}
              </View>
            )}

            <View
              style={{
                shadowColor: "#e3e6e9",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.02,
                shadowRadius: 32,
                elevation: 10,
              }}
              className=" flex flex-col gap-2"
            >
              <Text className="text-csm text-[#334155] font-inter-semibold uppercase">
                DELIVERY ADDRESS
              </Text>
              {/* <View className="px-4 py-6 flex flex-col gap-4 rounded-3xl bg-white">
                <View className="flex flex-row justify-between items-center">
                  <View className="flex  flex-row gap-2 items-center">
                    <View className="h-9 w-9 pr-0.5 flex justify-center items-center bg-[#CBD5E1] rounded-full">
                      <Icon name="User" size={22} />
                    </View>
                    <Text className="text-csm font-inter-bold">John James</Text>
                  </View>

                  <View className="flex flex-row gap-2">
                    <View className="h-9 w-9 flex justify-center items-center border-[#D3D8E7]   border-[1.5px] rounded-lg">
                      <Icon name="Pencil" size={20} color="#334155" />
                    </View>
                    <View className="h-9 w-9 flex justify-center items-center border-[#D3D8E7]   border-[1.5px] rounded-lg">
                      <Icon name="Trash" size={20} color="#334155" />
                    </View>
                  </View>
                </View>

                <View className="flex flex-row justify-between items-end">
                  <Text className="w-2/3 text-csm font-inter text-primary/80">
                    45 King Street, Manchester M2 4WU, United Kingdom
                  </Text>
                  <Image
                    className="w-11 h-8 rounded-md"
                    source={{ uri: "https://flagcdn.com/w80/gb.png" }}
                  />
                </View>
              </View> */}
              <View className="px-4 py-6 pb-4 flex flex-col gap-4 rounded-3xl bg-white">
                <View className="flex flex-row justify-between items-center">
                  <View className="flex  flex-1 flex-row gap-2 items-center">
                    <View className="h-12 w-12 pr-0.5  flex justify-center items-center bg-[#CBD5E1] rounded-full">
                      <Icon name="User" size={24} />
                    </View>
                    <View className="flex-1">
                      <Text className="text-csm font-inter-bold">
                        {dropAddress?.fullName}
                      </Text>
                      <Text className="w-2/3 text-[11px] font-inter-bold text-primary/80">
                        {dropAddress?.number}
                      </Text>
                    </View>
                  </View>

                  <View className="flex flex-row gap-2 ">
                    <Pressable
                      onPress={() => handelUpdate(dropAddress?.id)}
                      className="h-9 w-9 flex justify-center items-center border-[#D3D8E7]   border-[1.5px] rounded-lg"
                    >
                      <Icon name="Pencil" size={20} color="#334155" />
                    </Pressable>
                    {/* <Pressable
                      onPress={() => handelDelete(dropAddress?.id)}
                      disabled={deletingId === dropAddress?.id}
                      className="h-9 w-9 flex justify-center items-center border-[#D3D8E7] border-[1.5px] rounded-lg"
                    >
                      {deletingId === dropAddress?.id ? (
                        <ActivityIndicator size={16} color="#334155" />
                      ) : (
                        <Icon name="Trash" size={20} color="#334155" />
                      )}
                    </Pressable> */}
                  </View>
                </View>

                <View className="flex flex-row justify-between items-end ">
                  <View className="flex-1">
                      <Text className="w-2/3 text-csm font-inter text-[#334155] capitalize">
                      {dropAddress?.addressLine.slice(0, 100)}
                    </Text>
                    <Text className="w-2/3 text-csm font-inter-medium text-primary/80 capitalize">
                      {dropAddress?.state} - {dropAddress?.city}
                    </Text>
                  </View>
                  <Image
                    className="w-11 h-8 rounded-md"
                    source={{ uri: CountryImage(dropAddress?.country) }}
                  />
                </View>
              </View>
            </View>
          </View>
          <View className="mt-10">
            <Button text="Continue " action={handelSubmit} />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ConfirmAddressScreen;
