import Icon from "@/assets/icons";
import { useAuthStore } from "@/store/useAuthStore";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ProfileScreen = ({ navigation, route }: any) => {
  const handelLogout = () => {
    useAuthStore.getState().logout();
    navigation.push("LoginScreen");
  };

  const items = [
    {
      label: "ACCOUNT",
      name: "Account Information",
      description: "View and update your personal details",
      icon: <Icon name="ProfileCard" />,
      path: "AccountInformation",
    },
    {
      label: "Shipping Support",
      name: "Support",
      description: "Get help and track your queries",
      icon: <Icon name="Support" />,
      path: "SupportScreen",
    },
    {
      label: "Account Security",
      name: "About Euro Shipper",
      description: "App information and terms",
      icon: <Icon name="Info" size={26} />,
      path: "AboutUsScreen",
    },
  ];
  return (
    <View className="flex-1 bg-BgWhite">
      <View className="pt-16  px-10 pb-12 flex flex-row justify-between gap-1.5 rounded-b-[40px] items-center bg-primary">
        <View className="flex-1">
          <Text className="text-white text-[20px] font-inter-bold">
            Hi, John Doe
          </Text>
          <Text className="text-white/50 mt-1 text-cno font-inter">
            Welcome back Euro Shipper!
          </Text>
        </View>
        <View className="w-14 h-14 bg-white rounded-full"></View>
      </View>
      <View className="px-8 mb-6 flex flex-col justify-between flex-1">
        <View className=" mt-10 flex-1 flex-col gap-8">
          {items?.map((item) => (
            <View className="flex flex-col gap-4">
              <Text className=" font-semibold uppercase text-csm text-primary/60">
                {item?.label}
              </Text>
              <TouchableOpacity
                style={{
                  shadowColor: "#BDBDBD",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1115,
                  shadowRadius: 8,
                  elevation: 5,
                }}
                onPress={() => {
                  navigation.push(item?.path);
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

        <View className="flex flex-col gap-4">
          <TouchableOpacity
            onPress={() => {
              useAuthStore.getState().logout();
              navigation.push("WelcomeScreen");
            }}
            className="px-6 py-5 flex flex-row items-center justify-between bg-white border-[1.5px] rounded-xl border-[#C9243F]"
          >
            <View className="flex flex-row gap-4">
              <View className="h-12 w-12 bg-[#C9243F]/20 flex justify-center items-center rounded-full">
                <Icon name="Logout" color="#C9243F" />
              </View>
              <View>
                <Text className="text-cno font-inter-bold text-[#C9243F]">
                  Logout
                </Text>
                <Text className="text-[11px] font-inter text-primary">
                  Sign out from your account
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;
