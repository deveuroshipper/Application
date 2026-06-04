import BackButton from "@/components/BackButton";
import { AboutContent } from "@/constants/about";
import { ABOUT_PAGES } from "@/constants/enums";
import React from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const AboutUsDetails = ({ navigation, route }: any) => {
  const isFor = route?.params?.isFor ?? ABOUT_PAGES.PRIVACY_POLICY;

  const getHeaderData = () => {
    if (isFor == ABOUT_PAGES.ABOUT_COMPANY) {
      return "About Euro Shipper";
    }
    if (isFor == ABOUT_PAGES.TERM_CONDITIONS) {
      return "Term and Condition";
    }
    if (isFor == ABOUT_PAGES.PRIVACY_POLICY) {
      return "Privacy Policy";
    }
  };
  const getData = () => {
    return AboutContent[isFor];
  };
  return (
    <View className="flex-1 bg-BgWhite">
      <View className="pt-12  px-10 pb-12 flex flex-col  rounded-b-[40px]  bg-primary">
        <BackButton color="#FFFF" navigation={navigation} />
        <View className="mt-8">
          <Text className="text-white text-[20px] text-center font-inter-bold">
            {getHeaderData()}
          </Text>
          <Text className="text-white/50 mt-1 text-center text-cno font-inter">
            Welcome back to Euro Shipper!
          </Text>
        </View>
      </View>

      <ScrollView>
        <View className="px-8 mt-12 mb-10 flex-1 flex-col gap-8">
          {getData().map((item, index) => {
            return (
              <View className="flex flex-col gap-2">
                <Text className="text-csl text-primary font-inter-bold">
                  {`${index + 1}. ${item?.title}`}
                </Text>
                <Text className="text-cno text-primary font-inter">
                  {item?.description}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutUsDetails;
