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
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React from "react";
import "../global.css";
import MainScreens from "./MainScreens";
import { Platform } from "react-native";
const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Layout = () => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
  });

  const [expoPushToken, setExpoPushToken] = React.useState("");
  const [notification, setNotification] = React.useState(false);

  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  async function registerForPushNotificationsAsync() {
    let token;

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        console.log("existingStatus", existingStatus);
      }

      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        console.log("finalStatus", finalStatus);
        return;
      }

      // Project ID can be found in app.json | app.config.js; extra > eas > projectId
      // token = (await Notifications.getExpoPushTokenAsync({ projectId: "YOUR_PROJECT_ID" })).data;
      token = (await Notifications.getExpoPushTokenAsync()).data;

      // The token should be sent to the server so that it can be used to send push notifications to the device
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        showBadge: true,
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FE9018",
      });
    }

    return token;
  }

  React.useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token),
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const {
          notification: {
            request: {
              content: {
                data: { screen },
              },
            },
          },
        } = response;

        // When the user taps on the notification, this line checks if they //are suppose to be taken to a particular screen
        // if (screen) {
        //   props.navigation.navigate(screen);
        // }
      });

    // return () => {
    //   Notifications?.removeNotificationSubscription(
    //     notificationListener.current,
    //   );
    //   Notifications?.removeNotificationSubscription(responseListener.current);
    // };
  }, []);

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
