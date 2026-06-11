import Icon from "@/assets/icons";
import { getOrderByIdApiHandler } from "@/helper/Api";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

// ─── Types ────────────────────────────────────────────────────────────────────

type StepStatus = "done" | "active" | "hold" | "pending";

type OrderStatus =
  | "PLACED"
  | "RECEIVED"
  | "SHIPPED"
  | "REACHEDTOLOCALPARTNER"
  | "DELIVERED"
  | "HOLD";

type TimelineItem = {
  event: string;
  location: string;
  time: string;
};

type TrackingStep = {
  id: string;
  label: string;
  date: string;
  location: string;
  status: StepStatus;
};

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  PLACED: {
    label: "Placed",
    dot: "#2563EB",
    bg: "#DBEAFE",
    text: "#1D4ED8",
  },
  RECEIVED: {
    label: "Received",
    dot: "#7C3AED",
    bg: "#EDE9FE",
    text: "#6D28D9",
  },
  SHIPPED: {
    label: "Shipped",
    dot: "#0891B2",
    bg: "#CFFAFE",
    text: "#0E7490",
  },
  REACHEDTOLOCALPARTNER: {
    label: "Reached to Local Partner",
    dot: "#16A34A",
    bg: "#DCFCE7",
    text: "#15803D",
  },
  DELIVERED: {
    label: "Delivered",
    dot: "#16A34A",
    bg: "#DCFCE7",
    text: "#15803D",
  },
  HOLD: {
    label: "On Hold",
    dot: "#D97706",
    bg: "#FEF3C7",
    text: "#B45309",
  },
};

const normalizeOrderStatus = (status?: string): OrderStatus | null => {
  const normalized = status?.replace(/[\s_-]/g, "").toUpperCase();

  return normalized && normalized in STATUS_CONFIG
    ? (normalized as OrderStatus)
    : null;
};

const StatusBadge = ({ status }: { status?: string }) => {
  const normalizedStatus = normalizeOrderStatus(status);
  const config = normalizedStatus
    ? STATUS_CONFIG[normalizedStatus]
    : {
        label: status ?? "Status Pending",
        dot: "#94A3B8",
        bg: "#F1F5F9",
        text: "#64748B",
      };

  return (
    <View
      style={{ backgroundColor: config.bg }}
      className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full w-fit"
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: config.dot,
        }}
      />
      <Text
        className="text-[12px] font-inter-bold w-fit"
        style={{ color: config.text }}
      >
        {config.label}
      </Text>
    </View>
  );
};

const getTimelineStepStatus = (
  item: TimelineItem,
  index: number,
  timeline: TimelineItem[],
  orderStatus?: string,
): StepStatus => {
  const eventText = item?.event?.toUpperCase?.() ?? "";
  const isLast = index === timeline.length - 1;
  const normalizedOrderStatus = normalizeOrderStatus(orderStatus);

  if (
    eventText.includes("HOLD") ||
    (isLast && normalizedOrderStatus === "HOLD")
  ) {
    return "hold";
  }

  return "done";
};

const buildTrackingSteps = (
  timeline: TimelineItem[] = [],
  orderStatus?: string,
): TrackingStep[] =>
  timeline?.map((item, index) => ({
    id: `${index}-${item?.time ?? ""}`,
    label: item?.event ?? "",
    date: item?.time ?? "",
    location: item?.location ?? "",
    status: getTimelineStepStatus(item, index, timeline, orderStatus),
  }));

// ─── Step icon ────────────────────────────────────────────────────────────────

const StepIcon = ({ status }: { status: StepStatus }) => {
  if (status === "done") {
    return (
      <View className="flex flex-row gap-6 pt-2">
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: "#16A34A",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="Check" size={14} color="#fff" />
        </View>
        <View className="h-10 w-10 bg-[#33B06B]/20 rounded-full"></View>
      </View>
    );
  }

  if (status === "hold") {
    return (
      <View className="flex flex-row gap-6 pt-1">
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: "#E0A31D",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Warning triangle drawn with text */}
          <Icon name="Warning" size={20} color="#E0A31D" />
        </View>

        <View className="h-10 w-10 bg-[#F8F1DE] rounded-full"></View>
      </View>
    );
  }

  return (
    <View className="flex flex-row gap-6 pt-1">
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: "#E2E8F0",
          borderWidth: 2,
          borderColor: "#CBD5E1",
        }}
      />
      <View className="h-10 w-10 bg-[#D7D7D7] rounded-full"></View>
    </View>
  );
};

// ─── Connector line between steps ─────────────────────────────────────────────

const StepConnector = ({ fromStatus }: { fromStatus: StepStatus }) => {
  const isDotted = fromStatus === "hold" || fromStatus === "pending";
  const color =
    fromStatus === "done"
      ? "#16A34A"
      : fromStatus === "hold"
        ? "#D97706"
        : "#CBD5E1";

  if (isDotted) {
    return (
      <View style={{ alignItems: "start", width: 32 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View
            key={i}
            style={{
              width: 2,
              height: 5,
              borderRadius: 1,
              backgroundColor: color,
              marginVertical: 1.5,
              marginLeft: 14,
            }}
          />
        ))}
      </View>
    );
  }

  return (
    <View
      style={{
        width: 2,
        height: 28,
        backgroundColor: color,
        marginLeft: 14,
      }}
    />
  );
};

// ─── Single tracking step row ─────────────────────────────────────────────────

const TrackingStepRow = ({
  step,
  isLast,
  onPress,
}: {
  step: TrackingStep;
  isLast: boolean;
  onPress?: () => void;
}) => {
  const isHold = step.status === "hold";
  const isPending = step.status === "pending";

  return (
    <View>
      <View className="flex-row items-start gap-3">
        {/* Icon + connector */}
        <View style={{ alignItems: "flex-start" }}>
          <StepIcon status={step.status} />
          {!isLast && (
            <View style={{ marginTop: 4 }}>
              <StepConnector fromStatus={step.status} />
            </View>
          )}
        </View>

        {/* Text content */}
        <View className="flex-1 pb-4">
          <View className="flex-row items-center gap-2 mb-0.5">
            <Text
              style={{
                color: isHold ? "#D97706" : isPending ? "#94A3B8" : "#0F1729",
              }}
              className="text-csm font-inter-bold"
            >
              {step.label}
            </Text>
          </View>

          <Text
            style={{ color: isPending ? "#CBD5E1" : "#64748B" }}
            className="text-cxs font-inter"
          >
            {step.date}
          </Text>
          <Text
            style={{ color: isPending ? "#CBD5E1" : "#64748B" }}
            className="text-cxs font-inter"
          >
            {step.location}
          </Text>
        </View>

        {/* Arrow for active/hold step */}
        {isHold && (
          <TouchableOpacity onPress={onPress} className="mt-1">
            <Icon name="Arrow" size={18} color="#D97706" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const HoldWarningCard = ({ onPayNow }: { onPayNow: () => void }) => (
  <View
    className="mx-8 mb-5 rounded-[28px] border-[1.5px] px-6 py-7"
    style={{
      backgroundColor: "#FFFCF5",
      borderColor: "#F9D28A",
    }}
  >
    <View
      className="mb-4 items-center justify-center rounded-full border-[2px]"
      style={{
        width: 36,
        height: 36,
        borderColor: "#E8A20C",
      }}
    >
      <Icon name="Warning" size={24} color="#E8A20C" />
    </View>

    <Text className="mb-2 text-csm   font-inter-bold text-black">
      Why is your parcel on hold?
    </Text>

    <Text className="mb-5 text-[12px] font-inter text-black">
      Your parcel is currently on hold due to pending payment. Complete the
      payment to resume shipment processing and continue delivery.
    </Text>

    <TouchableOpacity
      onPress={onPayNow}
      className="flex-row items-center gap-1"
    >
      <Text className="text-csm font-inter-bold text-[#2673DD]">Pay Now</Text>
      <Icon name="Arrow" size={18} color="#2673DD" />
    </TouchableOpacity>
  </View>
);

// ─── Accordion row ─────────────────────────────────────────────────────────────

const AccordionRow = ({ label, onclick }: { label: string; onclick?: any }) => {
  return (
    <View className="bg-white mx-8 rounded-2xl mb-3 overflow-hidden border-[1.5px] border-primary/10">
      <TouchableOpacity
        onPress={() => onclick()}
        className="flex-row justify-between items-center px-5 py-4"
      >
        <Text className="text-cno font-inter-medium text-primary">{label}</Text>
        <View
          style={{
            fontSize: 18,
            color: "#64748B",
            transform: [{ rotate: "0deg" }],
          }}
        >
          <Icon name="Arrow" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const OrderTracking = ({ navigation, route, orderId: orderIdProp }: any) => {
  const [orderDetail, setOrderDetail] = useState(null);
  const orderId = route?.params?.orderId ?? orderIdProp;
  const trackingSteps = buildTrackingSteps(
    orderDetail?.timeline,
    orderDetail?.status,
  );
  const currentStatus = normalizeOrderStatus(orderDetail?.status);

  useEffect(() => {
    const getOrderDetail = async () => {
      if (!orderId) return;

      try {
        const response = await getOrderByIdApiHandler(orderId);

        setOrderDetail(response);
      } catch (error: any) {
        Toast.show({
          type: "error",
          text1:
            typeof error === "string"
              ? error
              : (error?.message ?? "Failed to load order details"),
        });
      }
    };

    getOrderDetail();
  }, [orderId]);
  return (
    <View className="flex-1 bg-BgWhite">
      <View className="pt-14 pb-8 flex flex-col gap-1.5 rounded-b-[40px] items-center bg-primary">
        <Text className="text-white text-[24px] font-space-grotesk-bold">
          Track Shipment
        </Text>
        <Text className="text-white text-csm font-thin w-1/2 text-center">
          Enter tracking number to get real-time updates
        </Text>
      </View>
      <ScrollView className="mb-40">
        <View className="flex-1 mt-6 mb-20">
          {/* Tracking ID + Status */}
          <View className=" px-8 py-4">
            <View className="flex-row justify-between items-start mb-1"></View>
            <View className="flex-col gap-2 justify-between">
              <View>
                <Text className="text-[12px] font-inter-medium text-[#818DA9]">
                  Tracking ID
                </Text>
                <Text
                  numberOfLines={1}
                  className="text-[24px] uppercase font-space-grotesk-bold text-primary"
                >
                  {orderId}
                </Text>
              </View>
            </View>
          </View>
          <View className="px-8">
            <View className="h-0.5 w-full  bg-[#0F1729]/15" />
          </View>

          {/* Tracking History */}
          <View className="px-8 pt-4 pb-2 mb-4">
            <View className="flex flex-row justify-between mb-4">
              <Text className="text-cno font-space-grotesk-bold text-primary mb-4">
                Tracking History
              </Text>
              <View>
                {/* <Text className="text-[12px] font-inter-medium text-[#818DA9]">
                Status
              </Text> */}
                <StatusBadge status={orderDetail?.status} />
              </View>
            </View>

            {trackingSteps.length > 0 ? (
              trackingSteps.map((step, index) => (
                <TrackingStepRow
                  key={step.id}
                  step={step}
                  isLast={index === trackingSteps.length - 1}
                />
              ))
            ) : (
              <Text className="text-csm font-inter text-primary/50">
                No tracking history available.
              </Text>
            )}
          </View>

          {currentStatus === "HOLD" && (
            <HoldWarningCard
              onPayNow={() =>
                navigation.push("DetailsAndPayment", { orderId: orderId })
              }
            />
          )}

          {/* Accordions */}
          {/* <AccordionRow
            label="Address"
            onclick={() =>
              navigation.push("PackageDetails", {
                orderId: orderId,
                showCheckOut: false,
              })
            }
          /> */}
          <AccordionRow
            onclick={() =>
              navigation.push("PackageDetails", {
                orderId: orderId,
                showCheckOut: false,
              })
            }
            label="Package Details"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderTracking;
