import React, { useContext } from "react";
import { TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../context/AuthProvider";
import { images } from "../constants/images";

const WishListButton = () => {
  const { auth } = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        navigation.navigate("WishListScreen", { userId: auth.id });
        console.log("User ID:", auth.id);
      }}
    >
      <FontAwesome5
        name="heart"
        size={20}
        color="#DD0000"
        style={styles.icon}
      />
      <Text style={styles.buttonText}>Tin đã lưu</Text>
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

export default WishListButton;
