import CreateAccount from "@/screens/CreateAccount";
import GetStartedScreen from "@/screens/GetStartedScreen";
import IntroScreen from "@/screens/IntroScreen";
import LetsBeginScreen from "@/screens/LetsBeginScreen";
import LoadingSplashScreen from "@/screens/LoadingSplashScreen";
import WelcomeScreen from "@/screens/WelcomeScreen";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import "../global.css";
const Stack = createStackNavigator();

const Layout = () => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
  });

  if (!fontsLoaded) return null;
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="LoadingSplashScreen"
        component={LoadingSplashScreen}
        options={{ title: "LoadingSplashScreen" }}
      />
      <Stack.Screen
        name="LetsBeginScreen"
        component={LetsBeginScreen}
        options={{ title: "LetsBeginScreen" }}
      />
      <Stack.Screen
        name="IntroScreen"
        component={IntroScreen}
        options={{ title: "IntroScreen" }}
      />
      <Stack.Screen
        name="GetStartedScreen"
        component={GetStartedScreen}
        options={{ title: "GetStartedScreen" }}
      />
      <Stack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{ title: "WelcomeScreen" }}
      />
      <Stack.Screen
        name="CreateAccount"
        component={CreateAccount}
        options={{ title: "CreateAccount" }}
      />
    </Stack.Navigator>
  );
};

export default Layout;
