import React from "react";
import { Animated, View } from "react-native";
import {
  KeyboardAwareScrollView,
  useKeyboardAnimation,
} from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const KeyboardAnimatedContent = ({ children, containerStyle, bg }: any) => {
  const { height } = useKeyboardAnimation();
  const animatedStyle = {
    transform: [
      {
        translateY: Animated.multiply(height, 0.12),
      },
    ],
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: bg || "#F8FAFC" }}
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="never"
      automaticallyAdjustContentInsets={false}
      automaticallyAdjustKeyboardInsets={false}
      bottomOffset={20}
      mode="layout"
    >
      <Animated.View style={[containerStyle, animatedStyle]}>
        {children}
      </Animated.View>
    </KeyboardAwareScrollView>
  );
};

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
    <KeyboardAnimatedContent containerStyle={containerStyle} bg={bg}>
      {children}
    </KeyboardAnimatedContent>
  );
};

export default ScreenWrapper;
