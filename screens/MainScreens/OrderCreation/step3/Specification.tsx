import CustomBox from "@/assets/images/boxes/CustomBox.png";
import FullContainer from "@/assets/images/boxes/FullContainer.png";
import LessContainer from "@/assets/images/boxes/LessContainer.png";
import boxDimension from "@/assets/images/customeboxDimention.png";
import LessFullContainer from "@/assets/images/fclfullImage.png";
import FullDetailedContainer from "@/assets/images/lclFullImage.png";

import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import BoxDimension from "@/components/OrderScreation/BoxDimension";
import CategoryBox from "@/components/OrderScreation/CategoryBox";
import ScreenWrapper from "@/components/ScreenWrapper";
import { SHIPMENT_TYPE } from "@/constants/enums";
import {
  createOrderApiHandler,
  getBoxesApiHandler,
  getDurationApiHandler,
  submitEnquiryApiHandler,
} from "@/helper/Api";
import { useAddressStore } from "@/store/useAddress";
import { useSpecificationStore } from "@/store/useSpecification";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
const TOTAL_STEP = 4;

export type BoxItem = {
  id: string;
  name: string;
  weight: number;
  image: any;
  maxSize: string;
  custom?: Boolean;
  inquiry?: Boolean;
};

const Specification = ({ navigation, route }: any) => {
  const [step, setStep] = useState(3);
  const [category, setCategory] = useState<String | null>(null);
  const [subCategory, setSubcategory] = useState<String | null>(null);
  const [selectedBox, setSelectedBox] = useState<any | null>(null);
  const [termsConditions, setTermsConditions] = useState(false);
  const [shipmentType, setShipmentType] = useState(null);
  const [boxes, setBoxes] = useState<any>(null);
  const [durations, setDurations] = useState(null);
  const [loading, setLoading] = useState<Boolean>(false);
  const [errors, setErrors] = useState({
    selectedBox: "",
    weight: "",
    h: "",
    w: "",
    l: "",
    shipmentType: "",
    termsConditions: "",
  });
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

  const staticBoxes: BoxItem[] = [
    {
      id: "0004",
      name: "Custom Box",
      weight: 3,
      image: CustomBox,
      fullImage: boxDimension,
      maxSize: "34 X 32 X 10cm",
      custom: true,
      inquiry: true,
    },
    {
      id: "0005",
      name: "Full Container Load (FCL)",
      weight: 3,
      image: FullContainer,
      fullImage: FullDetailedContainer,
      maxSize: "34 X 32 X 10cm",
      custom: true,
      inquiry: true,
    },
    {
      id: "0006",
      name: "Less than Container Load (LCL)",
      weight: 3,
      image: LessContainer,
      fullImage: LessFullContainer,
      maxSize: "34 X 32 X 10cm",
      custom: true,
      inquiry: true,
    },
  ];

  const handelSetCategory = (categoryId: string | null) => {
    useSpecificationStore.getState().setCategory(categoryId);
    setCategory(categoryId);
  };
  const handelSetSubCategory = (categoryId: string | null) => {
    useSpecificationStore.getState().setSubcategory(categoryId);
    setSubcategory(categoryId);
  };

  const handelSelectBox = (box: any) => {
    useSpecificationStore.getState().setBox(box?.id);
    setSelectedBox(box);
    if (errors.selectedBox) setErrors((e) => ({ ...e, selectedBox: "" }));
  };

  const validate = (): boolean => {
    const newErrors = {
      selectedBox: "",
      weight: "",
      h: "",
      w: "",
      l: "",
      shipmentType: "",
      termsConditions: "",
    };

    if (!selectedBox) {
      newErrors.selectedBox = "Please select a box.";
    } else if (selectedBox.inquiry) {
      if (!detail.weight.trim())
        newErrors.weight = "Approx weight is required.";
      if (!detail.matrix.h) newErrors.h = "Height is required.";
      if (!detail.matrix.w) newErrors.w = "Width is required.";
      if (!detail.matrix.l) newErrors.l = "Length is required.";
      if (!detail.shipmentType)
        newErrors.shipmentType = "Please select a shipment type.";
      if (!termsConditions)
        newErrors.termsConditions = "You must agree to Terms and Conditions.";
    } else {
      if (!shipmentType)
        newErrors.shipmentType = "Please select a shipment type.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((v) => !v);
  };

  const checkIsDisabled = (): boolean => {
    if (!category) return true;
    if (!subCategory) return true;
    if (!selectedBox) return true;
    if (!termsConditions) return true;
    if (selectedBox.inquiry) {
      return (
        !detail.weight.trim() ||
        !detail.matrix.h ||
        !detail.matrix.w ||
        !detail.matrix.l ||
        !detail.shipmentType
      );
    }
    return !shipmentType;
  };

  const handelSubmit = async () => {
    if (!validate()) return;
    try {
      let addressStates = useAddressStore.getState();
      let specificationStates = useSpecificationStore.getState();
      setLoading(true);
      if (selectedBox?.inquiry) {
        const payload = {
          routeId: addressStates.route,
          mainCategoryId: specificationStates.category,
          subCategoryId: specificationStates.subcategory,
          enquiryType: selectedBox?.name,
          approxWeight: detail.weight,
          height: detail.matrix.h,
          width: detail.matrix.w,
          length: detail.matrix.l,
          transferType: detail.shipmentType,
          additionalInfo: detail.info,
        };

        await submitEnquiryApiHandler(payload);
        navigation.push("SubmitShipment");
      } else {
        const payload = {
          categoryId: specificationStates.category,
          subCategoryId: specificationStates.subcategory,
          routeId: addressStates.route,
          boxId: selectedBox.id,
          mode: shipmentType,
          deliveryType:
            addressStates?.shipmentType == SHIPMENT_TYPE.DOORSTEP_PICKUP
              ? "PICKUP"
              : "DROP",
          pickupAddressId: useAddressStore.getState().pickupAddress?.id,
          dropAddressId: useAddressStore.getState().deliverAddress?.id,
        };

        const response = await createOrderApiHandler(payload);

        navigation.push("DetailsAndPayment", { orderId: response?.id });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1:
          typeof error === "string"
            ? error
            : (error?.message ?? "Something went wrong"),
      });
    } finally {
      setLoading(false);
    }
  };

  const getBoxes = async () => {
    try {
      const response = await getBoxesApiHandler(
        useAddressStore.getState().route,
      );
      if (response?.length > 0) {
        setSelectedBox(response[0]);
      }
      console.log("boxes data : ", response[0]?.modePrices);
      setBoxes([...response, ...staticBoxes]);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1:
          typeof error === "string"
            ? error
            : (error?.message ?? "Something went wrong"),
      });
    }
  };

  const getDurations = async () => {
    try {
      const response = await getDurationApiHandler(
        useAddressStore.getState().route,
      );
      console.log("duration data", response);
      const payload = ["Loding"];
      response?.map((item) => {
        if (item?.type == "SHIP") {
          payload[0] = `${item?.protocolDuration} Days`;
        } else if (item?.type == "AIR") {
          payload[1] = `${item?.protocolDuration} Days`;
        } 
      });

      setDurations(payload);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1:
          typeof error === "string"
            ? error
            : (error?.message ?? "Something went wrong"),
      });
    }
  };

  useEffect(() => {
    getDurations();
    getBoxes();
  }, []);

  return (
    <ScreenWrapper KeyboardAvoiding={true}>
      <View className="flex-1 px-8 pb-8">
        <View className="flex flex-row items-center justify-between">
          <BackButton navigation={navigation} />
          <View className="px-4 py-1  bg-[#BFCDDE] rounded-full">
            <Text className="text-cno  text-primary font-inter-medium">
              {step}/{TOTAL_STEP}
            </Text>
          </View>
        </View>

        <View className="pt-10 flex flex-col justify-between content-between flex-1">
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex flex-col gap-4"
          >
            <CategoryBox
              selectedCategory={category}
              setCategory={(e: any) => handelSetCategory(e)}
              selectedSubCategory={subCategory}
              setSubCategory={(e: any) => handelSetSubCategory(e)}
            />

            <BoxDimension
              durations={durations}
              boxesData={boxes}
              selectedBox={selectedBox}
              setSelectedBox={handelSelectBox}
              termsConditions={termsConditions}
              setTermsConditions={(val: boolean) => {
                setTermsConditions(val);
                if (errors.termsConditions)
                  setErrors((e) => ({ ...e, termsConditions: "" }));
              }}
              shipmentType={shipmentType}
              setShipmentType={(val: any) => {
                setShipmentType(val);
                setDetail((d: any) => ({ ...d, shipmentType: val }));
                if (errors.shipmentType)
                  setErrors((e) => ({ ...e, shipmentType: "" }));
              }}
              detail={detail}
              setDetail={(val: any) => {
                setDetail(val);
                setErrors((e) => ({
                  ...e,
                  weight: val.weight?.trim() ? "" : e.weight,
                  h: val.matrix?.h ? "" : e.h,
                  w: val.matrix?.w ? "" : e.w,
                  l: val.matrix?.l ? "" : e.l,
                }));
              }}
              errors={errors}
            />
          </ScrollView>
          <View className="">
            <Button
              text={selectedBox?.custom ? "Submit" : "Continue"}
              disabled={checkIsDisabled()}
              action={handelSubmit}
              loading={loading}
            />
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Specification;
