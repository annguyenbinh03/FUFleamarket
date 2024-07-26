import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const OrderBuyButton = ({ product, navigation }) => (
  <TouchableOpacity
    style={styles.orderButton}
    onPress={() => {
      navigation.navigate("CreateOrder", {
        productId: product.product.productId,
      });
    }}
  >
    <FontAwesome5 name="credit-card" size={20} color="#fff" />
    <Text style={styles.buttonText}>Tạo hóa đơn mua</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  orderButton: {
    backgroundColor: "#DD0000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 5,
    flex: 1,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OrderBuyButton;
