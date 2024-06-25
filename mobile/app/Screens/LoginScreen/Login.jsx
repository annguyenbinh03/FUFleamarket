import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../../../context/AuthProvider";
import LogoutButton from "../../../components/LogoutButton";
import LoginGoogle from "./LoginGoogle";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { auth, setAuth } = useContext(AuthContext);
  const navigation = useNavigation();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    emailRef.current.focus();
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    const existingAuth = await AsyncStorage.getItem("auth");
    if (existingAuth) {
      const authData = JSON.parse(existingAuth);
      setAuth(authData);
      navigation.navigate("TabNavigation");
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage("");

    if (!email.endsWith("@fpt.edu.vn")) {
      setErrorMessage("Bạn phải đăng nhập bằng email @fpt.edu.vn");
      setIsLoading(false);
      return;
    }

    if (password.length === 0) {
      setErrorMessage("Bạn phải nhập mật khẩu");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.146.25:7057/api/LoginAdmin/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { token, role, fullName, avarta, id } = response.data;

      if (role.includes(1)) {
        handleSuccessfulLogin({ email, role, fullName, avarta, token, id });
      } else {
        Alert.alert(
          "Không được phép",
          "Bạn không có quyền truy cập vào ứng dụng này."
        );
      }
    } catch (error) {
      console.error("Login Error:", error);
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulLogin = async (userData) => {
    const authData = { ...userData };
    await AsyncStorage.setItem("auth", JSON.stringify(authData));
    setAuth(authData);
    navigation.navigate("TabNavigation");
  };

  const handleLoginError = (error) => {
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
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Đăng nhập</Text>
      <TextInput
        ref={emailRef}
        style={styles.input}
        placeholder="Email @fpt.edu.vn"
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
      <LoginGoogle />
      {auth ? <LogoutButton /> : null}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFA07A",
  },
  logo: {
    width: 250,
    height: 80,
    padding: 20,
    marginBottom: 20,
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
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    width: "80%",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default LoginScreen;
