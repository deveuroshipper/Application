import Icon from "@/assets/icons";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import ScreenWrapper from "@/components/ScreenWrapper";
import { registerApiHandler } from "@/helper/Api";
import React, { useState } from "react";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";

const CreateAccount = ({ navigation }: any) => {
  const [data, SetData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    code: {
      dialCode: "",
      flag: "",
      name: "",
    },
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
  });

  const validate = (): boolean => {
    const newErrors = { name: "", email: "", password: "", mobile: "" };

    if (!data.name.trim()) newErrors.name = "Full name is required.";

    if (!data.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      newErrors.email = "Please enter a valid email address.";

    if (!data.password) newErrors.password = "Password is required.";
    else if (data.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    if (data?.code?.dialCode == "" || data?.code?.name == "") {
      newErrors.mobile = "Please select a mobile country code";
    }

    if (!data.mobile.trim()) {
      newErrors.mobile = "Phone number is required.";
    } else if (!/^\d{10}$/.test(data.mobile.trim())) {
      newErrors.mobile = "Phone number must be exactly 10 digits.";
    }
    setErrors(newErrors);
    return (
      !newErrors.name &&
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.mobile
    );
  };

  const handelSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await registerApiHandler(
        data.name,
        data.email,
        data.password,
        data.mobile,
        data?.code?.dialCode,
        data?.code?.name,
      );
      navigation.push("EmailVerification", {
        screenFor: "EMAIL_VERIFICATION",
        email: data.email,
      });
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

  return (
    <ScreenWrapper KeyboardAvoiding={true}>
      <View className="px-8 pb-8 flex-1">
        <BackButton navigation={navigation} />

        <View className="mt-16 flex flex-col justify-between content-between  flex-1">
          <View>
            <View>
              <Text className="text-primary font-space-grotesk-bold text-cxl w-full">
                Create Account
              </Text>
            </View>
            <Text className="text-csm mt-2 mb-6 text-[#242646]/70 font-inter">
              Create your account and access a smarter way to manage shipping
              and logistics.
            </Text>
          </View>

          <View className="flex flex-col ">
            <Input
              label={"FULL NAME"}
              placeholderTxt={"Enter Full Name"}
              value={data?.name}
              onChange={(text: string) => {
                SetData({ ...data, name: text });
                if (errors.name) setErrors((e) => ({ ...e, name: "" }));
              }}
              error={errors.name}
            />
            <PhoneNumberInput
              label={"Phone Number"}
              placeholderTxt={"987654321"}
              value={data?.mobile}
              selectedCode={data?.code}
              onCodeChange={(e) => SetData({ ...data, code: e })}
              onChange={(text: string) => {
                SetData({ ...data, mobile: text });
                if (errors.mobile) setErrors((e) => ({ ...e, mobile: "" }));
              }}
              error={errors.mobile}
            />
            <Input
              label={"Email Address"}
              placeholderTxt={"jen@gmail.com"}
              value={data?.email}
              onChange={(text: string) => {
                SetData({ ...data, email: text });
                if (errors.email) setErrors((e) => ({ ...e, email: "" }));
              }}
              error={errors.email}
            />
            <Input
              label={"Password"}
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
          </View>

          <View className="mt-auto">
            <Text className="text-csm mt-2 mb-6 text-center text-primary/60 font-inter">
              By signing up, you confirm that you agree to our Terms of Service
              and Privacy Policy.
            </Text>

            <Button
              text="Create Account"
              loading={loading}
              action={handelSubmit}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default CreateAccount;
