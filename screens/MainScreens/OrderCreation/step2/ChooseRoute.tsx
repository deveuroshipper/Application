import arrow from "@/assets/images/arrow.png";
import earthMap from "@/assets/images/earthmap.png";

import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

const TOTAL_STEP = 4;

const ChooseRoute = ({ navigation }: any) => {
  const [step, setStep] = useState(2);
  const [selected, setSelected] = useState(null);
  const [shippingRout, setShippingRout] = useState("");

  const routes = [
    {
      id: 1001,
      to: "Belgium",
      from: "UK",
      toImage: "https://flagcdn.com/w80/gb.png",
      FromImage: "https://flagcdn.com/w80/be.png",
    },
    {
      id: 1002,
      to: "Italy",
      from: "Austria",
      toImage: "https://flagcdn.com/w80/it.png",
      FromImage: "https://flagcdn.com/w80/at.png",
    },
    {
      id: 1003,
      to: "Sweden",
      from: "France",
      toImage: "https://flagcdn.com/w80/se.png",
      FromImage: "https://flagcdn.com/w80/fr.png",
    },
  ];
  const handelSubmit = () => {
    navigation.push("ChooseHowShip");
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
                <Text className="text-primary font-space-grotesk-bold text-cml leading-[40px]">
                  Choose You
                </Text>
                <Text className="text-primary font-space-grotesk-bold text-cml leading-[40px]">
                  Shipping Route
                </Text>
              </View>
              <Image
                className="w-28 h-28 flex items-start bg-cover"
                source={earthMap}
              />
            </View>
            <Text className="text-csm mt-2 mb-6 text-primary/60 font-inter">
              Set your shipment destination and explore the best available
              delivery routes.
            </Text>
          </View>

          <View className="flex flex-col gap-2">
            <Text className="uppercase text-csm font-inter-bold tracking-wide text-primary/60">
              Choose Your Shipping Path
            </Text>

            <View className="mt-2 flex flex-col gap-4">
              {routes?.map((route: any, index: Number) => (
                <Pressable
                  onPress={() => setSelected(route.id)}
                  className="w-full h-fit flex flex-row justify-between items-center gap-2 px-3 py-4 border-[#B5C3E8]/30 border-[2px] bg-white rounded-lg"
                  key={route?.id}
                >
                  <View className="flex   w-1/3 flex-row items-center gap-2">
                    <Image
                      source={{ uri: route?.toImage }}
                      className="w-11 h-8 rounded-md"
                    />
                    <Text className="text-[12px] text-primary/90 font-inter-bold">
                      {route?.to}
                    </Text>
                  </View>
                  <View className="flex justify-center items-center">
                    <Image
                      source={arrow}
                      className="w-fit h-2 rounded-md"
                    />
                  </View>
                  <View className="flex  w-1/3 flex-row items-center gap-2">
                    <Image
                      source={{ uri: route?.FromImage }}
                      className="w-11 h-8 rounded-md"
                    />
                    <Text className="text-[12px] text-primary/90 font-inter-bold">
                      {route?.from}
                    </Text>
                  </View>
                  <View className="h-7 w-7 flex justify-center items-center border-2 border-primary rounded-full">
                    {route.id == selected ? (
                      <View className="h-4 w-4 border-2 bg-primary rounded-full"></View>
                    ) : null}
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="mt-auto">
            <Button text="Continue" action={handelSubmit} />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ChooseRoute;
