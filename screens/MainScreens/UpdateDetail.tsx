import Icon from "@/assets/icons";
import passwordSuccess from "@/assets/images/password-success.png";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import ScreenWrapper from "@/components/ScreenWrapper";
import SuccessModel from "@/components/SuccessModel";
import { INFO_UPDATE } from "@/constants/enums";
import {
  changePasswordApiHandler,
  getProfileApiHandler,
  updateInfoApiHandler,
} from "@/helper/Api";
import { useAuthStore } from "@/store/useAuthStore";
import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import Toast from "react-native-toast-message";
const UpdateDetail = ({ navigation, route }: any) => {
  const [user, setUser] = useState(null);
  const isFor: INFO_UPDATE = route?.params?.isFor ?? INFO_UPDATE.EMAIL_UPDATE;

  const [loading, setLoading] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [errors, setErrors] = useState({
    oldNumber: "",
    newNumber: "",
    oldEmail: "",
    newEmail: "",
    oldPassword: "",
    newPassword: "",
    conformPassword: "",
  });
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const [detail, setDetail] = useState({
    oldNumber: "",
    oldCode: {
      dialCode: "+1",
      flag: "🇺🇸",
      name: "United States",
    },

    newNumber: "",
    newCode: {
      dialCode: "+1",
      flag: "🇺🇸",
      name: "United States",
    },
    oldEmail: "",
    newEmail: "",
    oldPassword: "",
    newPassword: "",
    conformPassword: "",
  });

  const getErrorMessage = (error: any, fallback = "Something went wrong") =>
    typeof error === "string" ? error : (error?.message ?? fallback);

  const goInfoPage = () => {
    setShowModel(false);
    navigation.push("AccountInformation");
  };

  const clearError = (name: keyof typeof errors) => {
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  const validate = (): boolean => {
    const newErrors = {
      oldNumber: "",
      newNumber: "",
      oldEmail: "",
      newEmail: "",
      oldPassword: "",
      newPassword: "",
      conformPassword: "",
    };

    switch (isFor) {
      case INFO_UPDATE.EMAIL_UPDATE:
        if (!detail.oldEmail.trim())
          newErrors.oldEmail = "Old email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(detail.oldEmail))
          newErrors.oldEmail = "Please enter a valid old email address.";

        if (!detail.newEmail.trim())
          newErrors.newEmail = "New email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(detail.newEmail))
          newErrors.newEmail = "Please enter a valid new email address.";
        break;

      case INFO_UPDATE.PHONE_UPDATE:
        if (!detail.oldNumber.trim())
          newErrors.oldNumber = "Old mobile number is required.";
        if (!detail.newNumber.trim())
          newErrors.newNumber = "New mobile number is required.";
        break;

      case INFO_UPDATE.PASSWORD_UPDATE:
        if (!detail.oldPassword)
          newErrors.oldPassword = "Old password is required.";
        else if (detail.oldPassword.length < 6)
          newErrors.oldPassword = "Password must be at least 6 characters.";

        if (!detail.newPassword)
          newErrors.newPassword = "New password is required.";
        else if (detail.newPassword.length < 6)
          newErrors.newPassword = "Password must be at least 6 characters.";

        if (!detail.conformPassword)
          newErrors.conformPassword = "Confirm password is required.";
        else if (detail.conformPassword !== detail.newPassword)
          newErrors.conformPassword = "Passwords do not match.";
        break;
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const isVerifyDisabled = (() => {
    switch (isFor) {
      case INFO_UPDATE.EMAIL_UPDATE:
        return !detail.oldEmail.trim() || !detail.newEmail.trim() || loading;
      case INFO_UPDATE.PHONE_UPDATE:
        return !detail.oldNumber.trim() || !detail.newNumber.trim() || loading;
      case INFO_UPDATE.PASSWORD_UPDATE:
        return (
          !detail.oldPassword ||
          !detail.newPassword ||
          !detail.conformPassword ||
          loading
        );
      default:
        return loading;
    }
  })();

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
      console.log("payload : ", payload);
      useAuthStore?.getState().setUser(payload);
      setDetail({
        ...detail,
        oldNumber: userData?.phone,
        oldEmail: userData?.email,
      });
      setUser(payload);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Failed to load profile."),
      });
    }
  };

  const handelVerify = async () => {
    if (!validate()) return;

    try {
      var response;
      setLoading(true);
      console.log("is form. : ", isFor);
      switch (isFor) {
        case INFO_UPDATE.EMAIL_UPDATE:
          console.log("in email update");
          response = await updateInfoApiHandler({
            old: detail?.oldEmail,
            new: detail?.newEmail,
            type: "emailupdate",
          });
          break;
        case INFO_UPDATE.PHONE_UPDATE:
          console.log("in phone update");

          response = await updateInfoApiHandler({
            old: detail?.oldNumber,
            new: detail?.newNumber,
            type: "phoneupdate",
          });
          break;
        case INFO_UPDATE.PASSWORD_UPDATE:
          console.log("in password update");

          response = await changePasswordApiHandler({
            oldPassword: detail?.oldPassword,
            newPassword: detail?.newPassword,
          });
          break;
      }
      getProfile();
      if (isFor === INFO_UPDATE.PASSWORD_UPDATE) {
        setShowModel(true);
        console.log("update response ==> ", response);
        return;
      }

      const payload: any = {
        isFor: isFor,
      };

      if (isFor === INFO_UPDATE.EMAIL_UPDATE) {
        payload.oldEmail = detail?.oldEmail;
        payload.newEmail = detail?.newEmail;
      }
      if (isFor === INFO_UPDATE.PHONE_UPDATE) {
        payload.oldNumber = detail?.oldNumber;
        payload.newNumber = detail?.newNumber;
      }
      navigation.push("VerifyUpdateOtp", {
        data: payload,
      });
      console.log("update response ==> ", response);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Failed to update account information."),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // setUser(useAuthStore.getState().user);
    getProfile();
  }, []);

  const renderUpdateUi = () => {
    switch (isFor) {
      case INFO_UPDATE.EMAIL_UPDATE:
        return (
          <View>
            <View className="mb-6">
              <Input
                label="Enter Old Email Address"
                value={detail?.oldEmail}
                onChange={(text: any) => {
                  setDetail({ ...detail, oldEmail: text });
                  clearError("oldEmail");
                }}
                placeholderTxt="jen@gmail.com"
                error={errors.oldEmail}
              />
              <Input
                label="Enter New Email Address"
                value={detail?.newEmail}
                onChange={(text: any) => {
                  setDetail({ ...detail, newEmail: text });
                  clearError("newEmail");
                }}
                placeholderTxt="abc123@gmail.com"
                error={errors.newEmail}
              />
            </View>
            <Button
              text="Verify"
              loading={loading}
              disabled={isVerifyDisabled}
              action={handelVerify}
            />
          </View>
        );
      case INFO_UPDATE.PHONE_UPDATE:
        return (
          <View>
            <View className="mb-6">
              <PhoneNumberInput
                label={"Enter Old Mobile Number"}
                placeholderTxt={"Type your old mobile number"}
                value={detail?.oldNumber}
                selectedCode={detail?.oldCode}
                onCodeChange={(e) => {}}
                onChange={(text: string) => {
                  setDetail({ ...detail, oldNumber: text });
                  clearError("oldNumber");
                }}
                error={errors.oldNumber}
              />
              <PhoneNumberInput
                label={"Enter New Mobile Number"}
                placeholderTxt={"Type your new mobile number"}
                value={detail?.newNumber}
                selectedCode={detail?.newCode}
                onCodeChange={(e) => {}}
                onChange={(text: string) => {
                  setDetail({ ...detail, newNumber: text });
                  clearError("newNumber");
                }}
                error={errors.newNumber}
              />
            </View>
            <Button
              text="Verify"
              loading={loading}
              disabled={isVerifyDisabled}
              action={handelVerify}
            />
          </View>
        );
      case INFO_UPDATE.PASSWORD_UPDATE:
        return (
          <View>
            <View className="mb-6">
              <Input
                label="Old Password"
                value={detail?.oldPassword}
                onChange={(text: any) => {
                  setDetail({ ...detail, oldPassword: text });
                  clearError("oldPassword");
                }}
                secureTextEntry={!showOldPass}
                icon={
                  showOldPass ? <Icon name="CloseEye" /> : <Icon name="Eye" />
                }
                iconAction={() => setShowOldPass(!showOldPass)}
                placeholderTxt="•••••••"
                error={errors.oldPassword}
              />
              <Input
                label="New Password"
                value={detail?.newPassword}
                onChange={(text: any) => {
                  setDetail({ ...detail, newPassword: text });
                  clearError("newPassword");
                }}
                secureTextEntry={!showNewPass}
                icon={
                  showNewPass ? <Icon name="CloseEye" /> : <Icon name="Eye" />
                }
                iconAction={() => setShowNewPass(!showNewPass)}
                placeholderTxt="•••••••"
                error={errors.newPassword}
              />
              <Input
                label="Confirm Password"
                value={detail?.conformPassword}
                onChange={(text: any) => {
                  setDetail({ ...detail, conformPassword: text });
                  clearError("conformPassword");
                }}
                secureTextEntry={!showConfPass}
                icon={
                  showConfPass ? <Icon name="CloseEye" /> : <Icon name="Eye" />
                }
                iconAction={() => setShowConfPass(!showConfPass)}
                placeholderTxt="•••••••"
                error={errors.conformPassword}
              />
            </View>
            <Button
              text="Verify"
              loading={loading}
              disabled={isVerifyDisabled}
              action={handelVerify}
            />
          </View>
        );
    }
  };

  return (
    <ScreenWrapper>
      <View className="flex-1 bg-BgWhite">
        <SuccessModel
          onclose={() => goInfoPage()}
          show={showModel}
          body={
            <View className="flex-1 px-8 flex justify-center items-center">
              <View className="bg-white w-full p-6 rounded-2xl flex flex-col gap-4 justify-center items-center">
                <Image source={passwordSuccess} />
                <View className="flex justify-center items-center">
                  <Text className="text-cmd font-space-grotesk-bold text-center">
                    Password Updated Successfully!
                  </Text>
                  <Text className="text-center w-64">
                    Your account information has been updated successfully.
                  </Text>
                </View>
                <Button
                  text="Done"
                  loading={loading}
                  action={() => goInfoPage()}
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

        <View className=" mt-10  px-8 mb-6 flex flex-col gap-6 flex-1">
          {renderUpdateUi()}
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default UpdateDetail;
