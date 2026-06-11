import Icon from "@/assets/icons";
import submitSuccessfully from "@/assets/images/support.png";
import BackButton from "@/components/BackButton";
import Button, { Variant } from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import React, { useEffect, useRef, useState } from "react";
import { Image, Text, View } from "react-native";

const SupportScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const navigatingRef = useRef(false);

  const navigateOnce = (screen: string) => {
    if (navigatingRef.current) return;

    navigatingRef.current = true;
    setLoading(true);
    navigation.navigate(screen);
  };

  const viewTicket = () => {
    navigateOnce("TicketList");
  };

  const createTicket = () => {
    navigateOnce("CreateTickets");
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      navigatingRef.current = false;
      setLoading(false);
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <ScreenWrapper KeyboardAvoiding={false}>
      <View className="flex-1 px-8 pb-8">
        {/* Header */}
        <View className="flex flex-row items-center">
          <BackButton navigation={navigation} />
        </View>

        {/* Content */}
        <View className="flex-1 justify-center  gap-6">
          {/* Success Illustration Card */}
          <View className="w-full  h-fit rounded-2xl overflow-hidden">
            <Image
              source={submitSuccessfully}
              className="w-full rounded-3xl"
              resizeMode="contain"
            />
          </View>

          {/* Text */}
          <View className="items-center gap-2 mb-2">
            <Text className="text-cmd font-space-grotesk-bold text-primary text-center">
              How Can Help You?
            </Text>
            <View>
              <Text className="text-csm  font-inter text-primary/50 text-center">
                you have not raised any queries. Need help?
              </Text>
              <Text className="text-csm font-inter text-primary/50 text-center">
                we are here for you
              </Text>
            </View>
          </View>
          <View className=" flex flex-col gap-6">
            <Button
              disabled={loading}
              text="Start Conversion"
              frontIcon={<Icon name="ChatTeardrop" color="#FFFF" size={28} />}
              action={() => createTicket()}
            />

            <Button
              text="View Tickets"
              disabled={loading}
              variant={Variant.OUTLINE}
              action={() => viewTicket()}
            />
          </View>
        </View>

        {/* Button */}
      </View>
    </ScreenWrapper>
  );
};

export default SupportScreen;
