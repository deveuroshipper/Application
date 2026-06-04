import Icon from "@/assets/icons";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import { resetPasswordOtpVerifyApiHandler } from "@/helper/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";

const NewPassword = ({ navigation }: any) => {
  const [data, SetData] = useState({
    password: "",
    conformPassword: "",
  });
  const [errors, setErrors] = useState({ password: "", conformPassword: "" });
  const [showPass, setShowPass] = useState(false);
  const [showConPass, setShowConPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = { password: "", conformPassword: "" };
    if (!data.password) newErrors.password = "Password is required.";
    else if (data.password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";
    if (!data.conformPassword)
      newErrors.conformPassword = "Please confirm your password.";
    else if (data.password !== data.conformPassword)
      newErrors.conformPassword = "Passwords do not match.";
    setErrors(newErrors);
    return !newErrors.password && !newErrors.conformPassword;
  };

  const handelSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const resetToken = await AsyncStorage.getItem("resetPasswordToken");
      if (!resetToken) {
        Toast.show({ type: "error", text1: "Session expired. Please try again." });
        navigation.push("ForgotPasswordScreen");
        return;
      }
      await resetPasswordOtpVerifyApiHandler(resetToken, data.password, data.conformPassword as any);
      await AsyncStorage.removeItem("resetPasswordToken");
      Toast.show({ type: "success", text1: "Password reset successfully." });
      navigation.push("LoginScreen");
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: typeof err === "string" ? err : (err?.message ?? "Something went wrong"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View className="px-8 pb-8 flex-1">
        <BackButton navigation={navigation} />

        <View className="mt-16 flex flex-col justify-start content-between  flex-1">
          <View>
            <View>
              <Text className="text-primary font-space-grotesk-bold text-cxl leading-10 w-full">
                Create
              </Text>
              <Text className="text-primary font-space-grotesk-bold text-cxl leading-10 w-full">
                New Password
              </Text>
            </View>
            <Text className="text-csm mt-2 mb-6 text-primary/60 font-inter">
              Your new password must be different from previously used
              passwords.
            </Text>
          </View>

          <View className="mt-10 gap-2">
            <Input
              label={"New Password"}
              placeholderTxt={"●●●●●●"}
              value={data?.password}
              secureTextEntry={!showPass}
              onChange={(text: string) => {
                SetData({ ...data, password: text });
                if (errors.password) setErrors((e) => ({ ...e, password: "" }));
              }}
              icon={showPass ? <Icon name="CloseEye" /> : <Icon name="Eye" />}
              iconAction={() => setShowPass(!showPass)}
              error={errors.password}
            />
            <Input
              label={"Confirm Password"}
              placeholderTxt={"●●●●●●"}
              value={data?.conformPassword}
              secureTextEntry={!showConPass}
              onChange={(text: string) => {
                SetData({ ...data, conformPassword: text });
                if (errors.conformPassword) setErrors((e) => ({ ...e, conformPassword: "" }));
              }}
              icon={
                showConPass ? <Icon name="CloseEye" /> : <Icon name="Eye" />
              }
              iconAction={() => setShowConPass(!showConPass)}
              error={errors.conformPassword}
            />

            <View className="mt-8">
              <Button
                text="Reset Password"
                icon={<Icon name="NextArrow" color="#FFFF" size={18} />}
                action={handelSubmit}
                loading={loading}
              />
            </View>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default NewPassword;
