import React, { useContext } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AuthContext from "../context/AuthProvider";
import { useNavigation } from "@react-navigation/native";

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = () => {
    logout(() => {
      // Callback được gọi sau khi đăng xuất thành công
      navigation.reset({
        index: 0,
        routes: [{ name: "Trang chủ" }],
      });
    });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <FontAwesome5
        name="sign-out-alt"
        size={20}
        color="#DD0000"
        style={styles.icon}
      />
      <Text style={styles.buttonText}>Đăng xuất</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#DD0000",
    marginLeft: 10,
  },
  icon: {
    marginLeft: 0,
  },
});

export default LogoutButton;
