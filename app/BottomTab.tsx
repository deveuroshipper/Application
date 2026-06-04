import HomeScreen from "@/screens/MainScreens/HomeScreen";
import OrdersScreen from "@/screens/MainScreens/OrdersScreen";
import ProfileScreen from "@/screens/MainScreens/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const TAB_CONFIG: Record<
  string,
  {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconActive: keyof typeof Ionicons.glyphMap;
  }
> = {
  HomeScreen: { label: "Home", icon: "home-outline", iconActive: "home" },
  OrdersScreen: { label: "Orders", icon: "cube-outline", iconActive: "cube" },
  ProfileScreen: {
    label: "Profile",
    icon: "person-outline",
    iconActive: "person",
  },
};

type TabItemProps = {
  route: any;
  isFocused: boolean;
  options: any;
  onPress: () => void;
};

function TabItem({ route, isFocused, options, onPress }: TabItemProps) {
  const config = TAB_CONFIG[route.name];

  // Shared animated values
  const scale = useSharedValue(isFocused ? 1 : 0.8);
  const pillOpacity = useSharedValue(isFocused ? 1 : 0);
  const inactiveOpacity = useSharedValue(isFocused ? 0 : 1);
  const labelOpacity = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    if (isFocused) {
      // Pill springs in
      scale.value = withSpring(1, { damping: 14, stiffness: 200 });
      pillOpacity.value = withTiming(1, { duration: 120 });
      labelOpacity.value = withTiming(1, { duration: 180 });
      inactiveOpacity.value = withTiming(0, { duration: 100 });
    } else {
      // Pill shrinks out, inactive icon fades in
      scale.value = withSpring(0.7, { damping: 14, stiffness: 200 });
      pillOpacity.value = withTiming(0, { duration: 100 });
      labelOpacity.value = withTiming(0, { duration: 80 });
      inactiveOpacity.value = withTiming(1, { duration: 150 });
    }
  }, [isFocused]);

  const pillAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: pillOpacity.value,
  }));

  const inactiveAnimStyle = useAnimatedStyle(() => ({
    opacity: inactiveOpacity.value,
  }));

  const labelAnimStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
  }));

  return (
    <TouchableOpacity
      key={route.key}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      style={styles.tab}
    >
      {/* Active pill — always rendered, animated in/out */}
      <Animated.View style={[styles.pill, pillAnimStyle]}>
        <Ionicons name={config.iconActive} size={20} color="#fff" />
        <Animated.Text style={[styles.pillLabel, labelAnimStyle]}>
          {config.label}
        </Animated.Text>
      </Animated.View>

      {/* Inactive icon — always rendered, animated in/out */}
      <Animated.View
        style={[
          styles.inactiveTab,
          StyleSheet.absoluteFill,
          { justifyContent: "center", alignItems: "center" },
          inactiveAnimStyle,
        ]}
      >
        <Ionicons name={config.icon} size={22} color="#9CA3AF" />
        <Text style={styles.inactiveLabel}>{config.label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

function MyTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const { options } = descriptors[route.key];

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabItem
            key={route.key}
            route={route}
            isFocused={isFocused}
            options={options}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 28 : 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 16,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#111",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  pillLabel: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  inactiveTab: {
    alignItems: "center",
    gap: 4,
  },
  inactiveLabel: {
    color: "#9CA3AF",
    fontSize: 11,
  },
});

const Tab = createBottomTabNavigator();

const Redirection = ({ navigation }: any) => {
  // navigation.push({ routes: [{ name: "ProfileScreen" }] });
  return navigation.push("ProfileScreen");
};
const MyTabs = () => (
  <Tab.Navigator
    tabBar={(props) => <MyTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="HomeScreen" component={HomeScreen} />
    <Tab.Screen name="OrdersScreen" component={OrdersScreen} />
    <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
  </Tab.Navigator>
);

export default MyTabs;
