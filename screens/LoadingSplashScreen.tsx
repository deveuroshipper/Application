import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef } from "react";
import { Animated, Image, Text, View } from "react-native";
const LoadingSplashScreen = ({ navigation }: any) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ).start();

    setTimeout(async () => {
      const introComplete = await AsyncStorage.getItem("intro_complete");
      navigation.push(
        introComplete === "true" ? "WelcomeScreen" : "LetsBeginScreen",
      );

      // navigation.reset({
      //   index: 0,
      //   routes: [
      //     {
      //       name: "MainScreens",
      //       params: {
      //         screen: "DetailsAndPayment",
      //       },
      //     },
      //   ],
      // });
      // navigation.push("MainScreens");
    }, 1000);
  }, []);

  return (
    <View className="relative flex-1  w-full">
      <Image
        source={require("../assets/images/SplashBg.png")}
        resizeMode="cover"
        className="absolute z-10 top-0 left-0 h-full w-full"
      />
      <View className="flex gap-8 flex-col justify-between py-10 absolute z-20 top-0 left-0 right-0 bottom-0 px-10 bg-[#131B2D]/80">
        <View className="h-fit  flex flex-col gap-6 items-center ">
          <View className="mt-28">
            <Image
              source={require("../assets/logos/Logo.png")}
              resizeMode="cover"
              className="h-fit w-32"
            />
          </View>
          <View className="flex gap-1 flex-col items-center w-full">
            <View className="flex  flex-row justify-center gap-4 w-full">
              <Text className="text-cxxl w-fit text-white font-space-grotesk-bold">
                EURO
              </Text>
              <Text className="text-gold w-fit text-cxxl font-space-grotesk-bold">
                SHIPPER
              </Text>
            </View>
            <View className="h-1 w-40 bg-gold rounded-full" />
            <Text className="text-csm mt-4 w-full text-center text-white/60 font-inter-medium tracking-[3px] uppercase">
              The Precision Navigator
            </Text>
          </View>
        </View>

        <View className="w-full  flex flex-col gap-16 items-center">
          <View className="flex w-full  h-fit flex-col gap-4 justify-center items-center">
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: rotation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              }}
            >
              <View className="relative h-16 overflow-hidden w-16 rounded-[16px]">
                <View className="absolute overflow-hidden top-0 left-0 border-gold/40 rounded-[16px] border-[3px] h-full w-full " />
                <View className="absolute top-0 left-0  h-[3px] w-full bg-gold" />
              </View>
            </Animated.View>
            <Text className="text-cxs mt-2 w-full text-center text-gold font-inter tracking-[3px] uppercase">
              Initializing Network...
            </Text>
          </View>

          <View className="flex flex-row items-center w-full">
            <View className="h-0.5 flex-auto bg-gold/50 " />

            <Text className="z-40 flex-auto pb-2 text-cxs mt-2 w-fit text-center text-white/50 font-inter-medium tracking-[2.5px] uppercase">
              European Logistics Authority
            </Text>
            <View className="h-0.5 flex-auto bg-gold/40" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoadingSplashScreen;
