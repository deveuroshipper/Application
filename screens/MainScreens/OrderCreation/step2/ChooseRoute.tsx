import arrow from "@/assets/images/arrow.png";
import earthMap from "@/assets/images/earthmap.png";

import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import { getRoutesApiHandler } from "@/helper/Api";
import { CountryImage } from "@/helper/buildFlagUrl";
import { useAddressStore } from "@/store/useAddress";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";

const TOTAL_STEP = 4;

const ChooseRoute = ({ navigation }: any) => {
  const step = 1;
  const [selected, setSelected] = useState(useAddressStore.getState().route);
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const pingProgress = useSharedValue(0);

  useEffect(() => {
    pingProgress.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
  }, []);

  const pingAnimStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      pingProgress.value,
      [0, 1],
      ["#f1f5f9", "#e2e8f0"], // slate-500 → slate-300
    ),
  }));

  const handelSubmit = () => {
    navigation.push("ChooseHowShip");
  };

  const getRoutes = async () => {
    setLoading(true);
    try {
      const response = await getRoutesApiHandler();
      setRoutes(Array.isArray(response) ? response : []);
    } catch (error) {
      setRoutes([]);
      Toast.show({
        type: "error",
        text1:
          typeof error === "string"
            ? error
            : (error?.message ?? "Something went wrong"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handelChooseRoute = (routeId: String) => {
    useAddressStore.getState().setRoute(routeId);
    setSelected(routeId);
  };

  useEffect(() => {
    getRoutes();
  }, []);
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
                  Choose You
                </Text>
                <Text className="text-primary font-space-grotesk-bold text-cml leading-[38px]">
                  Shipping Route
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

          <View className="flex flex-col gap-2">
            <Text className="uppercase text-csm font-inter-bold tracking-wide text-primary/60">
              Choose Your Shipping Path
            </Text>
            {/* <Skeleton
              isLoading={true}
              containerStyle={{ flex: 1, width: 300 }}
            
              layout={[
                { key: "someId", width: 220, height: 20, marginBottom: 6 },
                { key: "someOtherId", width: 180, height: 20, marginBottom: 6 },
              ]}
            >
              <Text className="uppercase text-csm font-inter-bold tracking-wide text-primary/60">
                Choose Your Shipping Path
              </Text>
              <Text className="uppercase text-csm font-inter-bold tracking-wide text-primary/60">
                Choose Your Shipping Path
              </Text>
            </Skeleton> */}
            <ScrollView
              className="h-[63%]"
              showsVerticalScrollIndicator={false}
            >
              {loading ? (
                <View className="min-h-60 flex justify-end items-center ">
                  <ActivityIndicator size={"large"} color={"#0F1729"} />
                </View>
              ) : routes.length > 0 ? (
                routes?.map((route: any, index: Number) => (
                  <View
                    key={route.id + "-" + index}
                    className="mt-2 flex flex-col gap-4"
                  >
                    <Pressable
                      onPress={() => handelChooseRoute(route.id)}
                      className="w-full h-fit flex flex-row justify-between items-center gap-2 px-3 py-3 pt-4 border-[#B5C3E8]/30 border-[2px] bg-white rounded-lg"
                    >
                      <View className="flex   w-1/3 flex-col items-center gap-2">
                        <Image
                          source={{ uri: CountryImage(route?.originName) }}
                          className="w-11 h-8 rounded-md"
                        />
                        <Text className="text-[12px] text-primary/90 font-inter-semibold">
                          {route?.originName}
                        </Text>
                      </View>
                      <View className="flex justify-center items-center">
                        <Image
                          source={arrow}
                          className="w-fit h-2 rounded-md"
                        />
                      </View>
                      <View className="flex  w-1/3 flex-col items-center gap-2">
                        <Image
                          source={{ uri: CountryImage(route?.destinationName) }}
                          className="w-11 h-8 rounded-md"
                        />
                        <Text className="text-[12px] text-primary/90 font-inter-semibold">
                          {route?.destinationName}
                        </Text>
                      </View>
                      <View className="h-7 w-7 flex justify-center items-center border-2 border-[#334155] rounded-full">
                        {route.id == selected ? (
                          <View className="h-4 w-4 border-2 border-[#334155] bg-[#334155] rounded-full"></View>
                        ) : null}
                      </View>
                    </Pressable>
                  </View>
                ))
              ) : (
                <View className="min-h-60 flex justify-end items-center px-4">
                  <Text className="text-cno font-inter-semibold text-primary text-center">
                    No route available
                  </Text>
                  <Text className="text-csm font-inter text-primary/50 text-center mt-2">
                    Please check again later.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>

          <View className="mt-auto">
            <Button
              text="Continue"
              disabled={!selected && true}
              action={handelSubmit}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ChooseRoute;
