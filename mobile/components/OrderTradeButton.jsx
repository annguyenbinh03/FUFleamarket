import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const OrderTradeButton = ({ product, navigation }) => {
  const handlePress = () => {
    const params = {
      productId: product.product.productId,
      productName: product.product.productName,
      productImage: product.product.productImages,
      productPrice: product.product.price,
      sellerName: product.product.seller.fullName,
      sellerAvatar: product.product.seller.avarta,
      sellerId: product.sellerId,
    };

    console.log("Navigating to CreateTradingOrder with params:");
    console.log(JSON.stringify(params, null, 2));

    navigation.navigate("CreateTradingOrder", params);
  };

  return (
    <TouchableOpacity style={styles.orderButton} onPress={handlePress}>
      <FontAwesome5 name="exchange-alt" size={20} color="#fff" />
      <Text style={styles.buttonText}>Tạo hóa đơn trao đổi</Text>
    </TouchableOpacity>
  );
};

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

export default OrderTradeButton;
