import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Text, Linking } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TabNavigation from "./Navigations/TabNavigation";
import Detail from "./Screens/HomeScreen/Detail";
import LoginScreen from "./Screens/LoginScreen/Login";
import ProductListByCategoryScreen from "./Screens/ProductScreen/ProductListByCategoryScreen";
import { AuthProvider } from "../context/AuthProvider";
import WishListScreen from "./Screens/ProductScreen/WishListScreen";
import AdminTabNavigation from "./Navigations/AdminTabNavigation";
import UserDetailScreen from "./Screens/ProfileScreen/UserDetailScreen";
import CreateOrder from "./Screens/OrderScreen/CreateOrder";
import SellOrder from "./Screens/OrderScreen/SellOrder";
import BuyOrder from "./Screens/OrderScreen/BuyOrder";
import AdminPostManager from "./AdminScreen/AdminPostManager";
import AdminProductManager from "./AdminScreen/AdminProductManager";
import MySellingPackage from "./Screens/PackageScreen/MySellingPackage";
import SellingPackage from "./Screens/PackageScreen/SellingPackage";
import CreateTradingOrder from "./Screens/OrderScreen/CreateTradingOrder";
import TradingOrderRequest from "./Screens/OrderScreen/TradingOrderRequest";

const Stack = createNativeStackNavigator();

export default function App() {
  const navigationRef = useRef();

  useEffect(() => {
    const handleDeepLink = (event) => {
      console.log("Deep link received:", event.url);
      let url = event.url;

      if (
        url.includes(
          "https://fufleamarket.azurewebsites.net/my-selling-package"
        )
      ) {
        console.log("Valid payment return URL detected");
        // Kiểm tra xem có parameter returnUrl không
        const params = new URL(url).searchParams;
        const deepLink = params.get("returnUrl");

        if (deepLink && deepLink.startsWith("fufm://payment")) {
          console.log("Valid deep link found in returnUrl:", deepLink);
          // Navigate to MySellingPackage screen
          if (navigationRef.current) {
            console.log("Attempting to navigate to MySellingPackage");
            navigationRef.current.navigate("MySellingPackage");
          } else {
            console.log("Navigation ref is not available");
          }
        }
      }
    };

    const subscription = Linking.addListener("url", handleDeepLink);

    // Check if the app was opened from a deep link
    Linking.getInitialURL().then((url) => {
      console.log("Initial URL:", url);
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <AuthProvider>
          <NavigationContainer ref={navigationRef} independent={true}>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="TabNavigation"
                component={TabNavigation}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AdminTabNavigation"
                component={AdminTabNavigation}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Detail"
                component={Detail}
                options={{
                  title: "Chi tiết sản phẩm",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              />
              <Stack.Screen
                name="ProductListByCategory"
                component={ProductListByCategoryScreen}
                options={{
                  title: "Danh sách sản phẩm",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              />
              <Stack.Screen
                name="WishListScreen"
                component={WishListScreen}
                options={{
                  title: "Danh sách sản phẩm đã lưu",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              />
              <Stack.Screen
                name="UserDetailScreen"
                component={UserDetailScreen}
                options={{
                  title: "Thông tin người dùng",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              />
              <Stack.Screen
                name="CreateOrder"
                component={CreateOrder}
                options={{
                  title: "Tạo hóa đơn mua hàng",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              />
              <Stack.Screen
                name="CreateTradingOrder"
                component={CreateTradingOrder}
                options={{
                  title: "Tạo hóa đơn trao đổi hàng",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              />
              <Stack.Screen
                name="SellOrder"
                component={SellOrder}
                options={{
                  title: "Đơn bán",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              />
              <Stack.Screen
                name="BuyOrder"
                component={BuyOrder}
                options={{
                  title: "Đơn mua",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              />
              <Stack.Screen
                name="TradingOrderRequest"
                component={TradingOrderRequest}
                options={{
                  title: "Yêu cầu trao đổi",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              />

              <Stack.Screen
                name="MySellingPackage"
                component={MySellingPackage}
                options={{
                  title: "Gói bán hàng của tôi",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              />
              <Stack.Screen
                name="SellingPackage"
                component={SellingPackage}
                options={{
                  title: "Gói bán hàng",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              />
              <Stack.Screen
                name="AdminProductManager"
                component={AdminProductManager}
                options={{
                  title: "Quản lý sản phẩm",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#DD0000",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
});
