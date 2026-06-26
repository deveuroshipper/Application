import React from "react";
import {
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ScreenWrapper = ({ children, bg, KeyboardAvoiding = false }: any) => {
  const insets = useSafeAreaInsets();
  const paddingTop = insets.top > 0 ? insets.top + 10 : 30; // keep 30
  const containerStyle = {
    flex: 1,
    paddingTop,
    backgroundColor: bg || "#F8FAFC",
  };

  if (!KeyboardAvoiding) {
    return <View style={containerStyle}>{children}</View>;
  }

  return (
    // <KeyboardAvoidingView
    //   style={{ flex: 1 }}
    //   behavior={Platform.OS === "ios" ? "padding" : "height"}
    // >
    <KeyboardProvider>
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="never"
          automaticallyAdjustContentInsets={false}
          automaticallyAdjustKeyboardInsets={false}
        >
          <View style={containerStyle}>{children}</View>
        </ScrollView>
      {/* </TouchableWithoutFeedback> */}
      {/* // </KeyboardAvoidingView> */}
    </KeyboardProvider>
  );
};

export default ScreenWrapper;

/// confirm
