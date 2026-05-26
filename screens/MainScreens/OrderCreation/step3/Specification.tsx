import CustomBox from "@/assets/images/boxes/CustomBox.png";
import FullContainer from "@/assets/images/boxes/FullContainer.png";
import largeBox from "@/assets/images/boxes/largeBox.png";
import LessContainer from "@/assets/images/boxes/LessContainer.png";
import MediumBox from "@/assets/images/boxes/MediumBox.png";
import SmallBox from "@/assets/images/boxes/smallBox.png";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import BoxDimension from "@/components/OrderScreation/BoxDimension";
import CategoryBox from "@/components/OrderScreation/CategoryBox";
import ScreenWrapper from "@/components/ScreenWrapper";
import { useSpecificationStore } from "@/store/useSpecification";
import { useState } from "react";
import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
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
  const [selectedBox, setSelectedBox] = useState(null);
  const [termsConditions, setTermsConditions] = useState(false);
  const [shipmentType, setShipmentType] = useState(null);

  const data: BoxItem[] = [
    {
      id: "0001",
      name: "Large",
      weight: 3,
      image: largeBox,
      maxSize: "34 X 32 X 10cm",
      custom: false,
      inquiry: false,
    },
    {
      id: "0002",
      name: "Medium",
      weight: 3,
      image: MediumBox,
      maxSize: "34 X 32 X 10cm",
      custom: false,
      inquiry: false,
    },
    {
      id: "0003",
      name: "Small",
      weight: 3,
      image: SmallBox,
      maxSize: "34 X 32 X 10cm",
      custom: false,
    },
    {
      id: "0004",
      name: "Custom Box",
      weight: 3,
      image: CustomBox,
      maxSize: "34 X 32 X 10cm",
      custom: true,
      inquiry: true,
    },
    {
      id: "0005",
      name: "Full Container Load (FCL)",
      weight: 3,
      image: FullContainer,
      maxSize: "34 X 32 X 10cm",
      custom: true,
      inquiry: true,
    },
    {
      id: "0006",
      name: "Less than Container Load (LCL)",
      weight: 3,
      image: LessContainer,
      maxSize: "34 X 32 X 10cm",
      custom: true,
      inquiry: true,
    },
  ];

  const handelSetCategory = (categoryId: string) => {
    useSpecificationStore.getState().setCategory(categoryId);
    setCategory(categoryId);
  };
  const handelSetSubCategory = (categoryId: string) => {
    useSpecificationStore.getState().setSubcategory(categoryId);
    setSubcategory(categoryId);
  };

  const handelSubmit = () => {
    if (selectedBox?.inquiry) {
      navigation.push("SubmitShipment");
    } else {
      navigation.push("DetailsAndPayment");
    }
  };
  console.log(
    "category data in store : ",
    useSpecificationStore.getState().category,
    "  ",
    useSpecificationStore.getState().subcategory,
  );
  return (
    <ScreenWrapper KeyboardAvoiding={false}>
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
              boxesData={data}
              selectedBox={selectedBox}
              setSelectedBox={setSelectedBox}
              termsConditions={termsConditions}
              setTermsConditions={setTermsConditions}
              shipmentType={shipmentType}
              setShipmentType={setShipmentType}
            />

            <View className="">
              <Button text="Submit " action={handelSubmit} />
            </View>
          </ScrollView>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Specification;
