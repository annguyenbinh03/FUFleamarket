import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  useEffect(() => {
    const loadStoredAuth = async () => {
      const storedAuth = await AsyncStorage.getItem("auth");
      if (storedAuth) {
        setAuth(JSON.parse(storedAuth));
      }
    };

    loadStoredAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
