import Icon from "@/assets/icons";
import EmptyOrder from "@/assets/images/EmptyOrder.png";
import OrderTracking from "@/components/OrderTracking";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

type OrderStatus =
  | "reached_local"
  | "on_hold"
  | "cancelled"
  | "delivered"
  | "in_transit";

type Order = {
  id: string;
  orderId: string;
  date: string;
  address: string;
  status: OrderStatus;
};

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  reached_local: {
    label: "Reached to Local",
    dot: "#16A34A",
    bg: "#DCFCE7",
    text: "#15803D",
  },
  on_hold: {
    label: "Parcel On Hold",
    dot: "#D97706",
    bg: "#FEF3C7",
    text: "#B45309",
  },
  cancelled: {
    label: "Order Cancelled",
    dot: "#DC2626",
    bg: "#FEE2E2",
    text: "#B91C1C",
  },
  delivered: {
    label: "Delivered",
    dot: "#16A34A",
    bg: "#DCFCE7",
    text: "#15803D",
  },
  in_transit: {
    label: "In Transit",
    dot: "#2563EB",
    bg: "#DBEAFE",
    text: "#1D4ED8",
  },
};

const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    orderId: "#584848",
    date: "18 May, 10:30 AM",
    address: "221B Baker Street, London NW1 6XE, United Kingdom",
    status: "reached_local",
  },
  {
    id: "2",
    orderId: "#584848",
    date: "18 May, 10:30 AM",
    address: "221B Baker Street, London NW1 6XE, United Kingdom",
    status: "on_hold",
  },
  {
    id: "3",
    orderId: "#584848",
    date: "18 May, 10:30 AM",
    address: "221B Baker Street, London NW1 6XE, United Kingdom",
    status: "cancelled",
  },
];

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const config = STATUS_CONFIG[status];
  return (
    <View
      style={{ backgroundColor: config.bg }}
      className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full self-start"
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: config.dot,
        }}
      />
      <Text style={{ color: config.text }} className="text-cxs font-inter-bold">
        {config.label}
      </Text>
    </View>
  );
};
const OrderCard = ({
  order,
  onViewDetails,
  isLast,
}: {
  order: Order;
  onViewDetails: (id: string) => void;
  isLast: boolean;
}) => (
  <View className="py-4 px-6 bg-white rounded-xl">
    {/* Top row: Order ID + Date */}
    <View className="flex-row justify-between items-center mb-1">
      <Text className="text-cno font-inter-bold text-primary">
        Order ID: {order.orderId}
      </Text>
      <Text className="text-[12px] font-inter-medium text-[#55658B]/50">
        {order.date}
      </Text>
    </View>

    {/* Address */}
    <Text className="text-csm font-inter text-[#3F4C6E] mb-3" numberOfLines={2}>
      <Text className="font-inter-bold text-primary/80">Address: </Text>
      {order.address}
    </Text>

    <View className="h-[0.7px] bg-[#BFCDDE]" />

    {/* Status + View All Details */}
    <View className="mt-4 flex-row justify-between items-center">
      <StatusBadge status={order.status} />
      <TouchableOpacity
        onPress={() => onViewDetails(order.id)}
        className="flex-row items-center gap-1"
      >
        <Text className="text-[12px] font-inter-bold text-[#2673DD]">
          View All Details
        </Text>
        <Text className="text-cxs text-[#2673DD]">
          <Icon name="Arrow" size={14} color="#2673DD" />
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);
const TrackShipment = () => {
  const IsEmpty = false;
  const [selectedOrderId, setSelectedOrderId] = useState<String | null>(null);
  const [orderDetail, setOrderDetail] = useState(null);

  const handleViewDetails = (id: string) => {
    setSelectedOrderId(id);
  };
  return (
    <View className="flex-1 bg-BgWhite">
      {/* Header */}
      <View className="pt-14 pb-8 flex flex-col gap-1.5 rounded-b-[40px] items-center bg-primary">
        <Text className="text-white text-[24px] font-space-grotesk-bold">
          Track Shipment
        </Text>
        <Text className="text-white text-csm font-thin w-1/2 text-center">
          Enter tracking number to get real-time updates
        </Text>
      </View>

      {/* Content */}
      {IsEmpty ? (
        <View className="flex-1 justify-center items-center gap-6">
          {/* Empty Illustration */}
          <View className="w-full h-fit rounded-2xl overflow-hidden">
            <Image
              source={EmptyOrder}
              className="w-full rounded-3xl"
              resizeMode="contain"
            />
          </View>

          {/* Text */}
          <View className="items-center gap-2 w-2/3">
            <Text className="text-csl font-space-grotesk-bold text-primary text-center">
              No active shipments yet
            </Text>
            <Text className="text-csm font-inter text-primary/50 text-center">
              Track your shipment by entering the tracking number above.
            </Text>
          </View>
        </View>
      ) : (
        <View className="flex-1 ">
          {selectedOrderId ? (
            <OrderTracking orderId={selectedOrderId} />
          ) : (
            <View className="mt-8">
              <Text className="px-8 mb-4 text-cno font-inter-bold text-primary tracking-wider">
                Tracking History
              </Text>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
              >
                {/* Tracking History card */}

                <View className="px-8 flex flex-col gap-6">
                  {MOCK_ORDERS.map((order, index) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      onViewDetails={handleViewDetails}
                      isLast={index === MOCK_ORDERS.length - 1}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default TrackShipment;
