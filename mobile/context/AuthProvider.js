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

  return (
    <AuthContext.Provider
      value={{ auth, setAuth, userRole, setUserRole, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
