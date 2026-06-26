import Icon from "@/assets/icons";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import OTPInput from "@/components/OTPInput";
import ResendOTP from "@/components/ResendOTP";
import ScreenWrapper from "@/components/ScreenWrapper";
import {
  forgotPasswordApiHandler,
  forgotPasswordOtpVerifyApiHandler,
  resentOtpApiHandler,
  verificationApiHandler,
} from "@/helper/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";

const EmailVerification = ({ navigation, route }: any) => {
  const { screenFor, email } = route?.params ?? {};
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handelSubmit = async () => {
    if (otp.length < 4) {
      Toast.show({ type: "error", text1: "Please enter the 4-digit code." });
      return;
    }
    setLoading(true);
    try {
      if (screenFor === "FORGOT_PASSWORD") {
        const response = await forgotPasswordOtpVerifyApiHandler(email, otp);
        if (response?.resetToken) {
          AsyncStorage.setItem("resetPasswordToken", response.resetToken);
        }
        navigation.push("NewPassword");
      } else {
        await verificationApiHandler(email, otp);
        navigation.reset({
          index: 1,
          routes: [{ name: "WelcomeScreen" }, { name: "LoginScreen" }],
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1:
          typeof error === "string"
            ? error
            : (error?.message ?? "Something went wrong"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      if (screenFor === "FORGOT_PASSWORD") {
        await forgotPasswordApiHandler(email);
      } else {
        await resentOtpApiHandler(email);
      }
      Toast.show({ type: "success", text1: "OTP resent to your email." });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1:
          typeof error === "string"
            ? error
            : (error?.message ?? "Failed to resend OTP"),
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View className="px-8 pb-8 flex-1">
        <BackButton navigation={navigation} />

        <View className="mt-16 flex flex-col justify-start content-between  flex-1">
          <View>
            <View>
              <Text className="text-primary font-space-grotesk-bold text-cxl w-full">
                Email Verification
              </Text>
            </View>
            <Text className="text-csm mt-2 mb-6 text-[#242646]/70 font-inter">
              We've sent a 4-digit verification code to your email
              {email ? (
                <Text className="text-csm mt-2 mb-6 text-black  font-inter-bold">
                  {` ${email?.slice(0)[0]}.....@${email?.split("@")[1]}`}
                </Text>
              ) : (
                ""
              )}
            </Text>
          </View>

          <View className="mt-10 gap-10">
            <OTPInput length={4} value={otp} onChange={setOtp} />

            <Button
              text="Verify"
              icon={<Icon name="NextArrow" color="#FFFF" size={18} />}
              loading={loading}
              action={handelSubmit}
            />

            <ResendOTP
              text="Didn't receive the code?"
              resendText="Resend OTP"
              timer={10}
              action={handleResend}
              loading={resendLoading}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default EmailVerification;
