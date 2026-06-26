import Icon from "@/assets/icons";
import EmptyCart from "@/assets/images/EmptyCart.png";
import arrow from "@/assets/images/arrow.png";
import largeBox from "@/assets/images/boxes/largeBox.png";
import BackButton from "@/components/BackButton";
import Button, { Size, Variant } from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import { removeFromCartApiHandler } from "@/helper/Api";
import { CountryImage } from "@/helper/buildFlagUrl";
import { CartItem, useCartStore } from "@/store/useCartStore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

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
          <View className="flex justify-between flex-row items-center">
            <Text className="text-csm mb-2 font-inter-semibold text-[#334155]">
              Order Id :{" "}
              {item?.shortId
                ? item?.shortId?.toUpperCase()
                : (item.orderid ?? item.orderId ?? item.id)
                    ?.toUpperCase()
                    ?.slice(0, 10)
                    ?.replaceAll("-", "")
                    ?.slice(0, 10) + "..."}
            </Text>
            <TouchableOpacity
              onPress={onDelete}
              className="p-1 w-fit"
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
          <View className="flex flex-col gap-1.5 flex-1">
            <Text className="text-csm font-inter text-[#334155]">
              Size: {item.boxsize?.name}
            </Text>
            <Text className="text-csm font-inter text-[#334155]">
              Max Weight: {item.boxsize?.weight} KG
            </Text>

            <Text className="text-csm font-inter text-[#334155]">
              Max Size: {item.boxsize?.height} X {item.boxsize?.width} X{" "}
              {item.boxsize?.length}cm
            </Text>
          </View>
        </View>
      </View>

      {/* Route Row */}
      <View className="flex-row justify-between px-4 border-none border-t-[1.5px] border-b-[1.5px] py-2.5 border-[#B5C3E8]/30 items-center gap-2 mt-3 mb-3">
        {/* From */}
        <View className="flex-row items-center gap-3">
          <Image
            source={{ uri: CountryImage(item?.shippingRoute?.originName) }}
            className="w-11 h-8 rounded-md"
          />
          <Text className="text-csm font-inter-bold text-primary">
            {item.fromCountry?.originName}
          </Text>
        </View>

        <Image source={arrow} className="w-16" />

        <View className="flex-row items-center gap-3">
          <Image
            source={{ uri: CountryImage(item?.shippingRoute?.destinationName) }}
            className="w-11 h-8 rounded-md"
          />
          <Text className="text-csm font-inter-bold text-primary">
            {item.destinationName}
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
          onPress={onCancel}
          className="w-full mt-4 flex h-14 border-[1.5px] rounded-lg border-[#0F1729]/10 flex-row gap-4 justify-center items-center"
        >
          <Text className="text-cno text-[#0F1729] font-inter-bold">
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const CartScreen = ({ navigation }: any) => {
  const cartItems = useCartStore((state) => state.cartItems);
  const isCartLoading = useCartStore((state) => state.isLoading);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const removeCartItem = useCartStore((state) => state.removeCartItem);
  const [selectedItems, setSelectedItems] = useState<any>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const IsEmpty = cartItems.length === 0;

  const handleToggleSelect = (id: string) => {
    if (selectedItems == id) {
      setSelectedItems(null);
    } else {
      // setSelectedItems([...selectedItems, id]);
      setSelectedItems(id);
    }
  };

  const handleDeletePress = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId || isDeleting) return;

    try {
      setIsDeleting(true);
      await removeFromCartApiHandler(deleteTargetId);
      removeCartItem(deleteTargetId);
      setSelectedItems(null);
      setDeleteTargetId(null);
      Toast.show({
        type: "success",
        text1: "Item removed from cart",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error ?? "Failed to remove item",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteTargetId(null);
  };

  const handleCheckout = (orderId: String) => {
    navigation.push("DetailsAndPayment", {
      orderId: orderId,
    });
  };

  const handelSelectedCheckout = () => {
    navigation.push("DetailsAndPayment", {
      orderId: selectedItems,
    });
  };
  const handleViewDetails = (orderId: String) => {
    navigation.push("PackageDetails", { orderId: orderId });
  };
  const handleCreateOrder = () => {
    navigation.push("ChooseRoute");
  };

  useEffect(() => {
    fetchCart().catch((error: any) => {
      Toast.show({
        type: "error",
        text1: error ?? "Failed to get to items",
      });
    });
  }, [fetchCart]);

 

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
        {isCartLoading && IsEmpty ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#0F1729" />
          </View>
        ) : IsEmpty ? (
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
              {cartItems.map((item, index) => {
                const itemId =
                  item.id ?? item.orderid ?? item.orderId ?? String(index);
                const orderId =
                  item.checkoutId ??
                  item.checkoutId ??
                  item.checkoutId ??
                  itemId;

                return (
                  <CartItemCard
                    key={itemId}
                    item={item}
                    isSelected={selectedItems == orderId}
                    onToggle={() => handleToggleSelect(orderId)}
                    onDelete={() => handleDeletePress(orderId)}
                    onCheckout={() => handleCheckout(orderId)}
                    onViewDetails={() => handleViewDetails(orderId)}
                  />
                );
              })}
            </ScrollView>

            {/* Bottom Checkout Button */}
            <View className="pt-2 px-8">
              <Button
                text="Checkout"
                disabled={!selectedItems}
                action={handelSelectedCheckout}
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
