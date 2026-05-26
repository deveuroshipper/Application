import toastConfig from "@/components/CustomeTost";
import { useAuthStore } from "@/store/useAuthStore";
import { Slot } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  useEffect(() => {
    useAuthStore.getState().loadFromStorage();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
      <Toast position="bottom" config={toastConfig} />
    </GestureHandlerRootView>
  );
}
