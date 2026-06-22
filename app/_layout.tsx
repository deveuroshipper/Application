import toastConfig from "@/components/CustomeTost";
import { Slot } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slot />
      <Toast position="top" config={toastConfig} />
      
    </GestureHandlerRootView>
  );
}
