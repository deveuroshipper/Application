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
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/inter";
import {
  Manrope_600SemiBold,
  Manrope_700Bold,
} from "@expo-google-fonts/manrope";
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import { createStackNavigator } from "@react-navigation/stack";
import { StripeProvider } from "@stripe/stripe-react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React from "react";
import { Platform } from "react-native";
import "../global.css";
import {
  getAppTokenApiHandler,
  getProfileApiHandler,
  setAppTokenApiHandler,
} from "../helper/Api";
import {
  clearRootNavigation,
  setRootNavigation,
} from "../helper/RootNavigation";
import { useAuthStore } from "../store/useAuthStore";
import MainScreens from "./MainScreens";

const Stack = createStackNavigator();

const RootStackLayout = ({ children, navigation }: any) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const wasAuthenticated = React.useRef(isAuthenticated);

  React.useEffect(() => {
    setRootNavigation(navigation);

    return () => clearRootNavigation(navigation);
  }, [navigation]);

  React.useEffect(() => {
    if (wasAuthenticated.current && !isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: "WelcomeScreen" }],
      });
    }

    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated, navigation]);

  return children;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Layout = () => {
  const accessToken = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Inter_800ExtraBold,
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
    SpaceGrotesk_600SemiBold,
    Inter_600SemiBold,
    Manrope_700Bold,
    Manrope_600SemiBold,
  });

  const [expoPushToken, setExpoPushToken] = React.useState("");
  const [, setNotification] = React.useState<Notifications.Notification | null>(
    null,
  );

  const notificationListener =
    React.useRef<Notifications.EventSubscription | null>(null);
  const responseListener = React.useRef<Notifications.EventSubscription | null>(
    null,
  );
  const lastSyncedPushToken = React.useRef<string | null>(null);
  const lastSyncedProfileToken = React.useRef<string | null>(null);

  const getStoredAppToken = (data: any) => {
    if (typeof data === "string") return data;

    return (
      data?.appToken ||
      data?.token ||
      data?.data?.appToken ||
      data?.data?.token ||
      data?.data?.appToken?.appToken ||
      data?.appToken?.appToken
    );
  };

  async function registerForPushNotificationsAsync(): Promise<
    string | undefined
  > {
    let token: string | undefined;

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
      setExpoPushToken(token ?? ""),
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // When the user taps on the notification, this line checks if they //are suppose to be taken to a particular screen
        // const screen = response.notification.request.content.data.screen;
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

  React.useEffect(() => {
    if (!isAuthenticated || !accessToken) return;
    if (lastSyncedProfileToken.current === accessToken) return;

    const syncProfile = async () => {
      try {
        const profile = await getProfileApiHandler();
        await setUser(profile);
        lastSyncedProfileToken.current = accessToken;
      } catch (error: any) {
        console.log("Failed to sync profile", error);

        if (error?.status === 401) {
          await logout();
        }
      }
    };

    syncProfile();
  }, [accessToken, isAuthenticated, logout, setUser]);

  React.useEffect(() => {
    if (!expoPushToken || !isAuthenticated || !accessToken) return;
    if (lastSyncedPushToken.current === expoPushToken) return;

    const syncPushToken = async () => {
      try {
        const storedTokenData = await getAppTokenApiHandler();
        const storedAppToken = getStoredAppToken(storedTokenData);

        if (storedAppToken !== expoPushToken) {
          await setAppTokenApiHandler(expoPushToken);
        }

        lastSyncedPushToken.current = expoPushToken;
      } catch (error) {
        console.log("Failed to sync app token", error);
      }
    };

    syncPushToken();
  }, [accessToken, expoPushToken, isAuthenticated]);

  if (!fontsLoaded) return null;
  return (
    <StripeProvider publishableKey="pk_test_51T8IHvGmnpqm6UPOoqXKCWrbx0jnFhqcxITexjsNuhgPocGNJ9EWc6qJWZxUnaSBko7pMTGVf8ZTL52bJ13rN7om00gUVTM9D4">
      <Stack.Navigator
        initialRouteName="LoadingSplashScreen"
        layout={RootStackLayout}
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
    </StripeProvider>
  );
};

export default Layout;
