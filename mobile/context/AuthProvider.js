import React, { createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("@user");
      await AsyncStorage.removeItem("auth");
      setAuth(null);
      setUserRole(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const updateAuth = async (userData) => {
    try {
      await AsyncStorage.setItem("auth", JSON.stringify(userData));
      setAuth(userData);
      setUserRole(userData.roleId);
    } catch (error) {
      console.error("Error updating auth:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, userRole, setUserRole, logout, updateAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
