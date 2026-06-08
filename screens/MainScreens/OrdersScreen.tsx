import Icon from "@/assets/icons";
import EmptyOrder from "@/assets/images/EmptyOrder.png";
import { getOrdersApiHandler } from "@/helper/Api";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

type OrderStatus =
  | "PLACED"
  | "RECEIVED"
  | "SHIPPED"
  | "REACHEDTOLOCALPARTNER"
  | "DELIVERED"
  | "HOLD";

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

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const config = STATUS_CONFIG[status.toUpperCase()] ?? STATUS_CONFIG.PLACED;
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
    <View className="flex-row justify-between items-center mb-1">
      <Text className="text-cno font-inter-bold text-primary">
        Order ID: {order.id.slice(0, 20) + "..."}
      </Text>
      <Text className="text-[12px] font-inter-medium text-[#55658B]/50">
        {order.date}
      </Text>
    </View>

    <View className="text-csm font-inter text-[#3F4C6E] mb-3" numberOfLines={3}>
      <View className="flex flex-row">
        <Text className="font-inter-bold text-primary/80">Address: </Text>
        <Text className="font-inter-medium text-primary/80">
          {`${order?.dropAddress?.fullName} : ${order?.dropAddress?.number}`}
        </Text>
      </View>
      <Text>
        {`${order?.dropAddress?.addressLine} ${order?.dropAddress?.pincode}, ${order?.dropAddress?.state}, ${order?.dropAddress?.country}`}
      </Text>
    </View>

    <View className="h-[0.7px] bg-[#BFCDDE]" />

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

const OrdersScreen = ({ navigation }: any) => {
  const [orders, setOrders] = useState(null);
  const [IsEmpty, setIsEmpty] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleViewDetails = (id: string) => {
    navigation.push("OrderTrackingScreen", { orderId: id });
  };

  const getOrders = async () => {
    try {
      const response = await getOrdersApiHandler();
      
      setOrders(response);
      setIsEmpty((response?.length ?? 0) === 0);
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await getOrders();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      getOrders();
    }, []),
  );
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

      <View className="flex-1 mt-8">
        {!IsEmpty && (
          <Text className="px-8 mb-4 text-cno font-inter-bold text-primary tracking-wider">
            Tracking History
          </Text>
        )}
        <FlatList
          data={orders ?? []}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: IsEmpty ? 1 : 0,
            paddingBottom: 32,
          }}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ItemSeparatorComponent={() => <View className="h-6" />}
          ListEmptyComponent={
            IsEmpty ? (
              <View className="flex-1 justify-center items-center gap-6">
                <View className="w-full h-fit rounded-2xl overflow-hidden">
                  <Image
                    source={EmptyOrder}
                    className="w-full rounded-3xl"
                    resizeMode="contain"
                  />
                </View>

                <View className="items-center gap-2 w-2/3">
                  <Text className="text-csl font-space-grotesk-bold text-primary text-center">
                    No active shipments yet
                  </Text>
                  <Text className="text-csm font-inter text-primary/50 text-center">
                    Track your shipment by entering the tracking number above.
                  </Text>
                </View>
              </View>
            ) : null
          }
          renderItem={({ item, index }) => (
            <View className="px-8">
              <OrderCard
                order={item}
                onViewDetails={handleViewDetails}
                isLast={index === (orders?.length ?? 0) - 1}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default OrdersScreen;
