import React, { useContext, useState, useEffect } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, CommonActions } from "@react-navigation/native";
import AdminPostManager from "../AdminScreen/AdminPostManager";
import UserManager from "../AdminScreen/UserManager";
import AdminDashboard from "../AdminScreen/AdminDashboard";
import AuthContext from "../../context/AuthProvider";
import LogoutButton from "../../components/LogoutButton";
import { getShopProfileAPI } from "../api/user_api";
import AdminPackegeManager from "../AdminScreen/AdminPackegeManager";
import AdminOrderPackage from "../AdminScreen/AdminOrderPackage";

const Tab = createBottomTabNavigator();

const AdminTabNavigation = () => {
  console.log("Rendering AdminTabNavigation");
  const { auth } = useContext(AuthContext);
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !auth.token) {
      redirectToLogin();
    } else {
      fetchUserInfo();
    }
  }, [auth]);

  const fetchUserInfo = async () => {
    try {
      const response = await getShopProfileAPI(auth.userId);
      if (response && response.data && response.data.user) {
        setUserInfo(response.data.user);
      } else {
        console.error("Invalid response structure:", response);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setLoading(false);
    }
  };

  const redirectToLogin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DD0000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profileInfo}>
          <Image source={{ uri: userInfo.avarta }} style={styles.avatar} />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{userInfo.fullName}</Text>
            <Text style={styles.role}>
              {auth.roleId === 2
                ? "Người điều hành"
                : auth.roleId == 3
                  ? "Admin"
                  : "N/A"}
            </Text>
          </View>
        </View>
        <LogoutButton />
      </View>

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
          name="Quản lý gói bán hàng"
          component={AdminPackegeManager}
          options={{
            tabBarIcon: ({ focused }) => (
              <MaterialCommunityIcons
                name="package-variant"
                size={24}
                color={focused ? "#007bff" : "#999999"}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ccc",
  },
  textContainer: {
    marginLeft: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  role: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});

export default AdminTabNavigation;
