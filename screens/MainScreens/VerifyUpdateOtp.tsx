import Icon from "@/assets/icons";
import {
  default as infoSuccess,
  default as phoneSuccess,
} from "@/assets/images/info-success.png";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import OTPInput from "@/components/OTPInput";
import ResendOTP from "@/components/ResendOTP";
import SuccessModel from "@/components/SuccessModel";
import { INFO_UPDATE } from "@/constants/enums";
import {
  getProfileApiHandler,
  updateInfoApiHandler,
  verifyUpdateInfoApiHandler,
} from "@/helper/Api";
import { useAuthStore } from "@/store/useAuthStore";
import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import Toast from "react-native-toast-message";

const VerifyUpdateOtp = ({ navigation, route }: any) => {
  const [user, setUser] = useState(null);
  const data = route?.params?.data ?? {};
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const getErrorMessage = (error: any, fallback = "Something went wrong") =>
    typeof error === "string" ? error : (error?.message ?? fallback);
  console.log("update data : ", data);
  const getProfile = async () => {
    try {
      const response = await getProfileApiHandler();
      const userData = response?.user;
      const payload = {
        id: userData?.id,
        fullName: userData?.fullName,
        email: userData?.email,
        phone: userData?.phone,
        role: userData?.role,
        status: userData?.status,
        profileImage: null,
      };
      useAuthStore?.getState().setUser(payload);

      setUser(payload);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Failed to load profile."),
      });
    }
  };

  const handelVerify = async () => {
    try {
      var response;
      setLoading(true);
      switch (data?.isFor) {
        case INFO_UPDATE.EMAIL_UPDATE:
          response = await verifyUpdateInfoApiHandler({
            code: otp,
            type: "emailupdate",
          });
          break;
        case INFO_UPDATE.PHONE_UPDATE:
          response = await verifyUpdateInfoApiHandler({
            code: otp,
            type: "phoneupdate",
          });
          break;
      }
      getProfile();
      setShowModel(true);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Failed to update account information."),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      var response;
      setResendLoading(true);
      switch (data?.isFor) {
        case INFO_UPDATE.EMAIL_UPDATE:
          response = await updateInfoApiHandler({
            old: data?.oldEmail,
            new: data?.newEmail,
            type: "emailupdate",
          });
          break;
        case INFO_UPDATE.PHONE_UPDATE:
          response = await updateInfoApiHandler({
            old: data?.oldNumber,
            new: data?.newNumber,
            type: "phoneupdate",
          });
          break;
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Failed to update account information."),
      });
    } finally {
      setResendLoading(false);
    }
  };

  const goINfoPage = () => {
    setShowModel(false);
    navigation.push("AccountInformation");
  };
  useEffect(() => {
    // setUser(useAuthStore.getState().user);
    getProfile();
  }, []);
  return (
    <View className="flex-1 bg-BgWhite">
      <SuccessModel
        onclose={() => goINfoPage()}
        show={showModel}
        body={
          <View className="flex-1 px-8 flex justify-center items-center">
            <View className="bg-white w-full p-6 rounded-2xl flex flex-col gap-4 justify-center items-center">
              <Image
                source={
                  data?.isFor === INFO_UPDATE.EMAIL_UPDATE
                    ? infoSuccess
                    : phoneSuccess
                }
              />
              <View className="flex justify-center items-center">
                <Text className="text-cmd font-space-grotesk-bold text-center">
                  {data?.isFor === INFO_UPDATE.EMAIL_UPDATE
                    ? "Name Updated Successfully!"
                    : "Mobile Number Updated Successfully!"}
                </Text>
                <Text className="text-center w-64">
                  Your account information has been updated successfully.
                </Text>
              </View>
              <Button
                text="Done"
                loading={loading}
                action={() => goINfoPage()}
              />
            </View>
          </View>
        }
      />
      <View className="pt-12  px-10 pb-12 flex flex-col  rounded-b-[40px]  bg-primary">
        <BackButton color="#FFFF" navigation={navigation} />
        <View className="mt-8">
          <Text className="text-white text-[20px] text-center font-inter-bold">
            Account Information
          </Text>
          <Text className="text-white/50 mt-1 text-center text-cno font-inter">
            Welcome back to Euro Shipper!
          </Text>
        </View>
      </View>

      <View className="px-8 mt-16 flex flex-col justify-start content-between  flex-1">
        <View>
          <View>
            <Text className="text-primary font-space-grotesk-bold text-cxl w-full">
              OTP Verification
            </Text>
          </View>
          <Text className="text-csm mt-2 mb-6 text-primary/60 font-inter">
            We've sent a 4-digit verification code to your email
            {data?.newEmail ? ` ${data?.newEmail}` :  ` ${user?.email}`}
          </Text>
        </View>

        <View className="mt-10 gap-10">
          <OTPInput length={4} value={otp} onChange={setOtp} />

          <Button
            text="Verify"
            icon={<Icon name="NextArrow" color="#FFFF" size={18} />}
            loading={loading}
            action={handelVerify}
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
  );
};

export default VerifyUpdateOtp;
