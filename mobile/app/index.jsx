import React from "react";
import { View, StyleSheet } from "react-native";
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
import AdminProductManager from "./AdminScreen/AdminProductManager";
import MySellingPackage from "./Screens/PackageScreen/MySellingPackage";
import SellingPackage from "./Screens/PackageScreen/SellingPackage";
import CreateTradingOrder from "./Screens/OrderScreen/CreateTradingOrder";
import TradingOrderRequest from "./Screens/OrderScreen/TradingOrderRequest";
import TradingOrder from "./Screens/OrderScreen/TradingOrder";
import AuthWrapper from "../components/AuthWrapper";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <AuthProvider>
          <NavigationContainer independent={true}>
            <Stack.Navigator initialRouteName="TabNavigation">
              <Stack.Screen
                name="TabNavigation"
                component={TabNavigation}
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
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="AdminTabNavigation"
                options={{ headerShown: false }}
              >
                {() => (
                  <AuthWrapper allowedRoles={[2]}>
                    <AdminTabNavigation />
                  </AuthWrapper>
                )}
              </Stack.Screen>
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
                options={{
                  title: "Danh sách sản phẩm đã lưu",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              >
                {() => (
                  <AuthWrapper>
                    <WishListScreen />
                  </AuthWrapper>
                )}
              </Stack.Screen>
              <Stack.Screen
                name="UserDetailScreen"
                options={{
                  title: "Thông tin người dùng",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              >
                {() => (
                  <AuthWrapper>
                    <UserDetailScreen />
                  </AuthWrapper>
                )}
              </Stack.Screen>
              <Stack.Screen
                name="CreateOrder"
                options={{
                  title: "Tạo hóa đơn mua hàng",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              >
                {() => (
                  <AuthWrapper>
                    <CreateOrder />
                  </AuthWrapper>
                )}
              </Stack.Screen>
              <Stack.Screen
                name="CreateTradingOrder"
                options={{
                  title: "Tạo hóa đơn trao đổi hàng",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              >
                {() => (
                  <AuthWrapper>
                    <CreateTradingOrder />
                  </AuthWrapper>
                )}
              </Stack.Screen>
              <Stack.Screen
                name="SellOrder"
                options={{
                  title: "Đơn bán",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              >
                {() => (
                  <AuthWrapper>
                    <SellOrder />
                  </AuthWrapper>
                )}
              </Stack.Screen>
              <Stack.Screen
                name="BuyOrder"
                options={{
                  title: "Đơn mua",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              >
                {() => (
                  <AuthWrapper>
                    <BuyOrder />
                  </AuthWrapper>
                )}
              </Stack.Screen>
              <Stack.Screen
                name="TradingOrderRequest"
                options={{
                  title: "Yêu cầu trao đổi",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              >
                {() => (
                  <AuthWrapper>
                    <TradingOrderRequest />
                  </AuthWrapper>
                )}
              </Stack.Screen>
              <Stack.Screen
                name="TradingOrder"
                options={{
                  title: "Đơn trao đổi",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              >
                {() => (
                  <AuthWrapper>
                    <TradingOrder />
                  </AuthWrapper>
                )}
              </Stack.Screen>
              <Stack.Screen
                name="MySellingPackage"
                options={{
                  title: "Gói bán hàng của tôi",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              >
                {() => (
                  <AuthWrapper>
                    <MySellingPackage />
                  </AuthWrapper>
                )}
              </Stack.Screen>
              <Stack.Screen
                name="SellingPackage"
                options={{
                  title: "Gói bán hàng",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              >
                {() => (
                  <AuthWrapper>
                    <SellingPackage />
                  </AuthWrapper>
                )}
              </Stack.Screen>
              <Stack.Screen
                name="AdminProductManager"
                options={{
                  title: "Quản lý sản phẩm",
                  headerStyle: styles.header,
                  headerTitleStyle: styles.headerTitle,
                }}
              >
                {() => (
                  <AuthWrapper allowedRoles={[2]}>
                    <AdminProductManager />
                  </AuthWrapper>
                )}
              </Stack.Screen>
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
