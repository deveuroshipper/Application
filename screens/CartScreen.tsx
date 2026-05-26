import Icon from "@/assets/icons";
import EmptyCart from "@/assets/images/EmptyCart.png";
import arrow from "@/assets/images/arrow.png";
import largeBox from "@/assets/images/boxes/largeBox.png";
import BackButton from "@/components/BackButton";
import Button, { Size, Variant } from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type CartItem = {
  id: string;
  orderId: string;
  size: string;
  maxWeight: string;
  maxSize: string;
  price: string;
  fromCountry: string;
  fromFlag: string;
  toCountry: string;
  toFlag: string;
};

const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: "1",
    orderId: "#58588",
    size: "Small",
    maxWeight: "3 KG",
    maxSize: "34 X 32 X 10cm",
    price: "$360.00",
    fromCountry: "UK",
    fromFlag: "🇬🇧",
    toCountry: "Belgium",
    toFlag: "🇧🇪",
  },
  {
    id: "2",
    orderId: "#58588",
    size: "Small",
    maxWeight: "3 KG",
    maxSize: "34 X 32 X 10cm",
    price: "$360.00",
    fromCountry: "UK",
    fromFlag: "🇬🇧",
    toCountry: "Belgium",
    toFlag: "🇧🇪",
  },
  {
    id: "3",
    orderId: "#58588",
    size: "Small",
    maxWeight: "3 KG",
    maxSize: "34 X 32 X 10cm",
    price: "$360.00",
    fromCountry: "UK",
    fromFlag: "🇬🇧",
    toCountry: "Belgium",
    toFlag: "🇧🇪",
  },
];

const CartItemCard = ({
  item,
  isSelected,
  onToggle,
  onDelete,
  onCheckout,
  onViewDetails,
}: {
  item: CartItem;
  isSelected: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onCheckout: () => void;
  onViewDetails: () => void;
}) => {
  return (
    <View
      className="bg-white rounded-2xl p-4 mb-6"
      style={{
        shadowColor: "rgba(0, 0, 0, 0.15)",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 6,
      }}
    >
      {/* Top Row: Checkbox + Box Image + Details + Trash */}
      <View className="flex-row items-start gap-3">
        {/* Checkbox */}
        <TouchableOpacity
          onPress={onToggle}
          className="mt-1 absolute z-10 "
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: isSelected ? "#0F1729" : "#CBD5E1",
            backgroundColor: isSelected ? "#0F1729" : "transparent",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isSelected && <Icon name="Check" size={12} color="#FFFFFF" />}
        </TouchableOpacity>

        {/* Box Image */}
        <View className="mt-auto flex items-center">
          <Image source={largeBox} resizeMode="contain" className="w-24" />
          <Text className="text-csm font-inter-bold text-primary">
            {item.price}
          </Text>
        </View>

        {/* Order Details */}
        <View className="flex-1 gap-2 flex flex-col justify-between ">
          <Text className="text-csm font-inter-bold text-primary">
            Order Id :{item.orderId}
          </Text>
          <View className="flex flex-col gap-1.5">
            <Text className="text-[13px] font-inter text-primary">
              Size: {item.size}
            </Text>
            <Text className="text-[13px] font-inter text-primary">
              Max Weight: {item.maxWeight}
            </Text>

            <Text className="text-[13px] font-inter text-primary">
              Max Size: {item.maxSize}
            </Text>
          </View>
        </View>

        {/* Trash Icon */}
        <TouchableOpacity
          onPress={onDelete}
          className="p-1"
          style={{
            borderWidth: 1,
            borderColor: "#D3D8E7",
            borderRadius: 8,
            padding: 6,
          }}
        >
          <Icon name="Trash" size={20} color="#334155" />
        </TouchableOpacity>
      </View>

      {/* Route Row */}
      <View className="flex-row justify-between px-4 border-none border-t-[1.5px] border-b-[1.5px] py-2.5 border-[#B5C3E8]/30 items-center gap-2 mt-3 mb-3">
        {/* From */}
        <View className="flex-row items-center gap-3">
          <Image
            source={{ uri: "https://flagcdn.com/w80/gb.png" }}
            className="w-11 h-8 rounded-md"
          />
          <Text className="text-csm font-inter-bold text-primary">
            {item.fromCountry}
          </Text>
        </View>

        <Image source={arrow} className="w-16" />

        <View className="flex-row items-center gap-3">
          <Image
            source={{ uri: "https://flagcdn.com/w80/be.png" }}
            className="w-11 h-8 rounded-md"
          />
          <Text className="text-csm font-inter-bold text-primary">
            {item.toCountry}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button
            text="Checkout"
            action={onCheckout}
            frontIcon={null}
            size={Size.SMALL}
          />
        </View>
        <View className="flex-1">
          <Button
            text="View All Details"
            action={onViewDetails}
            frontIcon={null}
            variant={Variant.OUTLINE}
            size={Size.SMALL}
          />
        </View>
      </View>
    </View>
  );
};

const DeleteModal = ({
  visible,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <Modal
    transparent
    animationType="fade"
    visible={visible}
    onRequestClose={onCancel}
  >
    <View
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      className="flex-1 justify-center items-center px-6"
    >
      <View className="bg-white w-full rounded-3xl p-6">
        {/* Close button */}
        <TouchableOpacity
          onPress={onCancel}
          className="absolute top-4 right-4 p-1"
        >
          <Text style={{ fontSize: 18, color: "#64748B" }}>✕</Text>
        </TouchableOpacity>

        {/* Trash icon circle */}
        <View className="items-center mb-4 mt-2">
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: "#FEE2E2",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon name="Trash" size={26} color="#EF4444" />
          </View>
        </View>

        {/* Title */}
        <Text className="text-cmd font-space-grotesk-bold text-primary text-center mb-2">
          Remove This Shipment?
        </Text>

        {/* Description */}
        <Text className="text-csm font-inter text-primary/50 text-center mb-6">
          This item will be removed from your cart and won't be included in
          checkout.
        </Text>

        <TouchableOpacity
          onPress={onConfirm}
          className="w-full flex h-14  rounded-lg bg-[#D92D20]  flex-row gap-4 justify-center items-center"
        >
          <Text className="text-cno text-white font-inter-bold">Delete</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onConfirm}
          className="w-full mt-4 flex h-14 border-[1.5px] rounded-lg border-[#0F1729]/10 flex-row gap-4 justify-center items-center"
        >
          <Text className="text-cno text-[#0F1729] font-inter-bold">
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const CartScreen = ({ navigation }: any) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(MOCK_CART_ITEMS);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const IsEmpty = cartItems.length === 0;

  const handleToggleSelect = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDeletePress = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTargetId) return;
    setCartItems((prev) => prev.filter((item) => item.id !== deleteTargetId));
    setSelectedItems((prev) => {
      const next = new Set(prev);
      next.delete(deleteTargetId);
      return next;
    });
    setDeleteTargetId(null);
  };

  const handleDeleteCancel = () => {
    setDeleteTargetId(null);
  };

  const handleCheckout = () => {};
  const handleViewDetails = () => {};
  const handleCreateOrder = () => {};

  return (
    <ScreenWrapper KeyboardAvoiding={false}>
      <View className="flex-1  pb-6">
        {/* Header */}
        <View className="flex flex-row items-center mb-4 px-8">
          <BackButton navigation={navigation} />
          {/* <Text className="text-cmd font-space-grotesk-bold text-primary ml-3">
            Cart
          </Text> */}
        </View>

        {/* Content */}
        {IsEmpty ? (
          <View className="flex-1 px-8 justify-center items-center gap-6">
            {/* Empty Illustration */}
            <View className="w-full h-fit rounded-2xl overflow-hidden">
              <Image
                source={EmptyCart}
                className="w-full rounded-3xl"
                resizeMode="contain"
              />
            </View>

            {/* Text */}
            <View className="items-center gap-2">
              <Text className="text-cmd font-space-grotesk-bold text-primary text-center">
                Your Shipment Cart is Empty
              </Text>
              <Text className="text-csm font-inter text-primary/50 text-center">
                Looks like you haven't added any shipments yet. Create a
                shipment to get started.
              </Text>
            </View>
            <Button
              frontIcon={<Icon name="Plus" color="#FFFF" size={18} />}
              text="Create Order"
              action={handleCreateOrder}
            />
          </View>
        ) : (
          <>
            {/* Delete Confirmation Modal */}
            <DeleteModal
              visible={deleteTargetId !== null}
              onConfirm={handleDeleteConfirm}
              onCancel={handleDeleteCancel}
            />

            {/* Cart Items List */}
            <ScrollView
              className="px-8"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 16 }}
            >
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.has(item.id)}
                  onToggle={() => handleToggleSelect(item.id)}
                  onDelete={() => handleDeletePress(item.id)}
                  onCheckout={handleCheckout}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </ScrollView>

            {/* Bottom Checkout Button */}
            <View className="pt-2 px-8">
              <Button
                text="Checkout"
                action={handleCheckout}
                frontIcon={null}
              />
            </View>
          </>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default CartScreen;
