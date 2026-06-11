import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

const ResendOTP = ({
  text,
  resendText,
  timer,
  action,
  loading = false,
}: {
  text: string;
  resendText: string;
  timer: number;
  action: () => void;
  loading?: boolean;
}) => {
  const [seconds, setSeconds] = useState(timer);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = (from: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSeconds(from);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startCountdown(timer);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Restart countdown when loading transitions from true → false (resend completed)
  const prevLoading = useRef(loading);
  useEffect(() => {
    if (prevLoading.current && !loading) {
      startCountdown(timer);
    }
    prevLoading.current = loading;
  }, [loading]);

  const isEnabled = seconds <= 0 && !loading;

  const formatted = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <View className="items-center gap-3">
      <Text className="text-csm text-primary font-inter-medium">{text}</Text>

      <TouchableOpacity
      
        onPress={isEnabled ? action : undefined}
        activeOpacity={isEnabled ? 0.7 : 1}
        className="flex-row items-center justify-center gap-3 px-8 py-4 bg-white border-[1.5px] border-primary/10 rounded-full"
      >
        {loading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <>
            <Text
              className={`text-csm font-inter-bold  ${isEnabled ? "text-primary" : "text-primary/40"}`}
            >
              {resendText}
            </Text>

            {!isEnabled && (
              <>
                <View className="w-2 h-2 rounded-full bg-primary/40" />
                <Text className="text-csm font-inter-bold text-primary">
                  {formatted}
                </Text>
              </>
            )}
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ResendOTP;


