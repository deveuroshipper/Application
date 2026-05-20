import Icon from "@/assets/icons";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import OTPInput from "@/components/OTPInput";
import ResendOTP from "@/components/ResendOTP";
import ScreenWrapper from "@/components/ScreenWrapper";
import React, { useState } from "react";
import { Text, View } from "react-native";

const EmailVerification = ({ navigation, route }: any) => {
  const { screenFor } = route?.params ?? {};
  const [otp, setOtp] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const handelSubmit = () => {
    if (screenFor == "FORGOT_PASSWORD") {
      navigation.push("NewPassword");
    } else {
      navigation.push("NewPassword");
    }
  };

  console.log("SCreen for ==> ", screenFor);

  const handleResend = async () => {
    setResendLoading(true);
    try {
      // TODO: call your resend API here
      await new Promise((resolve) => setTimeout(resolve, 2000));
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
            <Text className="text-csm mt-2 mb-6 text-primary/60 font-inter">
              We've sent a 4-digit verification code to your email
              a••••••@gmail.com
            </Text>
          </View>

          <View className="mt-10 gap-10">
            <OTPInput length={4} value={otp} onChange={setOtp} />

            <Button
              text="Verify"
              icon={<Icon name="NextArrow" color="#FFFF" size={18} />}
              action={handelSubmit}
            />

            <ResendOTP
              text="Didn't receive the code?"
              resendText="Resend OTP"
              timer={59}
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
