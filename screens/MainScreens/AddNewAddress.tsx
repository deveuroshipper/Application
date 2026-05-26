import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

const TOTAL_STEP = 4;

const AddNewAddress = ({ navigation, route }: any) => {
  const [step, setStep] = useState(2);
  const [data, setData] = useState({
    name: "",
    mobile: "",
    mobileCode: {
      dialCode: "+1",
      flag: "🇺🇸",
      name: "United States",
    },
    code: "",
    addressLine1: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
  });

  const handelSubmit = () => {};

  return (
        <ScreenWrapper KeyboardAvoiding={false}>
        <View className="flex-1 px-8 pb-8">
            <View className="flex flex-row items-center justify-between">
            <BackButton navigation={navigation} />
            <View className="px-4 py-1  bg-[#BFCDDE] rounded-full">
                <Text className="text-cno  text-primary font-inter-medium">
                {step}/{TOTAL_STEP}
                </Text>
            </View>
            </View>

            <View className="mt-10 flex flex-col justify-between content-between flex-1">
            <ScrollView 
            showsVerticalScrollIndicator={false}>
                <View className="flex flex-col gap-4">
                <Input
                    label={"Full Name"}
                    placeholderTxt={"Type your name here"}
                    value={data?.name}
                    onChange={(text: string) => setData({ ...data, name: text })}
                />
                <PhoneNumberInput
                    label={"Mobile Number"}
                    placeholderTxt={"Type your mobile number"}
                    value={data?.mobile}
                    selectedCode={data?.mobileCode}
                    onCodeChange={(e) => setData({ ...data, mobileCode: e })}
                    onChange={(text: string) => setData({ ...data, mobile: text })}
                />
                <Input
                    label={"Address"}
                    placeholderTxt={"Type your address here"}
                    value={data?.addressLine1}
                    onChange={(text: string) =>
                    setData({ ...data, addressLine1: text })
                    }
                    multiline={true}
                    numberOfLines={4}
                />
                <Input
                    label={"Pin code"}
                    placeholderTxt={"Enter Pin code"}
                    value={data?.pincode}
                    onChange={(text: string) => setData({ ...data, pincode: text })}
                />
                <View className=" flex-row gap-6">
                    <View className="flex-1">
                    <Input
                        label={"City"}
                        placeholderTxt={"Enter City"}
                        value={data?.city}
                        onChange={(text: string) =>
                        setData({ ...data, city: text })
                        }
                    />
                    </View>
                    <View className="flex-1">
                    <Input
                        label={"State"}
                        placeholderTxt={"Enter State"}
                        value={data?.state}
                        onChange={(text: string) =>
                        setData({ ...data, state: text })
                        }
                    />
                    </View>
                </View>
                <Input
                    label={"Country"}
                    placeholderTxt={"UK"}
                    value={data?.country}
                    onChange={(text: string) => setData({ ...data, country: text })}
                />
                </View>
            </ScrollView>
            <View className="mt-10">
                <Button text="Continue " action={handelSubmit} />
            </View>
            </View>
        </View>
        </ScreenWrapper>
  );
};

export default AddNewAddress;
