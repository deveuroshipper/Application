import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ScreenWrapper = ({ children, bg }: any) => {
  const top: any = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 40;
  return (
    <View style={{ flex: 1, paddingTop, backgroundColor: bg || "#F8FAFC" }}>
      {children}
    </View>
  );
};

export default ScreenWrapper;
