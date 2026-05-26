import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ScreenWrapper = ({ children, bg, KeyboardAvoiding = true }: any) => {
  const top: any = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 5 : 30; // keep 30
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {KeyboardAvoiding ? (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={{ flex: 1, paddingTop, backgroundColor: bg || "#F8FAFC" }}
            >
              {children}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      ) : (
        <View style={{ flex: 1, paddingTop, backgroundColor: bg || "#F8FAFC" }}>
          {children}
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default ScreenWrapper;

/// confirm
