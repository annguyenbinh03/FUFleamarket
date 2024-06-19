import { View, Text } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./../Screens/HomeScreen/home";
import Profile from "./../Screens/HomeScreen/profile";
import PostManager from "../Screens/HomeScreen/postManager";
import Message from "./../Screens/HomeScreen/message";
import PostProduct from "./../Screens/HomeScreen/postProduct";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#f5f5f5",
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
        },
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "#999999",
      }}
    >
      <Tab.Screen
        name="Trang chủ"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="home"
              size={24}
              color={focused ? "#007bff" : "#999999"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Quản lý tin"
        component={PostManager}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="clipboard-list"
              size={24}
              color={focused ? "#007bff" : "#999999"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Đăng tin"
        component={PostProduct}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="plus-circle"
              size={24}
              color={focused ? "#007bff" : "#999999"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Tin nhắn"
        component={Message}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="message-text"
              size={24}
              color={focused ? "#007bff" : "#999999"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Hồ sơ"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="account"
              size={24}
              color={focused ? "#007bff" : "#999999"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
