import Icon from "@/assets/icons";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import React, { useEffect } from "react";
import { Image, Pressable, Text, View } from "react-native";

const Header = ({ CartClick, NotificationClick }: any) => {
  const user = useAuthStore((state) => state.user);
  const cartCount = useCartStore((state) => state.cartCount);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const hasUnreadNotification = useNotificationStore(
    (state) => state.hasUnreadNotification,
  );
  const fetchNotificationStatus = useNotificationStore(
    (state) => state.fetchStatus,
  );

  const displayName = user?.fullName?.split(" ")[0]?.split("-")[0] ?? "Guest";
  const profileImageUri = user?.profileImage ? String(user.profileImage) : null;

  useEffect(() => {
    fetchCart().catch(() => {});
    fetchNotificationStatus().catch(() => {});
  }, [fetchCart, fetchNotificationStatus]);

  return (
    <View className="bg-white flex flex-row justify-between items-center px-8 pb-4 pt-2">
      <View className="flex flex-1  flex-row gap-4">
        {/* <View className="h-12 w-12 flex justify-center items-center overflow-hidden bg-slate-200 rounded-md">
          {profileImageUri ? (
            <Image
              className={`h-12 w-12 bg-cover`}
              source={{ uri: profileImageUri }}
            />
          ) : (
            <Text className="text-csl font-inter-bold">{displayName.charAt(0)}</Text>
          )}
        </View> */}
        <View>
          <Text className="text-cxs font-inter-semibold uppercase text-[#1A1C1E]/50">
            Welcome to EuroShipper
          </Text>
          <Text className="text-csl font-inter-bold text-[#1A1C1E] capitalize">
            Hi, {displayName}
          </Text>
        </View>
      </View>

      <View className="flex flex-row gap-2.5">
        <Pressable
          onPress={CartClick}
          className="relative h-9 w-9 flex justify-center items-center"
        >
          {cartCount > 0 && (
            <View className="absolute -top-1 z-10 -right-1 h-5 w-5  aspect-square flex justify-center items-center rounded-full bg-gold">
              <Text className="text-cxs text-white font-inter-bold z-20">
                {cartCount}
              </Text>
            </View>
          )}
          <Icon name="Cart" size={26} />
        </Pressable>
        <Pressable
          onPress={NotificationClick}
          className="relative h-9 w-9 flex justify-center items-center"
        >
          {hasUnreadNotification && (
            <View className="absolute top-0.5 z-10 right-1 h-4 w-4 border-2 border-white aspect-square flex justify-center items-center rounded-full bg-red-500" />
          )}
          <Icon name="Bell" size={25} />
        </Pressable>
      </View>
    </View>
  );
};

export default Header;
