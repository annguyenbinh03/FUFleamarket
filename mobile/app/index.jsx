import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigation from "./Navigations/TabNavigation";
import Detail from "./Screens/HomeScreen/Detail";

import LoginScreen from "./Screens/LoginScreen/Login";
import ProductListByCategoryScreen from "./Screens/ProductScreen/ProductListByCategoryScreen";
import { AuthProvider } from "../context/AuthProvider";

// Create the stack navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer independent={true}>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} />
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
              name="ProductListByCategory"
              component={ProductListByCategoryScreen}
              options={{
                title: "Danh sách sản phẩm",
                headerStyle: styles.header,
                headerTitleStyle: styles.headerTitle,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </View>
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
