import Icon from "@/assets/icons";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import React, { useState } from "react";
import { Text, View } from "react-native";

const CreateAccount = () => {
  const [data, SetData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    code: "",
  });
  const [showPass, setShowPass] = useState(false);

  return (
    <ScreenWrapper>
      <View className="px-8 pb-8 flex-1">
        <BackButton />

        <View className="mt-16 flex flex-col justify-between content-between  flex-1">
          <View>
            <View>
              <Text className="text-primary font-space-grotesk-bold text-cxl w-full">
                Create Account
              </Text>
            </View>
            <Text className="text-csm mt-2 mb-6 text-primary/60 font-inter">
              Create your account and access a smarter way to manage shipping
              and logistics.
            </Text>
          </View>

          <View className="flex flex-col gap-2">
            <Input
              label={"FULL NAME"}
              placeholderTxt={"Enter Full Name"}
              value={data?.name}
              onChange={(e: any) => SetData(e.target.value)}
            />{" "}
            <Input
              label={"Phone Number*"}
              placeholderTxt={"987654321"}
              value={data?.mobile}
              onChange={(e: any) =>
                SetData({ ...data, mobile: e.target.value })
              }
            />{" "}
            <Input
              label={"Email Address"}
              placeholderTxt={"jen@gmail.com"}
              value={data?.email}
              onChange={(e: any) => SetData({ ...data, email: e.target.value })}
            />
            <Input
              label={"Password"}
              placeholderTxt={"●●●●●●"}
              value={
                showPass
                  ? data?.password
                  : "●".repeat(data?.password?.length || 0)
              }
              onChange={(text: string) => SetData({ ...data, password: text })}
              icon={showPass ? <Icon name="CloseEye" /> : <Icon name="Eye" />}
              iconAction={() => setShowPass(!showPass)}
            />
          </View>

          <View className="mt-auto">
            <Text className="text-csm mt-2 mb-6 text-center text-primary/60 font-inter">
              By signing up, you confirm that you agree to our Terms of Service
              and Privacy Policy.
            </Text>

            <Button text="Create Account" action={() => {}} />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default CreateAccount;
