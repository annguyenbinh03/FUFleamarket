import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Profile from "../Screens/ProfileScreen/profile";
import AdminPostManager from "../AdminScreen/AdminPostManager";
import UserManager from "../AdminScreen/UserManager";
import AdminDashboard from "../AdminScreen/AdminDashboard";

const Tab = createBottomTabNavigator();

const AdminTabNavigation = () => {
  console.log("Rendering AdminTabNavigation");
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
        name="Dashboard"
        component={AdminDashboard}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="view-dashboard"
              size={24}
              color={focused ? "#007bff" : "#999999"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Quản lý đăng tin"
        component={AdminPostManager}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="post"
              size={24}
              color={focused ? "#007bff" : "#999999"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Quản lý người dùng"
        component={UserManager}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="account-group"
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
};

export default AdminTabNavigation;
