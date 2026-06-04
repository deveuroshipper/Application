import categoryImage from "@/assets/images/category.png";
import { getCategoryApiHandler } from "@/helper/Api";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";
type Category = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
};
export const IMAGE_URL = process.env.EXPO_PUBLIC_IMAGE_URL;

const CategoryBox = ({
  selectedCategory,
  setCategory,
  selectedSubCategory,
  setSubCategory,
}: {
  selectedCategory: String | null;
  setCategory: any | null;
  selectedSubCategory: String | null;
  setSubCategory: any | null;
}) => {
  const [categories, setCategories] = useState(null);
  const [subCategories, setSubCategories] = useState(null);

  const getCategory = async () => {
    try {
      const data = await getCategoryApiHandler();
      setCategories(data);
      setCategory(data?.[0]?.id || null);
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
    getCategory();
  }, []);

  useEffect(() => {
    if (!categories) return;
    const filteredCategory = categories?.filter(
      (item) => item.id === selectedCategory,
    )[0];

    setSubCategories(filteredCategory?.subCategories || []);
  }, [selectedCategory]);


  return (
    <View className="flex flex-col gap-4">
      <View className="">
        <Text className="text-csm font-inter-bold text-primary/80 tracking-wider uppercase">
          Category
        </Text>
        {categories && categories?.length > 0 ? (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 12,
              paddingTop: 12,
              paddingBottom: 12,
              paddingRight: 24,
            }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setCategory(item.id)}
                style={{
                  shadowColor: "#E0A31D",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.02,
                  shadowRadius: 32,
                  elevation: item.id == selectedCategory ? 8 : 0,
                }}
                className={`w-28 items-center rounded-2xl border ${item.id == selectedCategory ? "border-gold" : "border-primary/20"} bg-white px-3 py-4`}
              >
                <View
                  className={`mb-3 h-14 w-14 items-center justify-center rounded-full  ${item.id == selectedCategory ? "bg-primary" : "bg-[#D6E0EE]"} `}
                >
                  <Image
                    className="h-12 w-12"
                    source={
                      item.image ? `${IMAGE_URL}/${item?.image}` : categoryImage
                    }
                  />
                  {/* <Ionicons name={item.icon} size={22} color="#0F1729" /> */}
                </View>
                <Text
                  className="text-center font-inter-medium text-[12px] text-primary"
                  numberOfLines={2}
                >
                  {item.name}
                </Text>
              </Pressable>
            )}
          />
        ) : (
          <View className="text-cno h-28 flex justify-center items-center rounded-xl mt-2 bg-slate-500/5">
            <Text
              className="text-center font-inter-medium text-[12px] text-primary/50"
              numberOfLines={2}
            >
              No category is available.
            </Text>
          </View>
        )}
      </View>
      <View className="">
        <Text className="text-csm font-inter-bold text-primary/80 tracking-wider uppercase">
          Sub-Category
        </Text>

        {subCategories && subCategories?.length > 0 ? (
          <FlatList
            data={subCategories}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 12,
              paddingTop: 12,
              paddingBottom: 12,
              paddingRight: 24,
            }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setSubCategory(item.id)}
                style={{
                  shadowColor: "#E0A31D",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.02,
                  shadowRadius: 32,
                  elevation: item.id == selectedSubCategory ? 8 : 0,
                }}
                className={`w-28 items-center rounded-2xl border ${item.id == selectedSubCategory ? "border-gold" : "border-primary/20"} bg-white px-3 py-4`}
              >
                <View
                  className={`mb-3 h-14 w-14 items-center justify-center rounded-full  ${item.id == selectedSubCategory ? "bg-primary" : "bg-[#D6E0EE]"} `}
                >
                  {/* <Ionicons name={item.icon} size={22} color="#0F1729" /> */}
                </View>
                <Text
                  className="text-center font-inter-medium text-[12px] text-primary"
                  numberOfLines={2}
                >
                  {item.name}
                </Text>
              </Pressable>
            )}
          />
        ) : (
          <View className="text-cno h-28 flex justify-center items-center rounded-xl mt-2 bg-slate-500/5">
            <Text
              className="text-center font-inter-medium text-[12px] text-primary/50"
              numberOfLines={2}
            >
              No subcategory is available.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default CategoryBox;
