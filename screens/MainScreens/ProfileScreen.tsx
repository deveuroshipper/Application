import Icon from "@/assets/icons";
import Button, { Size, Variant } from "@/components/Button";
import { useAuthStore } from "@/store/useAuthStore";
import React, { useState } from "react";
import { Image, Modal, Platform, Text, TouchableOpacity, View } from "react-native";

const ProfileScreen = ({ navigation }: any) => {
  const user = useAuthStore((state) => state.user);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    if (logoutLoading) return;

    setLogoutLoading(true);
    await useAuthStore.getState().logout();
    setLogoutLoading(false);
    setShowLogoutModal(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "WelcomeScreen" }],
    });
  };

  const profileImageUri = user?.profileImage ? String(user.profileImage) : null;

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
      <Modal
        transparent
        animationType="fade"
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View className="flex-1 justify-center bg-black/40 px-8">
          <View
            className="rounded-3xl bg-white p-6"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.12,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View className="items-center gap-4">
              <View className="h-16 w-16 items-center justify-center rounded-full bg-[#C9243F]/15">
                <Icon name="Logout" color="#C9243F" size={30} />
              </View>

              <View className="gap-2">
                <Text className="text-center text-cmd font-space-grotesk-bold text-primary">
                  Logout
                </Text>
                <Text className="text-center text-csm font-inter text-primary/50">
                  Are you sure you want to sign out from your account?
                </Text>
              </View>
            </View>

            <View className="mt-6 gap-3">
              <Button
                text="Yes, Logout"
                action={handleLogout}
                color="#C9243F"
                loading={logoutLoading}
                disabled={logoutLoading}
                size={Size.SMALL}
              />
              <Button
                text="Cancel"
                action={() => setShowLogoutModal(false)}
                variant={Variant.OUTLINE}
                size={Size.SMALL}
              />
            </View>
          </View>
        </View>
      </Modal>

      <View    style={{ paddingTop: Platform.OS == "ios" ? 64 : 54 }} className="px-10 pb-12 flex flex-row justify-between gap-1.5 rounded-b-[40px] items-center bg-primary">
        <View className="flex-1">
          <Text className="text-white text-[20px] font-inter-bold">
            Hi, {user?.fullName ?? "Gest"}
          </Text>
          <Text className="text-white/50 mt-1 text-cno font-inter">
            Welcome back Euro Shipper!
          </Text>
        </View>
        {/* <View className="w-14 h-14 flex justify-center items-center bg-slate-200 rounded-full overflow-hidden">
          {profileImageUri ? (
            <Image
              className={`w-14 h-14 bg-cover`}
              source={{ uri: profileImageUri }}
            />
          ) : (
            <Text className="text-csl font-inter-bold">
              {user?.fullName?.charAt(0)}
            </Text>
          )}
        </View> */}
      </View>
      <View className="px-8 mb-6 flex flex-col justify-between flex-1">
        <View className=" mt-10 flex-1 flex-col gap-8">
          {items?.map((item) => (
            <View key={item?.label} className="flex flex-col gap-4">
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
                  <View className="flex justify-center gap-0.5">
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
            onPress={() => setShowLogoutModal(true)}
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
