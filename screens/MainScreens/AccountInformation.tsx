import Icon from "@/assets/icons";
import infoSuccess from "@/assets/images/info-success.png";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import SuccessModel from "@/components/SuccessModel";
import { INFO_UPDATE } from "@/constants/enums";
import { getProfileApiHandler, updateNameApiHandler } from "@/helper/Api";
import { useAuthStore } from "@/store/useAuthStore";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const AccountInformation = ({ navigation }: any) => {
  const [user, setUser] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [nameModel, setNameModel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(
    useAuthStore.getState()?.user?.fullName ?? "",
  );

  const handelUpdateName = async () => {
    try {
      setLoading(true);
      await updateNameApiHandler({ name });
      getProfile();
      setNameModel(false);
      setShowModel(true);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: typeof error === "string" ? error : "Failed to delete address.",
      });
    } finally {
      setLoading(false);
    }
  };

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
        text1: typeof error === "string" ? error : "Failed to delete address.",
      });
    }
  };

 

  useEffect(() => {
    setUser(useAuthStore.getState().user);
    getProfile();
  }, []);
  return (
    <View className="flex-1 bg-BgWhite">
      <SuccessModel
        onclose={() => setShowModel(false)}
        show={showModel}
        body={
          <View className="flex-1 px-8 flex justify-center items-center">
            <View className="bg-white w-full p-6 rounded-2xl flex flex-col gap-4 justify-center items-center">
              <Image source={infoSuccess} />
              <View className="flex justify-center items-center">
                <Text className="text-cmd font-space-grotesk-bold text-center">
                  Name Updated Successfully!
                </Text>
                <Text className="text-center w-64">
                  Your account information has been updated successfully.
                </Text>
              </View>
              <Button
                text="Done"
                loading={loading}
                action={() => setShowModel(false)}
              />
            </View>
          </View>
        }
      />
      <SuccessModel
        onclose={() => setNameModel(false)}
        show={nameModel}
        body={
          <View className="flex-1 px-8 flex justify-center items-center">
            <View className="bg-white w-full p-6 rounded-2xl flex flex-col gap-2 justify-center items-center">
              <View className=" w-full">
                <Input
                  label="Full Name Change"
                  value={name}
                  onChange={(text: any) => setName(text)}
                  placeholderTxt="Enter Full name "
                />
              </View>
              <Button text="Submit" action={() => handelUpdateName()} />
            </View>
          </View>
        }
      />
      {/* Header */}
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
        <TouchableOpacity
          style={{
            shadowColor: "#BDBDBD",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1115,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={() => {
            setNameModel(true);
          }}
          className="px-6 py-5 flex flex-row items-center justify-between bg-white border-[1.5px] rounded-xl border-[#E9EDF8]"
        >
          <View className="flex flex-row gap-4">
            <View>
              <Text className="text-cno font-inter-bold text-primary">
                Full Name
              </Text>
              <Text className="text-[11px] font-inter text-primary">
                {user?.fullName}
              </Text>
            </View>
          </View>
          <Icon name="Arrow" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            shadowColor: "#BDBDBD",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1115,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={() => {
            navigation.push("UpdateDetail", {
              isFor: INFO_UPDATE.PHONE_UPDATE,
            });
          }}
          className="px-6 py-5 flex flex-row items-center justify-between bg-white border-[1.5px] rounded-xl border-[#E9EDF8]"
        >
          <View className="flex flex-row gap-4">
            <View>
              <Text className="text-cno font-inter-bold text-primary">
                Mobile Number
              </Text>
              <Text className="text-[11px] font-inter text-primary">
                {user?.phone}
              </Text>
            </View>
          </View>
          <Icon name="Arrow" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            shadowColor: "#BDBDBD",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1115,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={() => {
            navigation.push("UpdateDetail", {
              isFor: INFO_UPDATE.EMAIL_UPDATE,
            });
          }}
          className="px-6 py-5 flex flex-row items-center justify-between bg-white border-[1.5px] rounded-xl border-[#E9EDF8]"
        >
          <View className="flex flex-row gap-4">
            <View>
              <Text className="text-cno font-inter-bold text-primary">
                Email Id
              </Text>
              <Text className="text-[11px] font-inter text-primary">
                johnjames@gmail.com
              </Text>
            </View>
          </View>
          <Icon name="Arrow" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            shadowColor: "#BDBDBD",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1115,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={() => {
            navigation.push("UpdateDetail", {
              isFor: INFO_UPDATE.PASSWORD_UPDATE,
            });
          }}
          className="px-6 py-5 flex flex-row items-center justify-between bg-white border-[1.5px] rounded-xl border-[#E9EDF8]"
        >
          <View className="flex flex-row gap-4">
            <View>
              <Text className="text-cno font-inter-bold text-primary">
                Passwords
              </Text>
              <Text className="text-[11px] font-inter text-primary">
                ***********
              </Text>
            </View>
          </View>
          <Icon name="Arrow" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            shadowColor: "#BDBDBD",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1115,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={() => {
            navigation.push("ListAddresses");
          }}
          className="px-6 py-5 flex flex-row items-center justify-between bg-white border-[1.5px] rounded-xl border-[#E9EDF8]"
        >
          <View className="flex flex-row gap-4">
            <View>
              <Text className="text-cno font-inter-bold text-primary">
                Address
              </Text>
              <Text className="text-[11px] font-inter text-primary">
                Marylebone, London W1U ...
              </Text>
            </View>
          </View>
          <Icon name="Arrow" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AccountInformation;
