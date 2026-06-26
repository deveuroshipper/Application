import Icon from "@/assets/icons";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import { createTicketApiHandler, getOrdersApiHandler } from "@/helper/Api";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const CreateTickets = ({ navigation }: any) => {
  const [orders, setOrders] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    typeOfQuery: "",
    subject: "",
    typeOfProduct: "",
    message: "",
    order: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    typeOfQuery: "",
    subject: "",
    typeOfProduct: "",
    message: "",
    order: "",
  });
  const handleBackToDashboard = () => {
    navigation.push("SupportScreen");
  };

  const isFormFilled = Boolean(
    data.name.trim() &&
    data.email.trim() &&
    data.phone.trim() &&
    data.typeOfQuery &&
    (data.typeOfQuery !== "order_related" || data.order) &&
    data.subject.trim() &&
    data.message.trim(),
  );

  const validate = (): boolean => {
    const phoneNumber = data.phone.trim();
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      typeOfQuery: "",
      subject: "",
      typeOfProduct: "",
      message: "",
      order: "",
    };

    if (!data.name.trim()) newErrors.name = "Full name is required.";

    if (!data.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
      newErrors.email = "Please enter a valid email address.";

    if (!phoneNumber) newErrors.phone = "Mobile number is required.";
    else if (!/^\d{7,15}$/.test(phoneNumber))
      newErrors.phone = "Please enter a valid mobile number.";

    if (!data.typeOfQuery) newErrors.typeOfQuery = "Type of query is required.";
    if (data.typeOfQuery === "order_related" && !data.order)
      newErrors.order = "Order is required.";
    if (!data.subject.trim()) newErrors.subject = "Subject is required.";

    if (!data.message.trim()) newErrors.message = "Message is required.";

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handelSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await createTicketApiHandler({
        fullname: data.name.trim(),
        email: data.email.trim(),
        mobilenumber: data.phone.trim(),
        subject: data.subject.trim(),
        typeOfProduct: "NA",
        message: data.message.trim(),
        queryType: data.typeOfQuery,
        ...(data.order ? { orderId: data.order } : {}),
      });

      Toast.show({
        type: "success",
        text1: "Ticket created successfully",
      });
      handleBackToDashboard();
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

  const getOrders = async () => {
    try {
      const response = await getOrdersApiHandler();

      setOrders(response);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1:
          typeof error === "string"
            ? error
            : (error?.message ?? "Failed to resend OTP"),
      });
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <ScreenWrapper KeyboardAvoiding={true}>
      <View className="flex-1 px-8 pb-8">
        {/* Header */}
        <View className="flex flex-row items-center justify-between">
          <BackButton navigation={navigation} />
          <TouchableOpacity
            onPress={() => navigation.push("TicketList")}
            className="px-4 py-1  bg-[#BFCDDE] rounded-full"
          >
            <Text className="text-cno  text-primary font-inter-medium">
              View Ticket
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          <View className="flex-1 pt-10">
            <Input
              label={"Full Name"}
              placeholderTxt={"Type your name here"}
              value={data?.name}
              onChange={(text: string) => {
                setData({ ...data, name: text });
                if (errors.name) setErrors((e) => ({ ...e, name: "" }));
              }}
              error={errors.name}
            />
            <Input
              label={"Email ID"}
              placeholderTxt={"jen@gmail.com"}
              value={data?.email}
              onChange={(text: string) => {
                setData({ ...data, email: text });
                if (errors.email) setErrors((e) => ({ ...e, email: "" }));
              }}
              error={errors.email}
            />
            <Input
              label={"Mobile Number "}
              placeholderTxt={"9752658645"}
              value={data?.phone}
              onChange={(text: string) => {
                setData({ ...data, phone: text });
                if (errors.phone) setErrors((e) => ({ ...e, phone: "" }));
              }}
              keyboardTypes={"phone-pad"}
              error={errors.phone}
            />
            <Dropdown
              label="Type of Query"
              placeholder="Select"
              value={data.typeOfQuery}
              onChange={(text) => {
                setData({
                  ...data,
                  typeOfQuery: text,
                  order: text === "order_related" ? data.order : "",
                });
                if (errors.typeOfQuery)
                  setErrors((e) => ({ ...e, typeOfQuery: "" }));
              }}
              options={[
                { label: "General", value: "general" },
                { label: "Order Related", value: "order_related" },
              ]}
            />
            <Text className="text-[10px] font-inter-medium ml-1 mt-1 text-red-500">
              {errors.typeOfQuery}
            </Text>

            {data?.typeOfQuery === "order_related" ? (
              <View className="mt-4">
                <Dropdown
                  label="Order List"
                  placeholder="Select Order"
                  value={data.order}
                  hideSelectedOption
                  onChange={(text) => {
                    setData({ ...data, order: text });
                    if (errors.order) setErrors((e) => ({ ...e, order: "" }));
                  }}
                  options={
                    orders?.length > 0
                      ? orders?.map((item: any, index: any) => {
                          return {
                            label: (
                              <View
                                className="flex-1 flex flex-col gap-1 "
                                key={item?.id}
                              >
                                <View className="flex-1  w-full flex flex-row justify-between">
                                  <View className="flex flex-row gap-2">
                                    <Icon name="Box" />
                                    <View className="flex flex-row items-center justify-center">
                                      <Text className="text-cno font-inter-medium text-primary"></Text>
                                      <Text className="text-cno font-inter-medium text-primary">
                                        {item?.shortId
                                          ? item?.shortId?.toUpperCase()
                                          : item?.id.slice(0, 10) + "..."}
                                        
                                      </Text>
                                    </View>
                                  </View>
                                  <Text className="text-cno font-inter-medium text-primary">
                                    {item?.box?.name?.split("–")[1]?.trim() ??
                                      item?.box?.name ??
                                      "Box"}{" "}
                                    - {item?.box?.weight}kg
                                  </Text>
                                </View>
                                <View className="flex flex-row gap-4 items-center">
                                  <Text className="text-[15px] font-inter-medium text-primary/80">
                                    {item?.route?.originName}
                                  </Text>
                                  <View
                                    style={{
                                      transform: [{ rotate: "180deg" }],
                                    }}
                                  >
                                    <Icon size={12} name="BackArrow" />
                                  </View>
                                  <Text className="text-[15px] font-inter-medium text-primary/80">
                                    {item?.route?.destinationName}
                                  </Text>
                                </View>
                              </View>
                            ),
                            value: item?.id,
                          };
                        })
                      : [
                          {
                            label: (
                              <View>
                                <Text>Not have any orders</Text>
                              </View>
                            ),
                            value: "",
                          },
                        ]
                  }
                />
                <Text className="text-[10px] font-inter-medium ml-1 mt-1 text-red-500">
                  {errors.order}
                </Text>
              </View>
            ) : null}
            <View className="mb-4" />
            <Input
              label={"Subject"}
              placeholderTxt={"Subject"}
              value={data?.subject}
              onChange={(text: string) => {
                setData({ ...data, subject: text });
                if (errors.subject) setErrors((e) => ({ ...e, subject: "" }));
              }}
              error={errors.subject}
            />
            {/* <Input
              label={"type Of product"}
              placeholderTxt={"Subject"}
              value={data?.typeOfProduct}
              onChange={(text: string) => {
                setData({ ...data, typeOfProduct: text });
                if (errors.typeOfProduct)
                  setErrors((e) => ({ ...e, typeOfProduct: "" }));
              }}
              error={errors.typeOfProduct}
            /> */}
            <Input
              label={"message"}
              placeholderTxt={"Type your message "}
              value={data?.message}
              onChange={(text: string) => {
                setData({ ...data, message: text });
                if (errors.message) setErrors((e) => ({ ...e, message: "" }));
              }}
              multiline={true}
              numberOfLines={4}
              error={errors.message}
            />
          </View>
        </ScrollView>

        <Button
          text="Submit"
          action={handelSubmit}
          loading={loading}
          disabled={!isFormFilled || loading}
        />
      </View>
    </ScreenWrapper>
  );
};

export default CreateTickets;
