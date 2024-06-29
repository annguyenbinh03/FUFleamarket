import React from "react";
import { View, StyleSheet, Text } from "react-native";
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

console.log("AdminTabNavigation:", AdminTabNavigation);

const Stack = createNativeStackNavigator();

export default function App() {
  console.log("Rendering App component");
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <AuthProvider>
          <NavigationContainer independent={true}>
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
                name="UserDetail"
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
