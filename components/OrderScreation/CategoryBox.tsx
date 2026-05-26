import { getCategoryApiHandler } from "@/helper/Api";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

type Category = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const CategoryBox = ({
  selectedCategory,
  setCategory,
  selectedSubCategory,
  setSubCategory,
}: {
  selectedCategory: String | null;
  setCategory: String | null;
  selectedSubCategory: String | null;
  setSubCategory: String | null;
}) => {
  const [categories, setCategories] = useState(null);
  const [subCategories, setSubCategories] = useState(null);

  const getCategory = async () => {
    try {
      const data = await getCategoryApiHandler();
      setCategories(data);
    } catch (error) {}
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
      </View>
      <View className="">
        <Text className="text-csm font-inter-bold text-primary/80 tracking-wider uppercase">
          Sub-Category
        </Text>
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
      </View>
    </View>
  );
};

export default CategoryBox;
