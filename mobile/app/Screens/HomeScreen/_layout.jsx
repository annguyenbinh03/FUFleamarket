import { View, Image, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";
import { icons } from "../../../constants";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 2,
      }}
    >
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        style={{ width: 24, height: 24 }} // hoặc kích thước phù hợp với biểu tượng của bạn
      />
      <Text style={{ fontSize: 12, fontWeight: focused ? "600" : "400" }}>
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  const router = useRouter();
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false, // Ẩn header cho tất cả các màn hình
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              name="Trang chủ"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="postManager"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.bookmark}
              color={color}
              name="Quản lý tin"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="postProduct"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.plus}
              color={color}
              name="Đăng tin"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="message"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.menu}
              color={color}
              name="Tin nhắn"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.profile}
              color={color}
              name="Tôi"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
