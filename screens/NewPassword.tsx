import Icon from "@/assets/icons";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import React, { useState } from "react";
import { Text, View } from "react-native";

const NewPassword = ({ navigation }: any) => {
  const [data, SetData] = useState({
    password: "",
    conformPassword: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConPass, setShowConPass] = useState(false);

  const handelSubmit = () => {
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
              onChange={(text: string) => SetData({ ...data, password: text })}
              icon={showPass ? <Icon name="CloseEye" /> : <Icon name="Eye" />}
              iconAction={() => setShowPass(!showPass)}
            />
            <Input
              label={"Confirm Password"}
              placeholderTxt={"●●●●●●"}
              value={data?.conformPassword}
              secureTextEntry={!showConPass}
              onChange={(text: string) =>
                SetData({ ...data, conformPassword: text })
              }
              icon={
                showConPass ? <Icon name="CloseEye" /> : <Icon name="Eye" />
              }
              iconAction={() => setShowConPass(!showConPass)}
            />

            <View className="mt-8">
              <Button
                text="Reset Password"
                icon={<Icon name="NextArrow" color="#FFFF" size={18} />}
                action={handelSubmit}
              />
            </View>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default NewPassword;
