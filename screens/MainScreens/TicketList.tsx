import Icon from "@/assets/icons";
import submitSuccessfully from "@/assets/images/submitSuccessfully.png";
import BackButton from "@/components/BackButton";
import Button, { Variant } from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import { getTicketsApiHandler } from "@/helper/Api";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const TicketList = ({ navigation }: any) => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleBackToDashboard = () => {
    navigation.push("SubmitShipment");
  };

  const getTicketNumber = (ticket: any) => {
    const ticketNumber =
      ticket?.ticketNumber || ticket?.ticketNo || ticket?.ticketId;

    if (ticketNumber)
      return String(ticketNumber).startsWith("#")
        ? ticketNumber
        : `#${ticketNumber}`;

    return ticket?.id ? `#TK-${String(ticket.id).slice(0, 6)}` : "#TK";
  };

  const getStatusKey = (status: string) => {
    const normalized = status?.toUpperCase().replace(/_/g, "-").trim();

    if (normalized === "OPEN") return "OPEN";
    if (normalized === "IN-PROGRESS") return "IN-PROGRESS";
    if (normalized === "RESOLVED" || normalized === "CLOSED") return "RESOLVED";

    return "IN-PROGRESS";
  };

  const getStatusLabel = (status: string) => {
    const normalized = getStatusKey(status).replace(/-/g, " ");
    return normalized ? normalized.toUpperCase() : "IN PROGRESS";
  };

  const getStatusStyle = (status: string) => {
    const statusKey = getStatusKey(status);

    const styles: any = {
      OPEN: {
        icon: "WarningDiamond",
        iconSize: 26,
        iconBg: "rgba(255, 248, 222, 1)",
        iconColor: "#E5A11A",
        pillBg: "rgba(255, 240, 200, 1)",
        pillText: "#8B4513",
      },
      "IN-PROGRESS": {
        icon: "Sync",
        iconSize: 26,
        iconBg: "rgba(255, 248, 222, 1)",
        iconColor: "#E5A11A",
        pillBg: "rgba(255, 240, 200, 1)",
        pillText: "#8B4513",
      },
      RESOLVED: {
        icon: "CheckCircle",
        iconSize: 26,
        iconBg: "rgba(226, 232, 240, 1)",
        iconColor: "#475569",
        pillBg: "rgba(226, 232, 240, 1)",
        pillText: "#475569",
      },
    };

    return styles[statusKey];
  };

  const getRelativeTime = (dateValue: string) => {
    if (!dateValue) return "Recently";

    const date = new Date(dateValue);
    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

    if (Number.isNaN(date.getTime())) return "Recently";
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hours ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  const formatTicketDate = (dateValue: string) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTicket = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const response = await getTicketsApiHandler();
      const ticketList = Array.isArray(response)
        ? response
        : (response?.tickets ?? response?.data ?? []);
      setTickets(Array.isArray(ticketList) ? ticketList : []);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1:
          typeof error === "string"
            ? error
            : (error?.message ?? "Failed to resend OTP"),
      });
    } finally {
      if (showLoader) setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getTicket(false);
  };

  useEffect(() => {
    getTicket();
  }, []);

  const hasTickets = tickets.length > 0;

  const renderTicket = ({ item: ticket }: { item: any }) => {
    const updatedAt = ticket?.updatedAt || ticket?.createdAt;
    const statusStyle = getStatusStyle(ticket?.status);
    const supportName =
      ticket?.updatedBy?.fullName ||
      ticket?.supportAgent?.fullName ||
      ticket?.supportSpecialist ||
      "Support";

    return (
      <View className="bg-white border border-[#E5ECF7] rounded-3xl overflow-hidden">
        <View className="p-6">
          <View className="flex flex-row items-center justify-between mb-6">
            <View className="flex flex-row items-center gap-4">
              <View
                className="w-14 h-14 rounded-md items-center justify-center"
                style={{ backgroundColor: statusStyle.iconBg }}
              >
                <Icon
                  name={statusStyle.icon}
                  size={statusStyle?.iconSize}
                  color={statusStyle.iconColor}
                />
              </View>
              <Text className="text-cno font-inter-medium text-[#94A3B8]">
                {getTicketNumber(ticket)}
              </Text>
            </View>

            <View
              className="px-4 py-1 rounded-full"
              style={{ backgroundColor: statusStyle.pillBg }}
            >
              <Text
                className="text-[11px] font-inter-bold"
                style={{ color: statusStyle.pillText }}
              >
                {getStatusLabel(ticket?.status)}
              </Text>
            </View>
          </View>

          <Text className="text-cmd font-inter-bold text-primary">
            {ticket?.subject || "Support Ticket"}
          </Text>
          <Text className="mt-2 text-csm font-inter text-primary/70">
            Last update: {getRelativeTime(updatedAt)} by {supportName}
          </Text>
        </View>

        <View className="border-t border-[#E5ECF7] px-6 py-5 flex flex-row items-center justify-between">
          <Text className="text-[12px] font-inter-medium text-[#64748B]">
            {formatTicketDate(ticket?.createdAt || updatedAt)}
          </Text>

          {ticket?.status !== "resolved" ? (
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() =>
                navigation.push("SupportChat", {
                  ticketId: ticket?.id,
                })
              }
              className="flex flex-row items-center gap-2"
            >
              <Text className="text-[13px] font-inter-bold text-[#8A5A00]">
                View Thread
              </Text>
              <Icon name="NextArrow" size={12} color="#8A5A00" />
            </TouchableOpacity>
          ) : (
            <View className="flex flex-row items-center gap-2">
              <Text className="text-[13px] font-inter-bold text-[rgba(226, 232, 240, 1)]">
                Archive Detail
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper KeyboardAvoiding={false}>
      <View className="flex-1 px-8 pb-8">
        {/* Header */}
        <View className="flex flex-row items-center">
          <BackButton navigation={navigation} />
        </View>

        {/* Content */}
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#0F1729" size="large" />
          </View>
        ) : hasTickets ? (
          <FlatList
            data={tickets}
            keyExtractor={(item) => item?.id ?? getTicketNumber(item)}
            renderItem={renderTicket}
            className="flex-1"
            contentContainerStyle={{ paddingTop: 40, paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="h-4" />}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#0F1729"
                colors={["#0F1729"]}
              />
            }
          />
        ) : (
          <View className="flex-1 justify-center  gap-6">
            {/* Success Illustration Card */}
            <View className="w-full  h-fit rounded-2xl overflow-hidden">
              <Image
                source={submitSuccessfully}
                className="w-full rounded-3xl"
                resizeMode="contain"
              />
            </View>

            {/* Text */}
            <View className="items-center gap-2 mb-2">
              <Text className="text-cmd font-space-grotesk-bold text-primary text-center">
                How Can Help You?
              </Text>
              <View>
                <Text className="text-csm  font-inter text-primary/50 text-center">
                  you have not raised any queries. Need help?
                </Text>
                <Text className="text-csm font-inter text-primary/50 text-center">
                  we are here for you
                </Text>
              </View>
            </View>
            <View className=" flex flex-col gap-6">
              <Button
                text="Start Conversion"
                frontIcon={<Icon name="ChatTeardrop" color="#FFFF" size={28} />}
                action={() => navigation.push("CreateTickets")}
              />

              <Button
                text="View Tickets"
                variant={Variant.OUTLINE}
                action={handleBackToDashboard}
              />
            </View>
          </View>
        )}

        {/* Button */}
      </View>
    </ScreenWrapper>
  );
};

export default TicketList;
