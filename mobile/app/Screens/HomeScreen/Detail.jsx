import React from "react";
import { View, Text, useRoute } from "react-native";

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
