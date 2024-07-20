import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const login = async (userData, authToken, role) => {
    try {
      await AsyncStorage.setItem("@user", JSON.stringify(userData));
      await AsyncStorage.setItem("auth", authToken);
      await AsyncStorage.setItem("userRole", role);
      setAuth(authToken);
      setUserRole(role);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = async (callback) => {
    try {
      await AsyncStorage.multiRemove(["@user", "auth", "userRole"]);
      setAuth(null);
      setUserRole(null);
      if (callback) callback();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const checkAuth = async () => {
    try {
      const authToken = await AsyncStorage.getItem("auth");
      const role = await AsyncStorage.getItem("userRole");
      if (authToken) {
        setAuth(authToken);
        setUserRole(role);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        userRole,
        setUserRole,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
