import BackButton from "@/components/BackButton";
import { ABOUT_PAGES } from "@/constants/enums";
import { getContentApiHandler } from "@/helper/Api";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

const AboutUsDetails = ({ navigation, route }: any) => {
  const isFor = route?.params?.isFor ?? ABOUT_PAGES.PRIVACY_POLICY;
  const [content, setContent] = useState(null);

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

  const getContent = async () => {
    try {
      let type;
      if (isFor == ABOUT_PAGES.ABOUT_COMPANY) {
        type = "aboutUs";
      } else if (isFor == ABOUT_PAGES.TERM_CONDITIONS) {
        type = "termsAndCondition";
      } else {
        type = "privacyPolicy";
      }
      const response = await getContentApiHandler(type);
      setContent(response);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: typeof error === "string" ? error : "Failed to delete address.",
      });
    }
  };

  useEffect(() => {
    getContent();
  }, [isFor]);
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
          {content ? (
            content?.map((item, index) => {
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
            })
          ) : (
            <View className="flex-1 flex min-h-[70vh]  justify-center items-center ">
              <ActivityIndicator color={"#0F1729"} size={"large"} />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutUsDetails;
