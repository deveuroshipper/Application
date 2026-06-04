import OrderTracking from "@/components/OrderTracking";
import CartScreen from "@/screens/CartScreen";
import AboutUs from "@/screens/MainScreens/AboutUs";
import AccountInformation from "@/screens/MainScreens/AccountInformation";
import AddNewAddress from "@/screens/MainScreens/AddNewAddress";
import CreateTickets from "@/screens/MainScreens/CreateTickets";
import ListAddresses from "@/screens/MainScreens/ListAddresses";
import NotificationScreen from "@/screens/MainScreens/NotificationScreen";
import AddShipmentAddresses from "@/screens/MainScreens/OrderCreation/step2/AddShipmentAddresses";
import ChooseHowShip from "@/screens/MainScreens/OrderCreation/step2/ChooseHowShip";
import ChooseRoute from "@/screens/MainScreens/OrderCreation/step2/ChooseRoute";
import ConfirmAddressScreen from "@/screens/MainScreens/OrderCreation/step2/ConfirmAddressScreen";
import DateAndTimeSubmission from "@/screens/MainScreens/OrderCreation/step2/DateAndTimeSubmission";
import Specification from "@/screens/MainScreens/OrderCreation/step3/Specification";
import SubmitShipment from "@/screens/MainScreens/OrderCreation/step3/SubmitShipment";
import ApplyCoupon from "@/screens/MainScreens/OrderCreation/step4/ApplyCoupon";
import DetailsAndPayment from "@/screens/MainScreens/OrderCreation/step4/DetailsAndPayment";
import OrderStatus from "@/screens/MainScreens/OrderCreation/step4/OrderStatus";
import PackageDetails from "@/screens/MainScreens/OrderCreation/step4/PackageDetails";
import SupportChat from "@/screens/MainScreens/SupportChat";
import SupportScreen from "@/screens/MainScreens/SupportScreen";
import TicketList from "@/screens/MainScreens/TicketList";
import UpdateDetail from "@/screens/MainScreens/UpdateDetail";
import VerifyUpdateOtp from "@/screens/MainScreens/VerifyUpdateOtp";
import WeProcureScreen from "@/screens/MainScreens/WeProcureScreen";
import WeQAScreen from "@/screens/MainScreens/WeQAScreen";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import "../global.css";
import MyTabs from "./BottomTab";
// import NotificationScreen from "@/screens/MainScreens/NOtificationScreen";

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
      <Stack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{ title: "NotificationScreen" }}
      />
      <Stack.Screen
        name="ListAddresses"
        component={ListAddresses}
        options={{ title: "ListAddresses" }}
      />
      <Stack.Screen name="AccountInformation" component={AccountInformation} />
      <Stack.Screen name="UpdateDetail" component={UpdateDetail} />
      <Stack.Screen name="VerifyUpdateOtp" component={VerifyUpdateOtp} />
      <Stack.Screen name="AboutUsScreen" component={AboutUs} />
      <Stack.Screen name="OrderTrackingScreen" component={OrderTracking} />
      <Stack.Screen name="SupportScreen" component={SupportScreen} />
      <Stack.Screen name="CreateTickets" component={CreateTickets} />
      <Stack.Screen name="TicketList" component={TicketList} />
      <Stack.Screen name="SupportChat" component={SupportChat} />
    </Stack.Navigator>
  );
};

export default MainScreens;
