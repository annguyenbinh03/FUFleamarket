import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./../Screens/HomeScreen/home";
import Profile from "./../Screens/HomeScreen/profile";
import PostManager from "../Screens/HomeScreen/postManager";
import Message from "./../Screens/HomeScreen/message";
import PostProduct from "./../Screens/HomeScreen/postProduct";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Trang chủ" component={Home} />
      <Tab.Screen name="Quản lý tin" component={PostManager} />
      <Tab.Screen name="Đăng tin" component={PostProduct} />
      <Tab.Screen name="Tin nhắn" component={Message} />
      <Tab.Screen name="Hồ sơ" component={Profile} />
    </Tab.Navigator>
  );
}
