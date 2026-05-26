import Icon from "@/assets/icons";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useState } from "react";
import { Image, Text, View } from "react-native";

const TOTAL_STEP = 4;

const ConfirmAddressScreen = ({ navigation, route }: any) => {
  const [step, setStep] = useState(2);

  const handelSubmit = () => {
    navigation.push("Specification");
  };
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
              <Text className="text-csm font-inter-bold uppercase">
                DroP-off Address
              </Text>
              <View className="px-4 py-6 flex flex-col gap-4 rounded-3xl bg-white">
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
              </View>
            </View>

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
              <Text className="text-csm font-inter-bold uppercase">
                DroP-off Address
              </Text>
              <View className="px-4 py-6 flex flex-col gap-4 rounded-3xl bg-white">
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
