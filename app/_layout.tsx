import toastConfig from "@/components/CustomeTost";
import { useAuthStore } from "@/store/useAuthStore";
import { Slot } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    useAuthStore.getState().loadFromStorage();
  }, []);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
      <Toast position="bottom" config={toastConfig} />
    </GestureHandlerRootView>
  );
}
