import React from "react";
import { View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";

const Detail = () => {
  const route = useRoute();
  const productId = route.params.productId;
  return (
    <View>
      <Text>ID Sản phẩm: {productId}</Text>
    </View>
  );
};

export default Detail;
