import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const AdminNagativeButton = ({ to, title, style, textStyle }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={() => navigation.navigate(to)}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#FFA500",
    padding: 5,
    paddingHorizontal: 10,

    borderRadius: 15,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AdminNagativeButton;
