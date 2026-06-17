import EmptyAddress from "@/assets/images/emptyAddress.png";
import LocationBox from "@/assets/images/LocationBox.png";
import Truck from "@/assets/images/Truck.png";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import { SHIPMENT_TYPE } from "@/constants/enums";
import { getAddressApiHandler, getRoutesByIdApiHandler } from "@/helper/Api";
import { useAddressStore } from "@/store/useAddress";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

type Address = {
  id: string;
  fullName: string;
  number: string;
  addressLine: string;
  state: string;
  city: string;
  country: string;
};

type RouteDetails = {
  originName: string;
  destinationName: string;
};

const TOTAL_STEP = 4;

const AddShipmentAddresses = ({ navigation, route }: any) => {
  const [step, setStep] = useState(2);
  const ShipmentType: SHIPMENT_TYPE = route?.params?.ShipmentType ?? null;
  const refreshAddress = route?.params?.refreshAddress ?? null;

  const IsDropAt = ShipmentType == SHIPMENT_TYPE.DROP_AT_WAREHOUSE;

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressModalTarget, setAddressModalTarget] = useState<
    "pickup" | "delivery"
  >("pickup");
  const [selectedPickupAddress, setSelectedPickupAddress] =
    useState<Address | null>(null);
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] =
    useState<Address | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddAddressDisabled, setIsAddAddressDisabled] = useState(false);
  const [refreshingAddresses, setRefreshingAddresses] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteDetails | null>(null);

  const slideAnim = useRef(new Animated.Value(400)).current;
  const normalizeCountry = (value?: string | null) =>
    value?.trim().toLowerCase() ?? "";

  useFocusEffect(
    useCallback(() => {
      setIsAddAddressDisabled(false);
    }, []),
  );

  const fetchAddresses = useCallback(async (showFullLoader = true) => {
    if (showFullLoader) setLoadingAddresses(true);
    try {
      const data = await getAddressApiHandler();
      setAddresses(data ?? []);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: typeof error === "string" ? error : "Failed to load addresses.",
      });
    } finally {
      if (showFullLoader) setLoadingAddresses(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses, refreshAddress]);

  const handleRefreshAddresses = async () => {
    setRefreshingAddresses(true);
    await fetchAddresses(false);
    setRefreshingAddresses(false);
  };

  const openModal = (target: "pickup" | "delivery") => {
    setAddressModalTarget(target);
    setSearchQuery("");
    setShowAddressModal(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 400,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setShowAddressModal(false));
  };

  const handleSelectAddress = (addr: Address) => {
    if (addressModalTarget === "pickup") {
      setSelectedPickupAddress(addr);
    } else {
      setSelectedDeliveryAddress(addr);
    }
    closeModal();
  };

  const excludedSelectedAddress =
    addressModalTarget === "pickup"
      ? selectedDeliveryAddress
      : selectedPickupAddress;

  const targetCountry =
    addressModalTarget === "pickup"
      ? selectedRoute?.originName
      : selectedRoute?.destinationName;

  const filteredAddresses = addresses.filter((a) => {
    const matchesRouteCountry =
      normalizeCountry(a.country) === normalizeCountry(targetCountry);
    const matchesSearch =
      a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.addressLine.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      matchesRouteCountry && a.id !== excludedSelectedAddress?.id && matchesSearch
    );
  });

  const handelSubmit = (type: any) => {
    useAddressStore.getState().setDeliverAddress(selectedDeliveryAddress);
    useAddressStore.getState().setPickupAddress(selectedPickupAddress);

    navigation.push("ConfirmAddressScreen");
  };

  const handelAddNEwAdd = () => {
    if (isAddAddressDisabled) return;
    setIsAddAddressDisabled(true);
    navigation.push("AddNewAddress");
  };

  const getRoute = useCallback(async () => {
    try {
      const response = await getRoutesByIdApiHandler(
        useAddressStore.getState()?.route,
      );
      setSelectedRoute(response ?? null);
    } catch (error) {
      console.log("error : ", error);
    }
  }, []);

  useEffect(() => {
    getRoute();
  }, [getRoute]);

  return (
    <ScreenWrapper>
      {/* Address Select Bottom Sheet Modal */}
      <Modal
        visible={showAddressModal}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(15,23,41,0.4)" }}
          onPress={closeModal}
        />
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#F8FAFC",
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingBottom: 36,
            minHeight: "80%",
          }}
        >
          {/* Drag handle */}
          <View className="items-center pt-3 pb-4">
            <View className="w-10 h-1 rounded-full bg-primary/20" />
          </View>

          {/* Title */}
          <Text className="text-csl font-space-grotesk-bold text-primary text-center pb-5">
            Select Location
          </Text>

          {/* Search bar */}
          <View className="mx-6 mb-4 flex flex-row items-center px-4 py-2 bg-white border-[2px] border-[#B5C3E84D]/30 rounded-2xl gap-3">
            <Feather name="search" size={24} color="#0F172966" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search Locations ..."
              placeholderTextColor="#0F172966"
              className="flex-1 text-cno font-inter text-primary"
            />
          </View>
          <View className="mx-6 mt-4  h-[1.5px] bg-[#B5C3E84D]/30 mb-2" />
          {/* Add Address row */}
          <TouchableOpacity
            onPress={handelAddNEwAdd}
            disabled={isAddAddressDisabled}
            className="mx-6 mb-2 flex flex-row items-center gap-3 px-4 py-3"
            style={{ opacity: isAddAddressDisabled ? 0.5 : 1 }}
          >
            <Feather name="plus" size={20} color="#0F1729" />
            <Text className="text-cno font-inter-semibold text-primary">
              Add Address
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="mx-6 h-[1.5px] bg-[#B5C3E84D]/30 mb-2" />

          {/* Address list */}
          {loadingAddresses ? (
            <ActivityIndicator size="large" color="#0F1729" className="mt-4" />
          ) : (
            <View className="mx-6 flex-1">
              <FlatList
                data={filteredAddresses}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                refreshing={refreshingAddresses}
                onRefresh={handleRefreshAddresses}
                contentContainerStyle={{
                  flexGrow: filteredAddresses.length > 0 ? 0 : 1,
                }}
                renderItem={({ item: addr }) => (
                  <TouchableOpacity
                    onPress={() => handleSelectAddress(addr)}
                    className="flex flex-row items-center gap-4 py-4 border-b border-primary/5"
                  >
                    <View className="w-10 h-10 rounded-full bg-[#BFCDDE]/30 items-center justify-center flex-shrink-0">
                      <Ionicons name="location" size={18} color="#0F1729" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-cno font-inter-medium text-primary">
                        {addr.fullName} - {addr.number}
                      </Text>
                      <Text className="text-csm font-inter text-primary/50 mt-0.5">
                        {addr.addressLine}
                      </Text>
                      <Text className="text-csm font-inter text-primary/50 mt-0.5">
                        {addr.city}, {addr.state}, {addr.country}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View className="flex-1 pt-20 gap-1 flex flex-col px-6">
                    <Image
                      className="w-full rounded-lg flex items-start bg-cover"
                      source={EmptyAddress}
                    />
                    <Text className="text-cmd mt-6 font-space-grotesk-bold text-center">
                      No Saved Addresses Yet
                    </Text>
                    <Text className="text-csm font-inter-medium text-center">
                      Add your first pickup or delivery address to get started.
                    </Text>
                  </View>
                }
              />
            </View>
          )}
        </Animated.View>
      </Modal>

      <View className="flex-1 px-8 pb-8">
        <View className="flex flex-row items-center justify-between">
          <BackButton
            navigation={navigation}
            onPress={step > 1 ? () => setStep((prev) => prev - 1) : undefined}
          />
          <View className="px-4 py-1  bg-[#BFCDDE] rounded-full">
            <Text className="text-cno  text-primary font-inter-medium">
              {step}/{TOTAL_STEP}
            </Text>
          </View>
        </View>

        <View className="mt-10 flex flex-col justify-between content-between flex-1">
          <View className="w-full">
            <View className="flex flex-row items-center justify-between gap-2">
              <View>
                <Text className="text-primary font-space-grotesk-bold text-cml leading-[40px]">
                  Add Shipment Addresses
                </Text>
              </View>
            </View>
            <Text className="text-csm mt-2 mb-6 text-primary/60 font-inter">
              Enter pickup and delivery locations to begin creating your
              shipment.
            </Text>

            {!IsDropAt ? (
              <TouchableOpacity
                onPress={() => openModal("pickup")}
                className="flex flex-row items-center gap-4 px-5 py-4 bg-white border-[1.5px] border-[#B5C3E8]/30 rounded-2xl mb-4"
                activeOpacity={0.7}
              >
                <View className="w-16 h-16 rounded-full bg-[#E2EBF6] items-center justify-center flex-shrink-0">
                  <Image
                    className="w-11 h-11 flex items-start bg-cover"
                    source={LocationBox}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-csm font-inter-semibold text-primary">
                    Add Pickup Address{" "}
                  </Text>
                  <View className="h-0.5 my-1 w-full bg-primary/10" />
                  <Text
                    className="text-csm font-inter text-primary/80 mt-0.5"
                    numberOfLines={1}
                  >
                    {selectedPickupAddress
                      ? selectedPickupAddress.fullName +
                        ", " +
                        selectedPickupAddress.addressLine
                      : "Select Pickup Location"}
                  </Text>
                </View>
                <View className="h-10 w-10 rounded-full pl-1 flex justify-center items-center bg-[#CBD5E1]">
                  <Feather name="chevron-right" size={28} color="#0F1729" />
                </View>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              onPress={() => openModal("delivery")}
              className="flex flex-row items-center gap-4 px-5 py-4 bg-white border-[1.5px] border-[#B5C3E8]/30 rounded-2xl mb-4"
              activeOpacity={0.7}
            >
              <View className="w-16 h-16 rounded-full bg-[#E2EBF6] items-center justify-center flex-shrink-0">
                <Image
                  className="w-11 h-11 flex items-start bg-cover"
                  source={Truck}
                />
              </View>
              <View className="flex-1">
                <Text className="text-csm font-inter-semibold text-primary">
                  Delivery Address
                </Text>
                <View className="h-0.5 my-1 w-full bg-primary/10" />
                <Text
                  className="text-csm font-inter text-primary/80 mt-0.5"
                  numberOfLines={1}
                >
                  {selectedDeliveryAddress
                    ? selectedDeliveryAddress.fullName +
                      ", " +
                      selectedDeliveryAddress.addressLine
                    : "Select Delivery Location"}
                </Text>
              </View>
              <View className="h-10 w-10 rounded-full pl-1 flex justify-center items-center bg-[#CBD5E1]">
                <Feather name="chevron-right" size={28} color="#0F1729" />
              </View>
            </TouchableOpacity>
          </View>

          <View className="mt-auto">
            <Button
              text="Continue "
              disabled={
                !selectedDeliveryAddress ||
                (!selectedPickupAddress &&
                  IsDropAt == SHIPMENT_TYPE.DOORSTEP_PICKUP)
              }
              action={handelSubmit}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default AddShipmentAddresses;
