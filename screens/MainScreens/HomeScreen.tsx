import Icon from "@/assets/icons";
import BannerSlider, { BannerSlide } from "@/components/BannerSlider";
import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const BANNER_SLIDES: BannerSlide[] = [
  {
    id: "1",
    image: require("../../assets/images/slide1.png"),
    title: "Next Day Delivery to Zurich",
  },
  {
    id: "2",
    image: require("../../assets/images/slide1.png"),
    title: "Express Shipping Across Europe",
  },
  {
    id: "3",
    image: require("../../assets/images/slide1.png"),
    title: "Safe & Tracked Freight Solutions",
  },
];

const HomeScreen = ({ navigation }: any) => {


  const handelCartClick = () => {
    navigation.push("CartScreen");
  }
  return (
    <ScreenWrapper bg={"#FFFF"} KeyboardAvoiding={false}>
      <View className="flex-1">
        <Header CartClick={handelCartClick} />
        <ScrollView
          className="flex-1 flex  gap-10 bg-BgWhite w-full"
          showsVerticalScrollIndicator={false}
        >
          <BannerSlider slides={BANNER_SLIDES} />

          <View className="px-8 mt-6 ">
            <View className="flex flex-col gap-2 bg-primary px-6 pt-6 rounded-3xl ">
              <Text className="text-white text-center text-csl font-inter-bold">
                Start a Shipment
              </Text>
              <Text className="text-csm text-center  text-white/60">
                Start your shipment in minutes — add the details and we’ll
                handle the delivery.
              </Text>

              <TouchableOpacity
                onPress={() => navigation.push("ChooseRoute")}
                className="h-14 w-full mt-2 bg-gold flex flex-row gap-4 justify-center items-center rounded-full"
              >
                <Icon name="Box" color="#FFFF" />
                <Text className="text-cmd text-white font-inter-bold pb-1">
                  Create an Order
                </Text>
              </TouchableOpacity>
              <Image
                className="w-full"
                source={require("../../assets/images/boxes.png")}
              />
            </View>
          </View>

          <View className="px-8 mt-6 mb-10 flex flex-col gap-4">
            <Text className="text-cno font-inter-medium text-primary/60">
              Order Service
            </Text>
            <View className="flex flex-row gap-4">
              <TouchableOpacity
                onPress={() => navigation.push("WeProcureScreen")}
                className="w-1/2 h-fit p-2.5 rounded-2xl bg-[#E4E8EF]"
              >
                <Image
                  className="w-full h-fit rounded-xl"
                  source={require("../../assets/images/WeProcure.png")}
                />

                <Text className="py-2 text-csl text-primary font-space-grotesk-bold text-center">
                  WeProcure
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.push("WeQAScreen")}
                className="w-1/2 h-fit p-2.5 rounded-2xl bg-[#E4E8EF]"
              >
                <Image
                  className="w-full h-fit rounded-xl"
                  source={require("../../assets/images/weqa.png")}
                />

                <Text className="py-2 text-csl text-primary font-space-grotesk-bold text-center">
                  WeQA
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default HomeScreen;
