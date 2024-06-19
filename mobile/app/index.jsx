import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Screens/HomeScreen/home";
import TabNavigation from "./Navigations/TabNavigation";

// Create the stack navigator
const Stack = createNativeStackNavigator();

export default function APP() {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer independent={true}>
        <TabNavigation />
      </NavigationContainer>
    </View>
  );
}
