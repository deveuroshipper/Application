import WeProcureScreen from "@/screens/MainScreens/WeProcureScreen";
import WeQAScreen from "@/screens/MainScreens/WeQAScreen";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import "../global.css";
import MyTabs from "./BottomTab";
import ChooseRoute from "@/screens/MainScreens/ChooseRoute";
const Stack = createStackNavigator();

const MainScreens = () => {
  return (
    <Stack.Navigator
      initialRouteName="BottomTabBar"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="BottomTabBar"
        component={MyTabs}
        options={{ title: "LoadingSplashScreen" }}
      />
      <Stack.Screen
        name="WeProcureScreen"
        component={WeProcureScreen}
        options={{ title: "WeProcureScreen" }}
      />
      <Stack.Screen
        name="WeQAScreen"
        component={WeQAScreen}
        options={{ title: "WeQAScreen" }}
      />
      <Stack.Screen
        name="ChooseRoute"
        component={ChooseRoute}
        options={{ title: "ChooseRoute" }}
      />
    </Stack.Navigator>
  );
};

export default MainScreens;
