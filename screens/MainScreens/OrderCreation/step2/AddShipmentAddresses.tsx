import LocationBox from "@/assets/images/LocationBox.png";
import Truck from "@/assets/images/Truck.png";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import { SHIPMENT_TYPE } from "@/constants/enums";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TOTAL_STEP = 4;

const SAVED_ADDRESSES = [
  {
    id: "1",
    name: "14 Baker Street",
    detail: "Marylebone, London W1U 3BW, 654321\nUnited Kingdom",
  },
  {
    id: "2",
    name: "14 Baker Street",
    detail: "Marylebone, London W1U 3BW, 654321\nUnited Kingdom",
  },
];

const AddShipmentAddresses = ({ navigation, route }: any) => {
  const [step, setStep] = useState(2);
  const ShipmentType: SHIPMENT_TYPE = route?.params?.ShipmentType ?? null;
  const IsDropAt = ShipmentType == SHIPMENT_TYPE.DROP_AT_WAREHOUSE;

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressModalTarget, setAddressModalTarget] = useState<
    "pickup" | "delivery"
  >("pickup");
  const [selectedPickupAddress, setSelectedPickupAddress] = useState<
    (typeof SAVED_ADDRESSES)[0] | null
  >(null);
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState<
    (typeof SAVED_ADDRESSES)[0] | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");

  const slideAnim = useRef(new Animated.Value(400)).current;

  const openModal = (target: "pickup" | "delivery") => {
    setAddressModalTarget(target);
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

  const handleSelectAddress = (addr: (typeof SAVED_ADDRESSES)[0]) => {
    if (addressModalTarget === "pickup") {
      setSelectedPickupAddress(addr);
    } else {
      setSelectedDeliveryAddress(addr);
    }
    closeModal();
  };

  const filteredAddresses = SAVED_ADDRESSES.filter(
    (a) =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.detail.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handelSubmit = (type: any) => {
    navigation.push("ConfirmAddressScreen");
  };

  const handelAddNEwAdd = () => {
    navigation.push("AddNewAddress");
  };

  return (
    <ScreenWrapper KeyboardAvoiding={false}>
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
            maxHeight: "85%",
          }}
        >
          {/* Drag handle */}
          <View className="items-center pt-3 pb-4">
            <View className="w-10 h-1 rounded-full bg-primary/20" />
          </View>

          {/* Title */}
          <Text
            className="text-csl font-space-grotesk-bold text-primary text-center pb-5"
            style={{ textDecorationLine: "underline" }}
          >
            Select Location
          </Text>

          {/* Search bar */}
          <View className="mx-6 mb-4 flex flex-row items-center px-4 py-3 bg-white border-[2px] border-primary/10 rounded-2xl gap-3">
            <Feather name="search" size={18} color="#0F172966" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search Locations ..."
              placeholderTextColor="#0F172966"
              className="flex-1 text-csm font-inter text-primary"
            />
          </View>

          {/* Add Address row */}
          <TouchableOpacity
            onPress={handelAddNEwAdd}
            className="mx-6 mb-2 flex flex-row items-center gap-3 py-3"
          >
            <Feather name="plus" size={20} color="#0F1729" />
            <Text className="text-cno font-inter-medium text-primary">
              Add Address
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="mx-6 h-[1px] bg-primary/10 mb-2" />

          {/* Address list */}
          <ScrollView showsVerticalScrollIndicator={false} className="mx-6">
            {filteredAddresses.map((addr) => (
              <TouchableOpacity
                key={addr.id}
                onPress={() => handleSelectAddress(addr)}
                className="flex flex-row items-center gap-4 py-4 border-b border-primary/5"
              >
                <View className="w-10 h-10 rounded-full bg-[#BFCDDE]/30 items-center justify-center flex-shrink-0">
                  <Ionicons name="location" size={18} color="#0F1729" />
                </View>
                <View className="flex-1">
                  <Text className="text-cno font-inter-medium text-primary">
                    {addr.name}
                  </Text>
                  <Text className="text-csm font-inter text-primary/50 mt-0.5">
                    {addr.detail}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
                className="flex flex-row items-center gap-4 px-5 py-4 bg-white border-[2px] border-primary/10 rounded-2xl mb-4"
                activeOpacity={0.7}
              >
                <View className="w-16 h-16 rounded-full bg-[#E2EBF6] items-center justify-center flex-shrink-0">
                  <Image
                    className="w-12 h-12 flex items-start bg-cover"
                    source={LocationBox}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-csm font-inter-bold text-primary">
                    Add Pickup Address{" "}
                  </Text>
                  <View className="h-0.5 my-1 w-full bg-primary/10" />
                  <Text
                    className="text-csm font-inter text-primary/80 mt-0.5"
                    numberOfLines={1}
                  >
                    {selectedPickupAddress
                      ? selectedPickupAddress.name +
                        ", " +
                        selectedPickupAddress.detail.replace("\n", " ")
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
              className="flex flex-row items-center gap-4 px-5 py-4 bg-white border-[2px] border-primary/10 rounded-2xl mb-4"
              activeOpacity={0.7}
            >
              <View className="w-16 h-16 rounded-full bg-[#E2EBF6] items-center justify-center flex-shrink-0">
                <Image
                  className="w-12 h-12 flex items-start bg-cover"
                  source={Truck}
                />
              </View>
              <View className="flex-1">
                <Text className="text-csm font-inter-bold text-primary">
                  Delivery Address
                </Text>
                <View className="h-0.5 my-1 w-full bg-primary/10" />
                <Text
                  className="text-csm font-inter text-primary/80 mt-0.5"
                  numberOfLines={1}
                >
                  {selectedDeliveryAddress
                    ? selectedDeliveryAddress.name +
                      ", " +
                      selectedDeliveryAddress.detail.replace("\n", " ")
                    : "Select Delivery Location"}
                </Text>
              </View>
              <View className="h-10 w-10 rounded-full pl-1 flex justify-center items-center bg-[#CBD5E1]">
                <Feather name="chevron-right" size={28} color="#0F1729" />
              </View>
            </TouchableOpacity>
          </View>

          <View className="mt-auto">
            <Button text="Continue " action={handelSubmit} />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default AddShipmentAddresses;
