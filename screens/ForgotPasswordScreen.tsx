import Icon from "@/assets/icons";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");

  const handelSubmit = () => {
    navigation.push("EmailVerification", { screenFor: "FORGOT_PASSWORD" });
  };

  const BackToLogin = () => {
    navigation.push("LoginScreen");
  };
  return (
    <ScreenWrapper>
      <View className="px-8 pb-8 flex-1">
        <BackButton navigation={navigation} />

        <View className="mt-16 flex flex-col justify-start content-between  flex-1">
          <View>
            <View>
              <Text className="text-primary font-space-grotesk-bold text-cxl leading-10 w-full">
                Forgot
              </Text>
              <Text className="text-primary font-space-grotesk-bold text-cxl leading-10 w-full">
                Password?
              </Text>
            </View>
            <Text className="text-csm mt-2 mb-6 text-primary/60 font-inter">
              Enter your email to receive a reset code.
            </Text>
          </View>

          <View className="mt-10 gap-10">
            <Input
              label={"Corporate Email"}
              placeholderTxt={"name@company.com"}
              value={email}
              onChange={(text: string) => setEmail(text)}
            />
            <Button
              text="Continue"
              icon={<Icon name="NextArrow" color="#FFFF" size={18} />}
              action={handelSubmit}
            />

            <View className="flex flex-row justify-center gap-2 text-white">
              <Text className="text-csm text-primary/60 font-inter-medium">
                Remember your password?
              </Text>
              <Pressable onPress={BackToLogin}>
                <Text className="text-csm text-primary font-inter-bold">
                  Back to Sign In
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ForgotPasswordScreen;
