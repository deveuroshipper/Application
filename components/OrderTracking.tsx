import Icon from "@/assets/icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// ─── Types ────────────────────────────────────────────────────────────────────

type StepStatus = "done" | "active" | "hold" | "pending";

type TrackingStep = {
  id: string;
  label: string;
  date: string;
  location: string;
  status: StepStatus;
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const TRACKING_STEPS: TrackingStep[] = [
  {
    id: "1",
    label: "Placed",
    date: "20 May 2026, 09:30AM",
    location: "Manchester, United Kingdom",
    status: "done",
  },
  {
    id: "2",
    label: "Shipped",
    date: "20 May 2026, 09:30AM",
    location: "Manchester, United Kingdom",
    status: "done",
  },
  {
    id: "3",
    label: "In Transit",
    date: "20 May 2026, 09:30AM",
    location: "Manchester, United Kingdom",
    status: "hold",
  },
  {
    id: "4",
    label: "Delivered",
    date: "20 May 2026, 09:30AM",
    location: "Manchester, United Kingdom",
    status: "pending",
  },
];

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

            {/* ON HOLD badge */}
            {isHold && (
              <View
                style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: 4,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                }}
              >
                <Text
                  style={{ color: "#D97706", fontSize: 9 }}
                  className="font-inter-bold"
                >
                  ON HOLD
                </Text>
              </View>
            )}
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
            <Icon name="NextArrow" size={18} color="#D97706" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// ─── On-hold info card ─────────────────────────────────────────────────────────

const OnHoldCard = ({ onPayNow }: { onPayNow: () => void }) => (
  <View
    style={{ backgroundColor: "#FFFBEB", borderRadius: 16, padding: 16 }}
    className="mb-4 mx-8"
  >
    <View className="flex-row items-start gap-3">
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: "#FEF3C7",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 16 }}>⚠️</Text>
      </View>

      <View className="flex-1">
        <Text className="text-csm font-space-grotesk-bold text-primary mb-1">
          Why is your parcel on hold?
        </Text>
        <Text className="text-cxs font-inter text-primary/60 mb-3">
          Your parcel is currently on hold due to pending payment. Complete the
          payment to resume shipment processing and continue delivery.
        </Text>
        <TouchableOpacity
          onPress={onPayNow}
          className="flex-row items-center gap-1"
        >
          <Text className="text-csm font-inter-bold text-lightBlue">
            Pay Now
          </Text>
          <Icon name="NextArrow" size={13} color="#5CA6DA" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

// ─── Accordion row ─────────────────────────────────────────────────────────────

const AccordionRow = ({
  label,
  children,
}: {
  label: string;
  children?: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <View
      className="bg-white mx-8 rounded-2xl mb-3 overflow-hidden"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <TouchableOpacity
        onPress={() => setOpen((v) => !v)}
        className="flex-row justify-between items-center px-5 py-4"
      >
        <Text className="text-csm font-space-grotesk-bold text-primary">
          {label}
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: "#64748B",
            transform: [{ rotate: open ? "180deg" : "0deg" }],
          }}
        >
          ⌄
        </Text>
      </TouchableOpacity>

      {open && children && <View className="px-5 pb-4">{children}</View>}
    </View>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const OrderTracking = ({
  trackingId = "TRK123456",
  status = "Packed",
  hasHold = true,
  onPayNow,
}: {
  trackingId?: string;
  status?: string;
  hasHold?: boolean;
  onPayNow?: () => void;
}) => {
  return (
    <ScrollView>
      <View className="flex-1 mt-6 mb-10">
        {/* Tracking ID + Status */}
        <View className=" px-8 py-4">
          <View className="flex-row justify-between items-start mb-1">
            <Text className="text-[12px] font-inter-medium text-[#818DA9]">
              Tracking ID
            </Text>
            <Text className="text-[12px] font-inter-medium text-[#818DA9]">
              Status
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-[24px] font-space-grotesk-bold text-primary">
              {trackingId}
            </Text>
            {/* Status badge */}
            <View
              style={{ backgroundColor: "#DCFCE7" }}
              className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#16A34A",
                }}
              />
              <Text
                className="text-[12px] font-inter-bold"
                style={{ color: "#15803D" }}
              >
                {status}
              </Text>
            </View>
          </View>
        </View>
        <View className="px-8">
          <View className="h-0.5 w-full  bg-[#0F1729]/15" />
        </View>

        {/* Tracking History */}
        <View className="px-8 pt-4 pb-2 mb-4">
          <Text className="text-cno font-space-grotesk-bold text-primary mb-4">
            Tracking History
          </Text>

          {TRACKING_STEPS.map((step, index) => (
            <TrackingStepRow
              key={step.id}
              step={step}
              isLast={index === TRACKING_STEPS.length - 1}
            />
          ))}
        </View>

        {/* On-hold info card */}
        {hasHold && <OnHoldCard onPayNow={onPayNow ?? (() => {})} />}

        {/* Accordions */}
        <AccordionRow label="Address" />
        <AccordionRow label="Package Details" />
      </View>
    </ScrollView>
  );
};

export default OrderTracking;
