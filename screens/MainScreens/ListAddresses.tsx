import Icon from "@/assets/icons";
import EmptyAddress from "@/assets/images/emptyAddress.png";
import BackButton from "@/components/BackButton";
import Button, { Variant } from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import { deleteAddressApiHandler, getAddressApiHandler } from "@/helper/Api";
import { CountryImage } from "@/helper/buildFlagUrl";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

const ListAddresses = ({ navigation, route }: any) => {
  const [addresses, setAddresses] = useState(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const refreshAddress = route?.params?.refreshAddress ?? null;

  const getAddresses = async () => {
    try {
      const response = await getAddressApiHandler();
      setAddresses(response);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1:
          typeof error === "string"
            ? error
            : (error?.message ?? "Something went wrong"),
      });
    }
  };

  useEffect(() => {
    getAddresses();
  }, [refreshAddress]);
  const handelSubmit = () => {};
  const handelUpdate = (id: string) => {
    navigation.push("AddNewAddress", {
      address_id: id,
    });
  };
  const handelDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteAddressApiHandler(id);
      setAddresses((prev: any) => prev.filter((a: any) => a.id !== id));
      Toast.show({ type: "success", text1: "Address deleted." });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: typeof error === "string" ? error : "Failed to delete address.",
      });
    } finally {
      setDeletingId(null);
    }
  };
  const handelAddNew = () => {
    navigation.push("AddNewAddress");
  };
  return (
    <ScreenWrapper KeyboardAvoiding={false}>
      <View className="flex-1 px-8 pb-8">
        <BackButton navigation={navigation} />

        <View className="mt-10 flex flex-col justify-between content-between flex-1">
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex flex-col gap-8">
              {addresses?.length > 0 ? (
                addresses?.map((address: any) => (
                  <View
                    key={address?.id}
                    className="px-4 py-6 pb-4 flex flex-col gap-4 rounded-3xl bg-white"
                  >
                    <View className="flex  flex-row justify-between items-center">
                      <View className="flex  flex-row gap-2 items-center">
                        <View className="h-12 w-12 pr-0.5 flex justify-center items-center bg-[#CBD5E1] rounded-full">
                          <Icon name="User" size={24} />
                        </View>
                        <View>
                          <Text className="text-csm font-inter-bold">
                            {address?.fullName}
                          </Text>
                          <Text className="w-2/3 text-[11px] font-inter-bold text-primary/80">
                            {address?.number}
                          </Text>
                        </View>
                      </View>

                      <View className="flex flex-row  gap-2">
                        <Pressable
                          onPress={() => handelUpdate(address?.id)}
                          className="h-9 w-9 flex justify-center items-center border-[#D3D8E7]   border-[1.5px] rounded-lg"
                        >
                          <Icon name="Pencil" size={20} color="#334155" />
                        </Pressable>
                        <Pressable
                          onPress={() => handelDelete(address?.id)}
                          disabled={deletingId === address?.id}
                          className="h-9 w-9 flex justify-center items-center border-[#D3D8E7] border-[1.5px] rounded-lg"
                        >
                          {deletingId === address?.id ? (
                            <ActivityIndicator size={16} color="#334155" />
                          ) : (
                            <Icon name="Trash" size={20} color="#334155" />
                          )}
                        </Pressable>
                      </View>
                    </View>

                    <View className="flex  flex-row justify-between items-end">
                      <View className="">
                        <Text className=" text-csm font-inter text-primary/60">
                          {address?.addressLine.slice(0, 100)}
                        </Text>
                        <Text className=" text-csm font-inter-medium text-primary/80">
                          {address?.state} - {address?.city}
                        </Text>
                      </View>
                      <Image
                        className="w-11 h-8 rounded-md"
                        source={{ uri: CountryImage(address?.country) }}
                      />
                    </View>
                  </View>
                ))
              ) : (
                <View className="flex-1 pt-[40%] gap-1 flex flex-col px-6">
                  <Image
                    className="w-full rounded-lg flex items-start bg-cover"
                    source={EmptyAddress}
                  />
                  <Text className="text-cmd mt-6 font-space-grotesk-bold text-center">
                    No Saved Addresses Yet
                  </Text>
                  <Text className="text-csm font-inter-medium text-center">
                    Add your first pickup or delivery address to get started.
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
          <View className="mt-10 flex flex-col gap-6">
            <Button
              text="Add New Address"
              variant={Variant.OUTLINE}
              action={handelAddNew}
            />

            {/* <Button text="Continue" action={handelSubmit} /> */}
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ListAddresses;
