import CreateAccount from "@/screens/CreateAccount";
import EmailVerification from "@/screens/EmailVerification";
import ForgotPasswordScreen from "@/screens/ForgotPasswordScreen";
import GetStartedScreen from "@/screens/GetStartedScreen";
import IntroScreen from "@/screens/IntroScreen";
import LetsBeginScreen from "@/screens/LetsBeginScreen";
import LoadingSplashScreen from "@/screens/LoadingSplashScreen";
import LoginScreen from "@/screens/LoginScreen";
import NewPassword from "@/screens/NewPassword";
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
import MainScreens from "./MainScreens";
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
      initialRouteName="LoadingSplashScreen"
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
      <Stack.Screen
        name="EmailVerification"
        component={EmailVerification}
        options={{ title: "EmailVerification" }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ title: "LoginScreen" }}
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{ title: "ForgotPasswordScreen" }}
      />
      <Stack.Screen
        name="NewPassword"
        component={NewPassword}
        options={{ title: "NewPassword" }}
      />

      <Stack.Screen
        name="MainScreens"
        component={MainScreens}
        options={{ title: "MainScreens" }}
      />
    </Stack.Navigator>
  );
};

export default Layout;
