import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./../Screens/HomeScreen/home";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PostProduct from "../Screens/PostProductScreen/postProduct";
import Profile from "../Screens/ProfileScreen/profile";
import PostManager from "../Screens/PostMangerScreen/postManager";
import OrderManagerScreen from "../Screens/OrderScreen/OrderManagerScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
          height: 60,
          paddingBottom: 5,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarActiveTintColor: "#FFA500",
        tabBarInactiveTintColor: "#999999",
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="PostManager"
        component={PostManager}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="post" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Đăng tin"
        component={PostProduct}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                height: 68,
                width: 68,
                borderRadius: 34,
                backgroundColor: "#FFA500",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons name="plus" size={32} color="#FFFFFF" />
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 10,
                  marginTop: 2,
                  fontWeight: "600",
                }}
              >
                Đăng tin
              </Text>
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="OrderManager"
        component={OrderManagerScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="clipboard-list"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
