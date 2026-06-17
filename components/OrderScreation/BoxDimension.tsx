import Icon from "@/assets/icons";

import verifiedBox from "@/assets/images/boxes/verifiyedBox.png";

import plan from "@/assets/images/plan.png";
import ship from "@/assets/images/ship.png";
import { SHIPMENT_ROUTE } from "@/constants/enums";
import { BoxItem } from "@/screens/MainScreens/OrderCreation/step3/Specification";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import Dropdown from "../Dropdown";
import Input from "../Input";

const enum SHIPMENT_TYPE {
  DROP_AT_WAREHOUSE,
  DOORSTEP_PICKUP,
}

export const IMAGE_URL = process.env.EXPO_PUBLIC_IMAGE_URL;

const BoxInfoModal = ({
  item,
  onClose,
  onContinue,
}: {
  item: BoxItem;
  onClose: () => void;
  onContinue: () => void;
}) => (
  <Modal transparent animationType="fade" onRequestClose={onClose}>
    <Pressable
      onPress={onClose}
      style={{
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
      }}
    >
      <Pressable
        onPress={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 24,
          paddingBottom: 36,
        }}
      >
        {/* Close button */}
        <Pressable
          onPress={onClose}
          style={{ position: "absolute", top: 16, right: 16, zIndex: 10 }}
        >
          <Text style={{ fontSize: 20, color: "#888", fontWeight: "600" }}>
            ✕
          </Text>
        </Pressable>

        {/* Image + details row */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            marginTop: 8,
          }}
        >
          <Image
            source={verifiedBox}
            style={{ width: 90, height: 90 }}
            resizeMode="contain"
          />
          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#1a1a2e" }}>
              Size: {item.name}
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#1a1a2e" }}>
              Max Weight:
              <Text style={{ fontWeight: "600" }}>{item.weight} KG</Text>
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#1a1a2e" }}>
              Max Size:{" "}
              <Text style={{ fontWeight: "600", opacity: 0.2 }}>
                {item?.height} X {item?.width} X {item?.length}cm
              </Text>
            </Text>
          </View>
        </View>

        {/* Secure delivery banner */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            backgroundColor: "#f0f2f8",
            borderRadius: 12,
            padding: 14,
            marginTop: 20,
          }}
        >
          <Icon name="Shield" size={28} color="#1a1a2e" />
          <Text
            style={{
              flex: 1,
              fontSize: 14,
              fontWeight: "700",
              color: "#1a1a2e",
            }}
          >
            Secure Delivery, With Extra Care for Every Shipment.
          </Text>
        </View>

        {/* Description */}
        <Text
          style={{ fontSize: 13, color: "#444", lineHeight: 20, marginTop: 16 }}
        >
          EURO SHIPPER provides secure, reliable, and efficient shipping for
          packages of all sizes. To ensure safe transit and protect your items,
          liquid shipments are currently not allowed.
        </Text>
        <Text
          style={{ fontSize: 13, color: "#444", lineHeight: 20, marginTop: 10 }}
        >
          From electronics and apparel to documents and gifts, we deliver your
          shipments with care, speed, and confidence. Our support team is always
          here to help whenever you need assistance.
        </Text>

        {/* Continue button */}
        <Pressable
          onPress={onContinue}
          style={{
            backgroundColor: "#1a1a2e",
            borderRadius: 14,
            paddingVertical: 16,
            marginTop: 24,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
            Continue
          </Text>
        </Pressable>
      </Pressable>
    </Pressable>
  </Modal>
);

const BoxDimension = ({
  boxesData,
  selectedBox,
  setSelectedBox,
  termsConditions,
  setTermsConditions,
  shipmentType,
  setShipmentType,
  detail,
  setDetail,
  errors = {},
  durations,
}: {
  boxesData: BoxItem;
  selectedBox: any;
  setSelectedBox: any;
  termsConditions: Boolean;
  setTermsConditions: any;
  shipmentType: SHIPMENT_ROUTE | null;
  setShipmentType: any;
  detail: any;
  setDetail: any;
  errors?: {
    selectedBox?: string;
    weight?: string;
    h?: string;
    w?: string;
    l?: string;
    shipmentType?: string;
    termsConditions?: string;
    durations: any;
  };
}) => {
  const [infoItem, setInfoItem] = useState<BoxItem | null>(null);

  const buildIMageUrl = (path: string) => {
    return `${IMAGE_URL}/${path}`;
  };

  return (
    <View className="mb-10 mt-4">
      <Text className="text-csm font-inter-semibold text-[#334155] tracking-wider uppercase">
        Select Weight & Dimension
      </Text>
      <View>
        <FlatList
          data={boxesData}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 12,
            paddingTop: 12,
            paddingBottom: 20,
            paddingRight: 24,
          }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setSelectedBox(item);
                setShipmentType(null);
              }}
              style={{
                shadowColor: "#E0A31D",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.02,
                shadowRadius: 32,
                elevation: item.id == selectedBox?.id ? 8 : 0,
              }}
              className={`w-44 h-fit relative items-center justify-center rounded-2xl border ${item.id == selectedBox?.id ? "border-gold" : "border-primary/20"} bg-white px-2 py-6`}
            >
              <Pressable
                onPress={() => setInfoItem(item)}
                className="absolute top-2 right-2 z-10"
              >
                <Icon name="Info" size={24} color="#B5B5B5" />
              </Pressable>

              <Image
                className=" bg-cover"
                height={80}
                width={120}
                source={
                  item.custom
                    ? item?.image
                    : { uri: buildIMageUrl(item?.boxImage) }
                }
              />

              <View>
                <Text
                  className="text-center font-inter-semibold text-[12.5px] text-primary"
                  numberOfLines={2}
                >
                  Size: {item.name}
                </Text>
                {!item.custom && (
                  <Text
                    className="text-center mt-1 font-inter-medium text-[12px] text-primary"
                    numberOfLines={2}
                  >
                    Max Weight: {item.weight} KG
                  </Text>
                )}
              </View>
            </Pressable>
          )}
        />

        {selectedBox && selectedBox?.custom ? (
          <View>
            <View className="mt-4 w-full rounded-3xl overflow-hidden">
              <Image className="w-full" source={selectedBox?.fullImage} />
            </View>

            <View className="flex flex-col  mt-6">
              <Input
                label={"Approx Weight"}
                keyboardTypes="number-pad"
                placeholderTxt={"Enter Approx weight"}
                value={detail.weight}
                onChange={(text: string) =>
                  setDetail({ ...detail, weight: text })
                }
                error={errors.weight}
              />

              <View className="mb-4">
                <Text className="text-csm uppercase mb-3  text-primary font-inter-medium">
                  Approx Dimensions (H / W / L)
                </Text>
                <View className="flex flex-row gap-6">
                  <View
                    className={`flex flex-1 gap-2 flex-row px-2 bg-white border-[2.5px] ${errors.h ? "border-red-400" : "border-primary/10"} rounded-2xl font-inter-bold text-cno placeholder:color-primary/30 items-center py-2`}
                  >
                    <TextInput
                      className="flex-1 text-primary"
                      keyboardType="numeric"
                      value={detail.matrix.h ? String(detail.matrix.h) : ""}
                      onChangeText={(e) =>
                        setDetail({
                          ...detail,
                          matrix: { ...detail.matrix, h: Number(e) },
                        })
                      }
                      placeholderTextColor={"#CBD5E1"}
                      placeholder={"H (in)"}
                    />
                  </View>
                  <View
                    className={`flex flex-1 gap-2 flex-row px-3 bg-white border-[2.5px] ${errors.w ? "border-red-400" : "border-primary/10"} rounded-2xl font-inter-bold text-cno placeholder:color-primary/30 items-center py-2`}
                  >
                    <TextInput
                      className="flex-1 text-primary"
                      keyboardType="numeric"
                      value={detail.matrix.w ? String(detail.matrix.w) : ""}
                      onChangeText={(e) =>
                        setDetail({
                          ...detail,
                          matrix: { ...detail.matrix, w: Number(e) },
                        })
                      }
                      placeholderTextColor={"#CBD5E1"}
                      placeholder={"W (in)"}
                    />
                  </View>
                  <View
                    className={`flex flex-1 gap-2 flex-row px-3 bg-white border-[2.5px] ${errors.l ? "border-red-400" : "border-primary/10"} rounded-2xl font-inter-bold text-cno placeholder:color-primary/30 items-center py-2`}
                  >
                    <TextInput
                      className="flex-1 text-primary"
                      keyboardType="numeric"
                      value={detail.matrix.l ? String(detail.matrix.l) : ""}
                      onChangeText={(e) =>
                        setDetail({
                          ...detail,
                          matrix: { ...detail.matrix, l: Number(e) },
                        })
                      }
                      placeholderTextColor={"#CBD5E1"}
                      placeholder={"L (in)"}
                    />
                  </View>
                </View>
                {(errors.h || errors.w || errors.l) && (
                  <Text className="text-red-500 text-xs mt-1">
                    {errors.h || errors.w || errors.l}
                  </Text>
                )}
              </View>

              <Input
                label={"Additional Information (Optional)"}
                placeholderTxt={"Enter Additional information"}
                value={detail.info}
                onChange={(text: string) =>
                  setDetail({ ...detail, info: text })
                }
              />

              <Dropdown
                label="Type of Shipment"
                placeholder="Select"
                value={shipmentType}
                onChange={setShipmentType}
                options={
                  selectedBox?.name == "Custom Box"
                    ? [
                        { label: "Air Freight", value: "AIR", icon: "Plan" },
                        { label: "Sea Freight", value: "SHIP", icon: "Ship" },
                      ]
                    : [{ label: "Sea Freight", value: "SHIP", icon: "Ship" }]
                }
              />
              {errors.shipmentType ? (
                <Text className="text-red-500 text-xs -mt-2 mb-2">
                  {errors.shipmentType}
                </Text>
              ) : null}

              <Pressable
                onPress={() => setTermsConditions(!termsConditions)}
                className="mt-4 flex flex-row items-center gap-4"
              >
                <View
                  className={`h-7 w-7 flex overflow-hidden justify-center items-center rounded-md ${errors.termsConditions ? "border-red-400" : "border-primary/40"} border-[1px]`}
                >
                  {termsConditions ? (
                    <View className="h-full w-full flex justify-center items-center bg-primary">
                      <Icon name="Check" size={18} color="#FFFF" />
                    </View>
                  ) : null}
                </View>
                <Text className="text-csm font-inter-semibold text-primary/60">
                  I agree to the{" "}
                  <Text className=" font-inter-bold text-primary">Terms</Text>{" "}
                  and{" "}
                  <Text className=" font-inter-bold text-primary">
                    Conditions
                  </Text>
                </Text>
              </Pressable>
              {errors.termsConditions ? (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.termsConditions}
                </Text>
              ) : null}
            </View>
          </View>
        ) : (
          <View className="flex flex-col gap-4">
            <Text className="text-csm font-inter-semibold text-[#334155] tracking-wider uppercase">
              Type of Shipment
            </Text>
            <View className="flex flex-row gap-4">
              {[SHIPMENT_ROUTE.AIR_FREIGHT, SHIPMENT_ROUTE.SEA_FREIGHT].map(
                (item) => (
                  <Pressable
                    onPress={() =>
                      item == selectedBox?.mode
                        ? setShipmentType(item)
                        : setShipmentType(null)
                    }
                    key={item}
                    style={{
                      shadowColor: "#E0A31D",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.02,
                      shadowRadius: 32,
                      elevation: item == shipmentType ? 6 : 0,
                      opacity: item == selectedBox?.mode ? 1 : 0.4,
                    }}
                    className={`flex-1 pt-4 h-fit flex flex-col gap-2 relative items-center justify-center rounded-2xl border ${item == shipmentType ? "border-gold" : errors.shipmentType ? "border-red-400" : "border-primary/20"} bg-white px-2 py-4`}
                  >
                    <Image
                      source={item == SHIPMENT_ROUTE.AIR_FREIGHT ? plan : ship}
                    />

                    <View className="flex flex-col mt-2">
                      <Text
                        className="text-center uppercase font-inter-bold text-[15px] text-primary"
                        numberOfLines={2}
                      >
                        {item == SHIPMENT_ROUTE.AIR_FREIGHT
                          ? "Air Freight"
                          : "Sea Freight"}
                      </Text>
                      <Text className="text-center font-inter-medium text-[12px] text-primary">
                        {item == SHIPMENT_ROUTE.AIR_FREIGHT
                          ? "Priority Delivery"
                          : "Lower Cost"}
                      </Text>
                      <Text className="text-center mt-3 font-inter-bold text-cno text-primary">
                        {selectedBox?.mode == item
                          ? `$${selectedBox?.price}`
                          : " "}
                      </Text>
                      <Text className="px-4 py-2  mt-3 text-csm text-center font-inter-bold rounded-full bg-[#CBD5E1]">
                        {item == SHIPMENT_ROUTE.AIR_FREIGHT
                          ? durations?.[1]
                          : durations?.[0]}
                      </Text>
                    </View>
                  </Pressable>
                ),
              )}
            </View>
            <Pressable
              onPress={() => setTermsConditions(!termsConditions)}
              className="mt-4 flex flex-row items-center gap-4"
            >
              <View
                className={`h-7 w-7 flex overflow-hidden justify-center items-center rounded-md ${errors.termsConditions ? "border-red-400" : "border-primary/40"} border-[1px]`}
              >
                {termsConditions ? (
                  <View className="h-full w-full flex justify-center items-center bg-primary">
                    <Icon name="Check" size={18} color="#FFFF" />
                  </View>
                ) : null}
              </View>
              <Text className="text-csm text-primary/60">
                I agree to the{" "}
                <Text className=" font-inter-medium text-primary">Terms</Text>{" "}
                and{" "}
                <Text className=" font-inter-medium text-primary">
                  Conditions
                </Text>
              </Text>
            </Pressable>
            {errors.termsConditions ? (
              <Text className="text-red-500 text-xs mt-1">
                {errors.termsConditions}
              </Text>
            ) : null}
            {errors.shipmentType ? (
              <Text className="text-red-500 text-xs -mt-2">
                {errors.shipmentType}
              </Text>
            ) : null}
          </View>
        )}
      </View>

      {infoItem && (
        <BoxInfoModal
          item={infoItem}
          onClose={() => setInfoItem(null)}
          onContinue={() => setInfoItem(null)}
        />
      )}
    </View>
  );
};

export default BoxDimension;
