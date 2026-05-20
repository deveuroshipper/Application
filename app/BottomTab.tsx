import HomeScreen from "@/screens/MainScreens/HomeScreen";
import OrdersScreen from "@/screens/MainScreens/OrdersScreen";
import ProfileScreen from "@/screens/MainScreens/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TAB_CONFIG: Record<string, { label: string; icon: keyof typeof Ionicons.glyphMap; iconActive: keyof typeof Ionicons.glyphMap }> = {
  HomeScreen: { label: "Home", icon: "home-outline", iconActive: "home" },
  OrdersScreen: { label: "Orders", icon: "cube-outline", iconActive: "cube" },
  ProfileScreen: { label: "Profile", icon: "person-outline", iconActive: "person" },
};

function MyTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.container}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const config = TAB_CONFIG[route.name];
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
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            style={styles.tab}
          >
            {isFocused ? (
              <View style={styles.pill}>
                <Ionicons name={config.iconActive} size={20} color="#fff" />
                <Text style={styles.pillLabel}>{config.label}</Text>
              </View>
            ) : (
              <View style={styles.inactiveTab}>
                <Ionicons name={config.icon} size={22} color="#9CA3AF" />
                <Text style={styles.inactiveLabel}>{config.label}</Text>
              </View>
            )}
          </TouchableOpacity>
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
