import Icon from "@/assets/icons";
import BackButton from "@/components/BackButton";
import { ABOUT_PAGES } from "@/constants/enums";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const AboutUs = ({ navigation }: any) => {
  const items = [
    {
      name: "Term & Condition",
      description: "View and update your personal details",
      icon: <Icon name="ProfileCard" />,
      isFor: ABOUT_PAGES.TERM_CONDITIONS,
    },
    {
      name: "Privacy Policy",
      description: "Get help and track your queries",
      icon: <Icon name="Support" />,
      isFor: ABOUT_PAGES.PRIVACY_POLICY,
    },
    {
      name: "About Company",
      description: "App information and terms",
      icon: <Icon name="Info" size={26} />,
      isFor: ABOUT_PAGES.ABOUT_COMPANY,
    },
  ];
  return (
    <View className="flex-1 bg-BgWhite">
      <View className="pt-14  px-10 pb-12 flex flex-col  rounded-b-[40px]  bg-primary">
        <BackButton color="#FFFF" navigation={navigation} />
        <View className="mt-8">
          <Text className="text-white text-[20px] text-center font-inter-bold">
            About
          </Text>
          <Text className="text-white/50 mt-1 text-center text-cno font-inter">
            Welcome back to Euro Shipper!
          </Text>
        </View>
      </View>

      <View className="px-8 mt-12 flex-1 flex-col gap-8">
        {items?.map((item) => (
          <View className="flex flex-col gap-4">
            <TouchableOpacity
              style={{
                shadowColor: "#BDBDBD",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1115,
                shadowRadius: 8,
                elevation: 5,
              }}
              onPress={() => {
                navigation.push("AboutUsDetails", { isFor: item?.isFor });
              }}
              className="px-6 py-5 flex flex-row items-center justify-between bg-white border-[1.5px] rounded-xl border-[#E9EDF8]"
            >
              <View className="flex flex-row gap-4">
                <View className="h-12 w-12 bg-[#D6E0EE] flex justify-center items-center rounded-full">
                  {item?.icon}
                </View>
                <View>
                  <Text className="text-cno font-inter-bold text-primary">
                    {item?.name}
                  </Text>
                  <Text className="text-[11px] font-inter text-primary">
                    {item?.description}
                  </Text>
                </View>
              </View>
              <Icon name="Arrow" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

export default AboutUs;
