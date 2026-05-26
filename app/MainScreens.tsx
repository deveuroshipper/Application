import AddNewAddress from "@/screens/MainScreens/AddNewAddress";
import AddShipmentAddresses from "@/screens/MainScreens/OrderCreation/step2/AddShipmentAddresses";
import ChooseHowShip from "@/screens/MainScreens/OrderCreation/step2/ChooseHowShip";
import ChooseRoute from "@/screens/MainScreens/OrderCreation/step2/ChooseRoute";
import ConfirmAddressScreen from "@/screens/MainScreens/OrderCreation/step2/ConfirmAddressScreen";
import DateAndTimeSubmission from "@/screens/MainScreens/OrderCreation/step2/DateAndTimeSubmission";
import Specification from "@/screens/MainScreens/OrderCreation/step3/Specification";
import SubmitShipment from "@/screens/MainScreens/OrderCreation/step3/SubmitShipment";
import DetailsAndPayment from "@/screens/MainScreens/OrderCreation/step4/DetailsAndPayment";
import WeProcureScreen from "@/screens/MainScreens/WeProcureScreen";
import WeQAScreen from "@/screens/MainScreens/WeQAScreen";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import "../global.css";
import MyTabs from "./BottomTab";
import PackageDetails from "@/screens/MainScreens/OrderCreation/step4/PackageDetails";
import ApplyCoupon from "@/screens/MainScreens/OrderCreation/step4/ApplyCoupon";
import OrderStatus from "@/screens/MainScreens/OrderCreation/step4/OrderStatus";
import CartScreen from "@/screens/CartScreen";
import OrderTracking from "@/components/OrderTracking";

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
      <Stack.Screen
        name="ChooseHowShip"
        component={ChooseHowShip}
        options={{ title: "ChooseHowShip" }}
      />
      <Stack.Screen
        name="DateAndTimeSubmission"
        component={DateAndTimeSubmission}
        options={{ title: "DateAndTimeSubmission" }}
      />
      <Stack.Screen
        name="AddShipmentAddresses"
        component={AddShipmentAddresses}
        options={{ title: "AddShipmentAddresses" }}
      />
      <Stack.Screen
        name="AddNewAddress"
        component={AddNewAddress}
        options={{ title: "AddNewAddress" }}
      />
      <Stack.Screen
        name="ConfirmAddressScreen"
        component={ConfirmAddressScreen}
        options={{ title: "ConfirmAddressScreen" }}
      />
      <Stack.Screen
        name="Specification"
        component={Specification}
        options={{ title: "Specification" }}
      />
      <Stack.Screen
        name="SubmitShipment"
        component={SubmitShipment}
        options={{ title: "SubmitShipment" }}
      />
      <Stack.Screen
        name="DetailsAndPayment"
        component={DetailsAndPayment}
        options={{ title: "DetailsAndPayment" }}
      />
      <Stack.Screen
        name="PackageDetails"
        component={PackageDetails}
        options={{ title: "PackageDetails" }}
      />
      <Stack.Screen
        name="ApplyCoupon"
        component={ApplyCoupon}
        options={{ title: "ApplyCoupon" }}
      />
      <Stack.Screen
        name="OrderStatus"
        component={OrderStatus}
        options={{ title: "OrderStatus" }}
      />
      <Stack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{ title: "CartScreen" }}
      />
      {/* <Stack.Screen
        name="OrderTracking"
        component={OrderTracking}
        options={{ title: "OrderTracking" }}
      /> */}
    </Stack.Navigator>
  );
};

export default MainScreens;
