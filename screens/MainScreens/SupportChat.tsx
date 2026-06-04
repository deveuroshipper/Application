import Icon from "@/assets/icons";
import BackButton from "@/components/BackButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import React, { useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type ChatItem =
  | {
      id: string;
      type: "message";
      sender: "user" | "support";
      name: string;
      time: string;
      text: string;
    }
  | {
      id: string;
      type: "date";
      label: string;
    };

const initialMessages: ChatItem[] = [
  {
    id: "1",
    type: "message",
    sender: "user",
    name: "You",
    time: "10:00 AM",
    text: "Hi, I need you help",
  },
  {
    id: "2",
    type: "message",
    sender: "support",
    name: "John",
    time: "10:00 AM",
    text: "Hi How can i help you, what's your problem",
  },
  {
    id: "3",
    type: "date",
    label: "Monday, 20 May",
  },
  {
    id: "4",
    type: "message",
    sender: "user",
    name: "You",
    time: "10:00 AM",
    text: "Hi How can i help you, what's your problem",
  },
  {
    id: "5",
    type: "message",
    sender: "support",
    name: "John",
    time: "10:00 AM",
    text: "Let me check that for you. Could you confirm your tracking ID?",
  },
  {
    id: "6",
    type: "date",
    label: "Tuesday, 21 May",
  },
  {
    id: "7",
    type: "message",
    sender: "user",
    name: "You",
    time: "10:00 AM",
    text: "TRK123456",
  },
];

const SupportChat = ({ navigation, route }: any) => {
  const [chatData, setChatData] = useState<ChatItem[]>(initialMessages);
  const [message, setMessage] = useState("");
  const TicketId = route?.params?.ticketId;

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    setChatData((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        type: "message",
        sender: "user",
        name: "You",
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
        text: trimmedMessage,
      },
    ]);
    setMessage("");
  };

  const renderChatItem = ({ item }: { item: ChatItem }) => {
    if (item.type === "date") {
      return (
        <View className="items-center my-4">
          <Text className="text-[12px] font-inter-bold text-[#334155]/50">
            {item.label}
          </Text>
        </View>
      );
    }

    const isUser = item.sender === "user";

    return (
      <View
        className={`mb-5 flex-row items-end ${isUser ? "justify-end" : "justify-start"}`}
      >
        {!isUser && (
          <View className="w-10 h-10  bg-[#334155] items-center justify-center mr-3 rounded-full">
            <Icon name="User" size={18} color="#FFFFFF" />
          </View>
        )}

        <View
          className={`flex-1 ${isUser ? "items-end" : "items-start"}`}
          style={{ maxWidth: "82%" }}
        >
          <View
            className={`mb-1 flex-row items-center gap-1 ${isUser ? "justify-end" : "justify-start"}`}
          >
            <Text className="text-[12px] font-inter-bold text-primary">
              {item.name}
            </Text>
            <Text className="text-[10px] font-inter text-[#939393]">
              • {item.time}
            </Text>
          </View>

          <View
            className={`px-4 py-3 ${
              isUser
                ? "bg-[#DBE5E6]  rounded-tr-sm rounded-2xl"
                : "bg-[#334155]  rounded-tl-sm rounded-2xl"
            }`}
          >
            <Text
              className={`text-csm leading-5 font-inter ${
                isUser ? "text-[#334155]" : "text-white"
              }`}
            >
              {item.text}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper KeyboardAvoiding={true}>
      <KeyboardAvoidingView
        className="flex-1 px-8 pb-8"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View className="flex flex-row items-center justify-between">
          <BackButton navigation={navigation} />
          <View className="px-4 py-2  bg-green-200 text-green-900 rounded-full font-inter-medium">
            <Text>Open</Text>
          </View>
        </View>

        <View className="mt-6 mb-4">
          <Text numberOfLines={1} className="text-csl font-inter-bold">
            #TK-{TicketId?.replaceAll("-", "")}
          </Text>
          <Text className="text-csl font-inter-bold">
            Shipment Delay: Rotterdam port
          </Text>
        </View>

        <FlatList
          data={chatData}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "flex-end",
            paddingTop: 12,
            paddingBottom: 8,
          }}
        />

        <View className="pt-3 flex-row items-center gap-3">
          <TouchableOpacity
            activeOpacity={0.75}
            className="w-16 h-16 rounded-full bg-[#E2E8F0] items-center justify-center"
          >
            <Icon name="BoxArrowUp" size={28} color="#0F1729" />
          </TouchableOpacity>

          <View className="flex-1 h-16 px-6 rounded-full border border-[#BFD0E6] bg-white flex-row items-center">
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type Here"
              placeholderTextColor="#475569"
              className="flex-1 text-[13px] font-inter text-primary"
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />

            <TouchableOpacity activeOpacity={0.75} onPress={handleSend}>
              <Icon name="PaperPlane" size={24} color="#34445D" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default SupportChat;
