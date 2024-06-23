import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const LogoutButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
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
