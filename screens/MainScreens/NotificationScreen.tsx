import Icon from "@/assets/icons";
import notNotification from "@/assets/images/not-notification.png";
import BackButton from "@/components/BackButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import {
  getNotificationApiHandler,
  readNotificationsApiHandler,
} from "@/helper/Api";
import { useNotificationStore } from "@/store/useNotificationStore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  SectionList,
  Text,
  View,
  ViewToken,
} from "react-native";
import Toast from "react-native-toast-message";

type NotificationType = "ORDER_RELATED" | "GENERAL" | "ALERT" | string;

type ApiNotification = {
  id: string;
  title: string;
  message: string;
  scope?: string;
  timeBucket?: string;
  type: NotificationType;
  isRead?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type NotificationSection = {
  key: string;
  label: string;
  data: ApiNotification[];
};

const SECTION_LABELS: Record<string, string> = {
  today: "Today",
  yesterday: "Yesterday",
  old: "Earlier",
};

const getNotificationStyle = (type: NotificationType) => {
  const styles: Record<string, any> = {
    ORDER_RELATED: {
      icon: "Box",
      bg: "#FEECD3",
      color: "#E0A31D",
    },
    GENERAL: {
      icon: "Bell",
      bg: "#FEECD3",
      color: "#E0A31D",
    },
    ALERT: {
      icon: "Warning",
      bg: "#FEECD3",
      color: "#E0A31D",
    },
  };

  return (
    styles[type] ?? {
      icon: "Info",
      bg: "#FEECD3",
      color: "#475569",
    }
  );
};

const formatNotificationTime = (item: ApiNotification) => {
  const dateValue = item.createdAt || item.updatedAt;
  if (!dateValue) return item.timeBucket ? SECTION_LABELS[item.timeBucket] : "";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const normalizeNotificationSections = (
  response: any,
): NotificationSection[] => {
  const source = response?.notifications ?? response?.data ?? response ?? {};

  if (Array.isArray(source)) {
    const grouped = source.reduce(
      (acc: Record<string, ApiNotification[]>, item) => {
        const key = item?.timeBucket || "old";
        acc[key] = [...(acc[key] ?? []), item];
        return acc;
      },
      {},
    );

    return normalizeNotificationSections(grouped);
  }

  return Object.entries(source)
    .map(([key, value]) => ({
      key,
      label: SECTION_LABELS[key] ?? key.replace(/_/g, " ").toUpperCase(),
      data: Array.isArray(value) ? (value as ApiNotification[]) : [],
    }))
    .filter((section) => section.data.length > 0)
    .sort((a, b) => {
      const order = ["today", "yesterday", "old"];
      return order.indexOf(a.key) - order.indexOf(b.key);
    });
};

const markNotificationAsReadInSections = (
  sections: NotificationSection[],
  notificationIds: string[],
) => {
  const idSet = new Set(notificationIds);

  return sections.map((section) => ({
    ...section,
    data: section.data.map((item) =>
      idSet.has(item.id) ? { ...item, isRead: true } : item,
    ),
  }));
};

const isUnreadNotification = (item: ApiNotification) => item.isRead === false;

const NotificationItem = ({ item }: { item: ApiNotification }) => {
  const style = getNotificationStyle(item.type);

  return (
    <View
      className={`flex-row items-start py-4 bg-white gap-4 mb-5 rounded-xl px-4 `}
    >
      <View
        className="h-12 w-12 items-center justify-center rounded-full"
        style={{ backgroundColor: style.bg }}
      >
        <Icon name={style.icon} size={22} color={style.color} />
      </View>

      <View className="flex-1">
        <View className="flex-row justify-between items-start">
          <Text className="text-csm font-inter-bold text-primary flex-1 pr-2">
            {item.title}
          </Text>
          <Text className="text-cxs font-inter-semibold text-[#55658B]">
            {formatNotificationTime(item)}
          </Text>
        </View>
        <Text
          className="text-[11px] font-inter-semibold text-[#3F4C6E] mt-0.5"
          numberOfLines={2}
        >
          {item.message}
        </Text>
        {/* <Text className="text-[10px] font-inter-bold text-primary/40 mt-1">
          {item.type?.replace(/_/g, " ")}
        </Text> */}
      </View>
    </View>
  );
};

const NotificationScreen = ({ navigation }: any) => {
  const fetchNotificationStatus = useNotificationStore(
    (state) => state.fetchStatus,
  );
  const [notificationSections, setNotificationSections] = useState<
    NotificationSection[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const sentReadIdsRef = useRef<Set<string>>(new Set());
  const hasNotifications = notificationSections.some(
    (section) => section.data.length > 0,
  );

  const getNotification = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const [response] = await Promise.all([
        getNotificationApiHandler(),
        fetchNotificationStatus(),
      ]);

      setNotificationSections(normalizeNotificationSections(response));
      sentReadIdsRef.current.clear();
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1:
          typeof error === "string"
            ? error
            : (error?.message ?? "Something went wrong"),
      });
    } finally {
      if (showLoader) setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getNotification(false);
  };

  useEffect(() => {
    getNotification();
  }, []);

  

  const markVisibleNotificationsRead = useCallback(
    async (viewableItems: ViewToken<ApiNotification>[]) => {
      const notificationIds = viewableItems
        .map((viewableItem) => viewableItem.item)
        .filter(
          (item) =>
            item?.id &&
            isUnreadNotification(item) &&
            !sentReadIdsRef.current.has(item.id),
        )
        .map((item) => item.id);

      if (notificationIds.length === 0) return;

      notificationIds.forEach((id) => sentReadIdsRef.current.add(id));

      try {
        await readNotificationsApiHandler(notificationIds);
        setNotificationSections((currentSections) =>
          markNotificationAsReadInSections(currentSections, notificationIds),
        );
        fetchNotificationStatus().catch(() => {});
      } catch (error) {
        notificationIds.forEach((id) => sentReadIdsRef.current.delete(id));
       
      }
    },
    [fetchNotificationStatus],
  );
  const markVisibleNotificationsReadRef = useRef(markVisibleNotificationsRead);

  useEffect(() => {
    markVisibleNotificationsReadRef.current = markVisibleNotificationsRead;
  }, [markVisibleNotificationsRead]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken<ApiNotification>[] }) => {
      markVisibleNotificationsReadRef.current(viewableItems);
    },
  ).current;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  return (
    <ScreenWrapper KeyboardAvoiding={false}>
      <View className="flex-1 px-8 pb-8">
        <View className="flex flex-row items-center justify-between">
          <BackButton navigation={navigation} />
          {/* {hasUnreadNotification && (
            <View className="px-3 py-1 rounded-full bg-red-50 border border-red-100">
              <Text className="text-cxs font-inter-bold text-red-500">
                {unreadCount} unread
              </Text>
            </View>
          )} */}
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#0F1729" size="large" />
          </View>
        ) : hasNotifications ? (
          <SectionList
            sections={notificationSections}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <NotificationItem item={item} />}
            renderSectionHeader={({ section }) => (
              <Text className="text-cno font-inter-bold text-primary my-4">
                {section.label}
              </Text>
            )}
            className="flex-1 mt-6"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onViewableItemsChanged={onViewableItemsChanged as any}
            viewabilityConfig={viewabilityConfig}
            stickySectionHeadersEnabled={false}
          />
        ) : (
          <View className="flex-1 justify-center items-center gap-6">
            <View className="w-full h-fit rounded-2xl overflow-hidden">
              <Image
                source={notNotification}
                className="w-full rounded-3xl"
                resizeMode="contain"
              />
            </View>
            <View className="items-center gap-2">
              <Text className="text-cmd font-space-grotesk-bold text-primary text-center">
                No New Notification
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default NotificationScreen;
