# Notification Screen UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the empty-only NotificationScreen with a grouped notification list UI (Today / Yesterday / Earlier) with static mock data, preserving the existing empty state.

**Architecture:** Single file replacement — all types, mock data, and the `NotificationItem` sub-component live in `NotificationScreen.tsx`. Conditional rendering shows either the list (ScrollView with sections) or the existing empty state image. No new files, no new dependencies.

**Tech Stack:** React Native, NativeWind (Tailwind), existing `Icon` component (`@/assets/icons`), existing `BackButton` and `ScreenWrapper` components.

---

### Task 1: Define types and mock data

**Files:**
- Modify: `screens/MainScreens/NotificationScreen.tsx`

- [ ] **Step 1: Replace the entire file content with types + mock data + shell component**

Open `screens/MainScreens/NotificationScreen.tsx` and replace its contents with:

```tsx
import notNotification from "@/assets/images/not-notification.png";
import BackButton from "@/components/BackButton";
import ScreenWrapper from "@/components/ScreenWrapper";
import Icon from "@/assets/icons";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";

// ─── Types ───────────────────────────────────────────────────────────────────

type Notification = {
  id: string;
  title: string;
  subtitle: string;
  time: string;
  icon: string;
};

type NotificationSection = {
  label: "Today" | "Yesterday" | "Earlier";
  data: Notification[];
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_NOTIFICATIONS: NotificationSection[] = [
  {
    label: "Today",
    data: [
      {
        id: "1",
        title: "Shipment Picked Up",
        subtitle:
          "Order #87858452 has been picked up from the origin warehouse.",
        time: "10:30 AM",
        icon: "Ship",
      },
      {
        id: "2",
        title: "In Transit",
        subtitle: "Your order #87858452 is on the way.",
        time: "10:30 AM",
        icon: "ShipOutline",
      },
      {
        id: "3",
        title: "Payment Confirmed",
        subtitle: "Your payment has been received.",
        time: "10:30 AM",
        icon: "Check",
      },
    ],
  },
  {
    label: "Yesterday",
    data: [
      {
        id: "4",
        title: "Created Shipment Order",
        subtitle:
          "Order #87858452 has been picked up from the origin warehouse.",
        time: "10:30 AM",
        icon: "Box",
      },
      {
        id: "5",
        title: "Shipment Started At Warehouse",
        subtitle:
          "Order #87858452 has been picked up from the origin warehouse.",
        time: "10:30 AM",
        icon: "Box",
      },
    ],
  },
  {
    label: "Earlier",
    data: [
      {
        id: "6",
        title: "Account Created",
        subtitle: "Your account is ready to use.",
        time: "10:30 AM",
        icon: "User",
      },
    ],
  },
];

// ─── NotificationItem ─────────────────────────────────────────────────────────

const NotificationItem = ({
  item,
  isLast,
}: {
  item: Notification;
  isLast: boolean;
}) => {
  return (
    <View
      className={`flex-row items-start py-4 gap-4 ${
        !isLast ? "border-b border-primary/10" : ""
      }`}
    >
      {/* Icon Circle */}
      <View className="h-12 w-12 rounded-full bg-gold/20 items-center justify-center">
        <Icon name={item.icon} size={22} color="#E0A31D" />
      </View>

      {/* Text Block */}
      <View className="flex-1">
        <View className="flex-row justify-between items-start">
          <Text className="text-csm font-inter-bold text-primary flex-1 pr-2">
            {item.title}
          </Text>
          <Text className="text-cxs font-inter text-primary/40">{item.time}</Text>
        </View>
        <Text
          className="text-cxs font-inter text-primary/50 mt-0.5"
          numberOfLines={2}
        >
          {item.subtitle}
        </Text>
      </View>
    </View>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────

const NotificationScreen = ({ navigation }: any) => {
  const hasNotifications = MOCK_NOTIFICATIONS.some((s) => s.data.length > 0);

  return (
    <ScreenWrapper KeyboardAvoiding={false}>
      <View className="flex-1 px-8 pb-8">
        {/* Header */}
        <View className="flex flex-row items-center">
          <BackButton navigation={navigation} />
        </View>

        {hasNotifications ? (
          /* ── List State ── */
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {MOCK_NOTIFICATIONS.filter((s) => s.data.length > 0).map(
              (section, sectionIndex) => (
                <View key={section.label}>
                  {/* Section Label */}
                  <Text
                    className={`text-cno font-inter-bold text-primary mb-2 ${
                      sectionIndex === 0 ? "mt-4" : "mt-6"
                    }`}
                  >
                    {section.label}
                  </Text>

                  {/* Notification Rows */}
                  {section.data.map((item, index) => (
                    <NotificationItem
                      key={item.id}
                      item={item}
                      isLast={index === section.data.length - 1}
                    />
                  ))}
                </View>
              )
            )}
          </ScrollView>
        ) : (
          /* ── Empty State ── */
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
```

- [ ] **Step 2: Verify the app runs without errors**

Run the app and navigate to the Notification screen. You should see:
- A header with a back button
- "Today", "Yesterday", "Earlier" section labels
- Notification rows with gold icon circles, title, subtitle, and time
- Thin dividers between rows within each section

To test the empty state: temporarily set all `data` arrays to `[]` in `MOCK_NOTIFICATIONS` — the screen should fall back to the illustration image and "No New Notification" text. Then restore the data.

- [ ] **Step 3: Commit**

```bash
git add screens/MainScreens/NotificationScreen.tsx
git commit -m "feat: implement notification screen grouped list UI with mock data"
```
