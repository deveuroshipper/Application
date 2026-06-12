import Icon from "@/assets/icons";
import BackButton from "@/components/BackButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import {
  BASE_URL,
  getTicketByIdApiHandler,
  sendTicketMessageApiHandler,
} from "@/helper/Api";
import { useAuthStore } from "@/store/useAuthStore";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { io, Socket } from "socket.io-client";

type TicketMessage = {
  id: string;
  ticketId?: string;
  senderId?: string;
  message: string;
  createdAt?: string;
  sender?: {
    fullName?: string;
    role?: string;
  };
  senderName?: string;
  senderRole?: string;
  newStatus?: string;
};

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

const SOCKET_URL = BASE_URL?.replace(/\/api\/?$/, "") ?? "";

const formatMessageTime = (dateValue?: string) => {
  const date = dateValue ? new Date(dateValue) : new Date();
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatDateLabel = (dateValue?: string) => {
  const date = dateValue ? new Date(dateValue) : new Date();
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
};

const getTicketNumber = (ticketId?: string) =>
  ticketId ? `#TK-${ticketId.replaceAll("-", "").slice(0, 12)}` : "#TK";

const getStatusLabel = (status?: string) => {
  const normalized = status?.replace(/_/g, "-").toUpperCase();
  if (normalized === "IN-PROGRESS") return "In Progress";
  if (normalized === "RESOLVED" || normalized === "CLOSED") return "Resolved";
  return "Open";
};

const SupportChat = ({ navigation, route }: any) => {
  const flatListRef = useRef<FlatList<ChatItem>>(null);
  const socketRef = useRef<Socket | null>(null);
  const currentUser = useAuthStore((state) => state.user);
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const ticketId = route?.params?.ticketId;

  const chatData = useMemo(() => {
    const items: ChatItem[] = [];
    let lastDateLabel = "";

    messages.forEach((msg) => {
      const dateLabel = formatDateLabel(msg.createdAt);
      const isCurrentUser =
        msg.senderId === currentUser?.id ||
        msg.sender?.role === "user" ||
        msg.senderRole === "user";

      if (dateLabel && dateLabel !== lastDateLabel) {
        items.push({
          id: `date-${dateLabel}-${msg.id}`,
          type: "date",
          label: dateLabel,
        });
        lastDateLabel = dateLabel;
      }

      items.push({
        id: msg.id,
        type: "message",
        sender: isCurrentUser ? "user" : "support",
        name:
          (isCurrentUser ? "You" : msg.sender?.fullName || msg.senderName) ||
          "Support",
        time: formatMessageTime(msg.createdAt),
        text: msg.message,
      });
    });

    return items;
  }, [currentUser?.id, messages]);

  const loadTicket = useCallback(async () => {
    if (!ticketId) return;

    setLoading(true);
    try {
      const response = await getTicketByIdApiHandler(ticketId);
      setTicket(response);
      setMessages(Array.isArray(response?.messages) ? response.messages : []);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1:
          typeof error === "string"
            ? error
            : (error?.message ?? "Failed to load ticket chat"),
      });
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  useEffect(() => {
    if (!ticketId || !SOCKET_URL) return;

    const socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.connect();
    socket.emit("joinTicket", ticketId);

    const handleNewMessage = (newMessage: TicketMessage) => {
      if (newMessage.ticketId && newMessage.ticketId !== ticketId) return;

      setMessages((prev) => {
        if (prev.some((msg) => msg.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });

      if (newMessage.newStatus) {
        setTicket((prev: any) =>
          prev ? { ...prev, status: newMessage.newStatus } : prev,
        );
      }
    };

    const handleStatusUpdated = (payload: any) => {
      if (payload?.ticketId !== ticketId) return;
      setTicket((prev: any) =>
        prev ? { ...prev, status: payload.status } : prev,
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("statusUpdated", handleStatusUpdated);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("statusUpdated", handleStatusUpdated);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [ticketId]);

  useEffect(() => {
    if (!chatData.length) return;

    requestAnimationFrame(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    });
  }, [chatData.length]);

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!ticketId || !trimmedMessage || sending) return;

    setSending(true);
    try {
      await sendTicketMessageApiHandler(ticketId, trimmedMessage);
      setMessage("");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1:
          typeof error === "string"
            ? error
            : (error?.message ?? "Failed to send message"),
      });
    } finally {
      setSending(false);
    }
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
          <View className="w-10 h-10 bg-[#334155] items-center justify-center mr-3 rounded-full">
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
                ? "bg-[#DBE5E6] rounded-tr-sm rounded-2xl"
                : "bg-[#334155] rounded-tl-sm rounded-2xl"
            }`}
          >
            <Text
              className={`text-csm leading-5 font-inter ${
                isUser ? "text-[#334155]" : "text-white"
              }`}
            >
              {item.text.trim(" ")}
            </Text>
          </View>
        </View>
      </View>
    );
  };

 

  return (
    <ScreenWrapper KeyboardAvoiding={true}>
      <KeyboardAvoidingView
        className="flex-1 px-8  mb-8 "
        style={{paddingVertical : 32}}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex flex-row items-center justify-between">
          <BackButton navigation={navigation} />
          <View className="px-4 py-2 bg-green-200 rounded-full">
            <Text className="text-green-900 font-inter-medium">
              {getStatusLabel(ticket?.status)}
            </Text>
          </View>
        </View>

        <View className="mt-6 mb-4">
          <Text numberOfLines={1} className="text-csl font-inter-bold">
            {getTicketNumber(ticketId)}
          </Text>
          <Text className="text-csl font-inter-bold">
            {ticket?.subject || "Support Ticket"}
          </Text>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#0F1729" size="large" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
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
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center">
                <Text className="text-csm font-inter text-primary/50">
                  No messages yet
                </Text>
              </View>
            }
          />
        )}

        <View className="pt-3 flex-row items-center gap-3">
          {/* <TouchableOpacity
            activeOpacity={0.75}
            className="w-16 h-16 rounded-full bg-[#E2E8F0] items-center justify-center"
          >
            <Icon name="BoxArrowUp" size={28} color="#0F1729" />
          </TouchableOpacity> */}

          {ticket?.status !== "resolved" ? (
            <View className="flex-1 h-16 px-6 rounded-full border border-[#BFD0E6] bg-white flex-row items-center">
              <TextInput
              
                value={message}
                onChangeText={setMessage}
                placeholder="Type Here"
                placeholderTextColor="#475569"
                className="flex-1 text-[13px] font-inter text-primary"
                returnKeyType="send"
                onSubmitEditing={handleSend}
                editable={!sending}
              />

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={handleSend}
                disabled={sending || !message.trim()}
                style={{ opacity: sending || !message.trim() ? 0.45 : 1 }}
              >
                {sending ? (
                  <ActivityIndicator color="#34445D" size="small" />
                ) : (
                  <Icon name="PaperPlane" size={24} color="#34445D" />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View className="flex justify-center items-center bg-primary/10 rounded-lg flex-1 h-14">
              <Text className="text-cno font-inter-semibold text-primary/40">Ticket close </Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default SupportChat;
