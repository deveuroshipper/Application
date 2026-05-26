import React from "react";
import { Text, View } from "react-native";
import Check from "@/assets/icons/Check";
import Info from "@/assets/icons/Info";
import Warning from "@/assets/icons/Warning";

// ─── Shared wrapper ────────────────────────────────────────────────────────────

const ToastWrapper = ({
  accentColor,
  iconBg,
  icon,
  text1,
  text2,
}: {
  accentColor: string;
  iconBg: string;
  icon: React.ReactNode;
  text1?: string;
  text2?: string;
}) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      borderRadius: 14,
      marginHorizontal: 16,
      paddingVertical: 14,
      paddingHorizontal: 16,
      gap: 12,
      // left accent strip
      borderLeftWidth: 4,
      borderLeftColor: accentColor,
      // shadow
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 6,
    }}
  >
    {/* Icon bubble */}
    <View
      style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: iconBg,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {icon}
    </View>

    {/* Text */}
    <View style={{ flex: 1, gap: 2 }}>
      {!!text1 && (
        <Text
          numberOfLines={2}
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: 14,
            color: "#111827",
            lineHeight: 20,
          }}
        >
          {text1}
        </Text>
      )}
      {!!text2 && (
        <Text
          numberOfLines={2}
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 13,
            color: "#6b7280",
            lineHeight: 18,
          }}
        >
          {text2}
        </Text>
      )}
    </View>
  </View>
);

// ─── Toast config ──────────────────────────────────────────────────────────────

const toastConfig = {
  /** ✅ Success — green */
  success: ({ text1, text2 }: any) => (
    <ToastWrapper
      accentColor="#22c55e"
      iconBg="#f0fdf4"
      icon={<Check size={16} color="#22c55e" />}
      text1={text1}
      text2={text2}
    />
  ),

  /** ❌ Error — red */
  error: ({ text1, text2 }: any) => (
    <ToastWrapper
      accentColor="#ef4444"
      iconBg="#fef2f2"
      icon={<Warning size={18} color="#ef4444" />}
      text1={text1}
      text2={text2}
    />
  ),

  /** ℹ️ Info — gray */
  info: ({ text1, text2 }: any) => (
    <ToastWrapper
      accentColor="#9ca3af"
      iconBg="#f3f4f6"
      icon={<Info size={19} color="#6b7280" />}
      text1={text1}
      text2={text2}
    />
  ),
};

export default toastConfig;
