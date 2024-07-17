// AuthWrapper.js
import React, { useContext, useEffect } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../context/AuthProvider";

const AuthWrapper = ({ children, allowedRoles = [] }) => {
  const { auth, userRole } = useContext(AuthContext);
  const navigation = useNavigation();

  const showLoginAlert = () => {
    Alert.alert(
      "Yêu cầu đăng nhập",
      "Bạn cần đăng nhập để sử dụng tính năng này",
      [
        {
          text: "Hủy",
          onPress: () => navigation.navigate("Trang chủ"),
          style: "cancel",
        },
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]
    );
  };

  useEffect(() => {
    if (!auth || !auth.token) {
      showLoginAlert();
    } else if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      Alert.alert(
        "Không có quyền truy cập",
        "Bạn không có quyền sử dụng tính năng này"
      );
      navigation.navigate("Trang chủ");
    }
  }, [auth, userRole]);

  if (
    auth &&
    auth.token &&
    (allowedRoles.length === 0 || allowedRoles.includes(userRole))
  ) {
    return children;
  }

  return null;
};

export default AuthWrapper;
