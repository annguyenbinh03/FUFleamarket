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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../../../context/AuthProvider";
import LoginGoogle from "./LoginGoogle";
import { user_login } from "../../api/user_api";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth, setUserRole } = useContext(AuthContext);
  const navigation = useNavigation();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    emailRef.current.focus();
    checkExistingAuth();
  }, []);

  const checkExistingAuth = async () => {
    try {
      const existingAuth = await AsyncStorage.getItem("auth");
      if (existingAuth) {
        const authData = JSON.parse(existingAuth);
        setAuth(authData);
        setUserRole(authData.roleId);
        navigateBasedOnRole(authData.roleId);
      }
    } catch (error) {
      console.error("Error checking existing auth:", error);
    }
  };

  const navigateBasedOnRole = (roleId) => {
    if (roleId === 1) {
      navigation.navigate("TabNavigation");
    } else if (roleId === 2) {
      navigation.navigate("AdminTabNavigation");
    } else {
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
      const response = await user_login({ email, password });
      console.log("Login response:", response);

      if (response.data) {
        const { token, role, fullName, avarta, id, phoneNumber, address } =
          response.data;

        const roleId = role[0];
        console.log("Received roleId:", roleId);

        if (roleId === 1 || roleId === 2) {
          handleSuccessfulLogin({
            email,
            roleId,
            fullName,
            avarta,
            token,
            userId: id,
            phoneNumber,
            address,
          });
        } else {
          Alert.alert(
            "Không được phép",
            "Bạn không có quyền truy cập vào ứng dụng này."
          );
        }
      } else {
        setErrorMessage("Invalid response from server");
      }
    } catch (error) {
      console.error("Login Error:", error);
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulLogin = async (userData) => {
    try {
      const authData = { ...userData };
      await AsyncStorage.setItem("auth", JSON.stringify(authData));
      setAuth(authData);
      setUserRole(userData.roleId);
      navigateBasedOnRole(userData.roleId);
    } catch (error) {
      console.error("Error saving auth data:", error);
      setErrorMessage("Đã xảy ra lỗi khi lưu thông tin đăng nhập");
    }
  };

  const handleLoginError = (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          setErrorMessage("Unauthorized: Bạn không được phép truy cập!");
          break;
        case 400:
          setErrorMessage("Bad Request: Email hoặc password không đúng!");
          break;
        case 500:
          setErrorMessage("Server Error: Server đang gặp vấn đề!");
          break;
        default:
          setErrorMessage("Đăng nhập thất bại!");
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
