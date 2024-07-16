import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

const TradingOrderRequestButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate("TradingOrderRequest")}
    >
      <FontAwesome5
        name="exchange-alt"
        size={20}
        color="#0066CC"
        style={styles.icon}
      />
      <Text style={styles.buttonText}>Yêu cầu giao dịch</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  buttonText: {
    marginLeft: 15,
    fontSize: 16,
    color: "#333",
  },
  icon: {
    width: 20,
    textAlign: "center",
  },
});

export default TradingOrderRequestButton;
