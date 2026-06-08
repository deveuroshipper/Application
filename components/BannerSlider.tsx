import { getDashboardImagesApiHandler } from "@/helper/Api";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
export const IMAGE_URL = process.env.EXPO_PUBLIC_IMAGE_URL;
const SLIDE_WIDTH = SCREEN_WIDTH - 48;
const SLIDE_GAP = 12;
const SLIDE_INTERVAL = 4000;

export type BannerSlide = {
  id: string;
  image: ImageSourcePropType;
  title: string;
};

type Props = {
  slides: BannerSlide[];
};

const BannerSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slides, setSlides] = useState<null | any>(null);
  const flatListRef = useRef<FlatList<BannerSlide>>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToIndex = useCallback((index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true });
    setActiveIndex(index);
  }, []);

  const startAutoSlide = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev >= slides.length - 1 ? 0 : prev + 1;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, SLIDE_INTERVAL);
  }, [slides?.length]);

  const getSliderImages = async () => {
    try {
      const response = await getDashboardImagesApiHandler();
      console.log("Slider data", response);
      setSlides(response);
    } catch (error) {
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
    getSliderImages();
    startAutoSlide();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoSlide]);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (SLIDE_WIDTH + SLIDE_GAP));
    if (index !== activeIndex) {
      setActiveIndex(index);
      startAutoSlide();
    }
  };

  const renderSlide = ({ item }: { item: BannerSlide }) => (
    <View
      style={{ width: SLIDE_WIDTH, marginRight: SLIDE_GAP }}
      className="rounded-3xl overflow-hidden"
    >
      <Image
        source={{ uri: `${IMAGE_URL}/${item.image}` }}
        className="w-full h-full"
        style={{ height: 200 }}
        resizeMode="cover"
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.72)"]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
        }}
      />
      <View className="absolute bottom-0 left-0 px-8 py-6">
        <Text
          className="text-white font-inter-bold"
          style={{ fontSize: 22, lineHeight: 30, maxWidth: SLIDE_WIDTH * 0.65 }}
        >
          {item.title}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="mt-4">
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        renderItem={renderSlide}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        snapToInterval={SLIDE_WIDTH + SLIDE_GAP}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 24 }}
        onMomentumScrollEnd={onScrollEnd}
        getItemLayout={(_, index) => ({
          length: SLIDE_WIDTH + SLIDE_GAP,
          offset: (SLIDE_WIDTH + SLIDE_GAP) * index,
          index,
        })}
      />

      {/* Dot Indicators */}
      <View className="flex-row justify-center items-center mt-6 gap-1.5">
        {slides?.map((_, index) => (
          <View
            key={index}
            style={{
              width: index === activeIndex ? 24 : 8,
              height: 4,
              borderRadius: 3,
              backgroundColor: index === activeIndex ? "#CF961A" : "#D1D5DB",
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default BannerSlider;
