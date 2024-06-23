import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../../../context/AuthProvider";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth } = useContext(AuthContext);
  const navigation = useNavigation(); // Sử dụng useNavigation ở đây để lấy navigation object
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        "http://192.168.146.25:7057/api/LoginAdmin/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Response Data:", response.data);

      const { token, role, fullName, avarta, id } = response.data;

      if (role.includes(1)) {
        const authData = { email, role, fullName, avarta, token, id };
        await AsyncStorage.setItem("auth", JSON.stringify(authData));
        setAuth(authData);

        console.log("Navigating to TabNavigation");
        navigation.replace("TabNavigation");
      } else {
        Alert.alert(
          "Không được phép",
          "Bạn không có quyền truy cập vào ứng dụng này."
        );
      }
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setErrorMessage(
              "Unauthorized: You are not allowed to access this resource."
            );
            break;
          case 400:
            setErrorMessage("Bad Request: Invalid email or password.");
            break;
          case 500:
            setErrorMessage("Server Error: The server encountered an issue.");
            break;
          default:
            setErrorMessage("Login failed");
            break;
        }
      } else {
        setErrorMessage("Lỗi kết nối mạng");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <TextInput
        ref={emailRef}
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
      />
      <TextInput
        ref={passwordRef}
        style={styles.input}
        placeholder="Mật khẩu"
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        textContentType="password"
      />
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      {isLoading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    width: "80%",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    width: "80%",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default LoginScreen;
