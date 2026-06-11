import Icon from "@/assets/icons";
import DoorstepPickup from "@/assets/images/DoorstepPickup.png";
import DropOffAtWarehouse from "@/assets/images/DropOffatWarehouse.png";
import earthMap from "@/assets/images/earthmap.png";
import BackButton from "@/components/BackButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import { SHIPMENT_TYPE } from "@/constants/enums";
import { useAddressStore } from "@/store/useAddress";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

const TOTAL_STEP = 4;

const ChooseHowShip = ({ navigation }: any) => {
  const step = 2;

  const handelClick = (type: SHIPMENT_TYPE) => {
    useAddressStore.getState().setShipmentType(type);
    navigation.push("DateAndTimeSubmission", {
      ShipmentType: type,
    });
  };
  return (
    <ScreenWrapper KeyboardAvoiding={false}>
      <View className="px-8 pb-8 flex-1">
        <View className="flex flex-row items-center justify-between">
          <BackButton navigation={navigation} />
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
                <Text className="text-primary font-space-grotesk-bold text-cml leading-[38px]">
                  Choose How You
                </Text>
                <Text className="text-primary font-space-grotesk-bold text-cml leading-[38px]">
                  Want to Ship?
                </Text>
              </View>
              <Image
                className="w-32 h-28 flex items-start bg-cover"
                source={earthMap}
              />
            </View>
            <Text className="text-csm mt-2 mb-6 text-primary/60 font-inter">
              Set your shipment destination and explore the best available
              delivery routes.
            </Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false} // Hides vertical bar
            showsHorizontalScrollIndicator={false}
          >
            <View className="flex flex-col gap-8">
              <Pressable
                onPress={() => handelClick(SHIPMENT_TYPE.DROP_AT_WAREHOUSE)}
                style={{
                  shadowColor: "#e3e6e9",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.02,
                  shadowRadius: 32,
                  elevation: 10,
                }}
                className="bg-white rounded-3xl overflow-hidden"
              >
                <Image
                  className="w-full flex items-start bg-cover"
                  source={DropOffAtWarehouse}
                />
                <View className="px-4 pt-5 flex flex-col gap-1">
                  <Text className="text-cmd text-primary font-space-grotesk-bold">
                    Drop Off at Warehouse
                  </Text>
                  <Text className="text-[13px] text-primary/80 font-inter">
                    Bring your items to our nearest warehouse location for
                    faster processing and dispatch.
                  </Text>

                  <View className="flex flex-row justify-evenly pt-2 pb-4">
                    <View className="flex flex-col gap-2 justify-start items-center w-1/3 px-2 py-2">
                      <View className="h-11 w-11 bg-[#E4E8EF] flex justify-center items-center rounded-full">
                        <Icon name="Dollar" size={24} />
                      </View>

                      <Text className="text-primary/80 font-inter-medium text-[11px] text-center">
                        Cost Efficient
                      </Text>
                    </View>
                    <View className="h-[9vh] my-auto w-0.5 rounded-full bg-[#B9B9B9]/30" />

                    <View className="flex flex-col gap-2 justify-start items-center w-1/3 px-2 py-2">
                      <View className="h-11 w-11 bg-[#E4E8EF] flex justify-center items-center rounded-full">
                        <Icon name="Time" size={24} />
                      </View>

                      <Text className="text-primary/80 font-inter-medium text-[11px] text-center">
                        Priority Processing
                      </Text>
                    </View>
                    <View className="h-[9vh] my-auto w-0.5 rounded-full bg-[#B9B9B9]/30" />

                    <View className="flex flex-col gap-2 justify-start items-center w-1/3 px-2 py-2">
                      <View className="h-11 w-11 bg-[#E4E8EF] flex justify-center items-center rounded-full">
                        <Icon name="Shield" size={24} />
                      </View>

                      <Text className="text-primary/80 font-inter-medium text-[11px] text-center">
                        Secure Handling
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>

              <Pressable
                onPress={() => handelClick(SHIPMENT_TYPE.DOORSTEP_PICKUP)}
                style={{
                  shadowColor: "#e3e6e9",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.02,
                  shadowRadius: 32,
                  elevation: 10,
                }}
                className="bg-white rounded-3xl overflow-hidden"
              >
                <Image
                  className="w-full flex items-start bg-cover"
                  source={DoorstepPickup}
                />
                <View className="px-4 pt-5 flex flex-col gap-1">
                  <Text className="text-cmd text-primary font-space-grotesk-bold">
                    Doorstep Pickup
                  </Text>
                  <Text className="text-csm text-primary/80 font-inter">
                    Bring your items to our nearest warehouse location for
                    faster processing and dispatch.
                  </Text>

                  <View className="flex flex-row pt-2 pb-4">
                    <View className="flex flex-col gap-2 justify-start items-center w-1/3 px-2 py-2">
                      <View className="h-11 w-11 bg-[#E4E8EF] flex justify-center items-center rounded-full">
                        <Icon name="Door" size={26} />
                      </View>

                      <Text className="text-primary/80 font-inter-medium text-[11px] text-center">
                        Doorstep Convenience
                      </Text>
                    </View>
                    <View className="h-[9vh] my-auto w-0.5 rounded-full bg-[#B9B9B9]/30" />

                    <View className="flex flex-col gap-2 justify-start items-center w-1/3 px-2 py-2">
                      <View className="h-11 w-11 bg-[#E4E8EF] flex justify-center items-center rounded-full">
                        <Icon name="Calendar" color="#0F1729" size={27} />
                      </View>

                      <Text className="text-primary/80 font-inter-medium text-[11px] text-center">
                        Scheduled Pickup
                      </Text>
                    </View>
                    <View className="h-[9vh] my-auto w-0.5 rounded-full bg-[#B9B9B9]/30" />

                    <View className="flex flex-col gap-2 justify-start items-center w-1/3 px-2 py-2">
                      <View className="h-11 w-11 bg-[#E4E8EF] flex justify-center items-center rounded-full">
                        <Icon name="Shield" size={25} />
                      </View>

                      <Text className="text-primary/80 font-inter-medium text-[11px] text-center">
                        Secure Handling
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            </View>
          </ScrollView>

          {/* <View className="mt-auto">
          <Button text="Continue" action={handelSubmit} />
        </View> */}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ChooseHowShip;
