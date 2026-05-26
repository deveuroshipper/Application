import Icon from "@/assets/icons";

import verifiedBox from "@/assets/images/boxes/verifiyedBox.png";
import boxDimension from "@/assets/images/customeboxDimention.png";

import plan from "@/assets/images/plan.png";
import ship from "@/assets/images/ship.png";
import { SHIPMENT_ROUTE } from "@/constants/enums";

const enum SHIPMENT_TYPE {
  DROP_AT_WAREHOUSE,
  DOORSTEP_PICKUP,
}

import { BoxItem } from "@/screens/MainScreens/OrderCreation/step3/Specification";
import React, { useState } from "react";
import { FlatList, Image, Modal, Pressable, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Dropdown from "../Dropdown";
import Input from "../Input";

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
              Max Weight:{" "}
              <Text style={{ fontWeight: "400" }}>{item.weight} KG</Text>
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#1a1a2e" }}>
              Max Size:{" "}
              <Text style={{ fontWeight: "400" }}>{item.maxSize}</Text>
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
}: {
  boxesData: BoxItem;
  selectedBox: any;
  setSelectedBox: any;
  termsConditions: Boolean;
  setTermsConditions: any;
  shipmentType: SHIPMENT_ROUTE;
  setShipmentType: any;
}) => {
  const [infoItem, setInfoItem] = useState<BoxItem | null>(null);
  const [detail, setDetail] = useState({
    weight: "",
    matrix: {
      h: 0,
      w: 0,
      l: 0,
    },
    info: "",
    shipmentType: "",
  });

  return (
    <View className="mb-10 mt-4">
      <Text className="text-csm font-inter-bold text-primary/80 tracking-wider uppercase">
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
              onPress={() => setSelectedBox(item)}
              style={{
                shadowColor: "#E0A31D",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.02,
                shadowRadius: 32,
                elevation: item.id == selectedBox?.id ? 8 : 0,
              }}
              className={`w-44 h-fit relative items-center justify-center rounded-2xl border ${item.id == selectedBox?.id ? "border-gold" : "border-primary/20"} bg-white px-2 py-4`}
            >
              <Pressable
                onPress={() => setInfoItem(item)}
                className="absolute top-2 right-2 z-10"
              >
                <Icon name="Info" size={24} color="#B5B5B5" />
              </Pressable>

              <Image source={item.image} />

              <View>
                <Text
                  className="text-center font-inter-bold text-[12.5px] text-primary"
                  numberOfLines={2}
                >
                  Size: {item.name}
                </Text>
                <Text
                  className="text-center font-inter-medium text-[12px] text-primary"
                  numberOfLines={2}
                >
                  Max Weight: {item.weight} KG
                </Text>
              </View>
            </Pressable>
          )}
        />

        {selectedBox && selectedBox?.custom ? (
          <View>
            <View className="mt-4 w-full rounded-3xl overflow-hidden">
              <Image className="w-full" source={boxDimension} />
            </View>

            <View className="flex flex-col gap-4 mt-6">
              <Input
                label={"Approx Weight"}
                placeholderTxt={"Enter Approx weight"}
                value={detail.weight}
                onChange={(text: string) =>
                  setDetail({ ...detail, weight: text })
                }
              />

              <View>
                <Text className="text-csm uppercase mb-3  text-primary font-inter-medium">
                  Matrix
                </Text>
                <View className="flex flex-row gap-6">
                  <View
                    className={`flex flex-1 gap-2 flex-row px-2 bg-white border-[2.5px] border-primary/10 rounded-2xl font-inter-bold text-cno placeholder:color-primary/30 items-center py-2`}
                  >
                    <TextInput
                      className="flex-1"
                      keyboardType="numeric"
                      value={detail.matrix.h}
                      onChangeText={(e) =>
                        setDetail({
                          ...detail,
                          matrix: { ...detail.matrix, h: Number(e) },
                        })
                      }
                      placeholder={"ex.4in(H)"}
                    />
                  </View>
                  <View
                    className={`flex flex-1 gap-2 flex-row px-3 bg-white border-[2.5px] border-primary/10 rounded-2xl font-inter-bold text-cno placeholder:color-primary/30 items-center py-2`}
                  >
                    <TextInput
                      className="flex-1"
                      keyboardType="numeric"
                      value={detail.matrix.h}
                      onChangeText={(e) =>
                        setDetail({
                          ...detail,
                          matrix: { ...detail.matrix, h: Number(e) },
                        })
                      }
                      placeholder={"ex.4in(H)"}
                    />
                  </View>
                  <View
                    className={`flex flex-1 gap-2 flex-row px-3 bg-white border-[2.5px] border-primary/10 rounded-2xl font-inter-bold text-cno placeholder:color-primary/30 items-center py-2`}
                  >
                    <TextInput
                      className="flex-1"
                      keyboardType="numeric"
                      value={detail.matrix.h}
                      onChangeText={(e) =>
                        setDetail({
                          ...detail,
                          matrix: { ...detail.matrix, h: Number(e) },
                        })
                      }
                      placeholder={"ex.4in(H)"}
                    />
                  </View>
                </View>
              </View>

              <Input
                label={"Additional Information (Additional)"}
                placeholderTxt={"Enter Additional information"}
                value={detail.weight}
                onChange={(text: string) =>
                  setDetail({ ...detail, weight: text })
                }
              />

              <Dropdown
                label="Type of Shipment"
                placeholder="Select"
                value={shipmentType}
                onChange={setShipmentType}
                options={[
                  { label: "Air Freight", value: "air", icon: "Plan" },
                  { label: "Sea Freight", value: "sea", icon: "Ship" },
                ]}
              />

              <Pressable
                onPress={() => setTermsConditions(!termsConditions)}
                className="mt-4 flex flex-row items-center gap-4"
              >
                <View className="h-7 w-7 flex overflow-hidden justify-center items-center rounded-md border-primary/40 border-[1px]">
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
            </View>
          </View>
        ) : (
          <View className="flex flex-col gap-4">
            <Text className="text-csm font-inter-bold text-primary/80 tracking-wider uppercase">
              Type of Shipment
            </Text>
            <View className="flex flex-row gap-4">
              {[SHIPMENT_ROUTE.AIR_FREIGHT, SHIPMENT_ROUTE.SEA_FREIGHT].map(
                (item) => (
                  <Pressable
                    onPress={() => setShipmentType(item)}
                    key={item}
                    style={{
                      shadowColor: "#E0A31D",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.02,
                      shadowRadius: 32,
                      elevation: item == shipmentType ? 6 : 0,
                    }}
                    className={`flex-1 pt-4 h-fit flex flex-col gap-2 relative items-center justify-center rounded-2xl border ${item == shipmentType ? "border-gold" : "border-primary/20"} bg-white px-2 py-4`}
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
                        $595.54
                      </Text>
                      <Text className="px-4 py-2  mt-3 text-csm font-inter-bold rounded-full bg-[#CBD5E1]">
                        5-8 Days
                      </Text>
                    </View>
                  </Pressable>
                ),
              )}
            </View>
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
