import React from "react";
import { View, Text, useRoute } from "react-native";

const Detail = () => {
  const route = useRoute();
  const productId = route.params.productId;

  // ... Lấy thông tin sản phẩm dựa trên productId từ API hoặc dữ liệu local ...

  return (
    <View>
      {/* Hiển thị thông tin chi tiết của sản phẩm dựa trên productId */}
      <Text>ID Sản phẩm: {productId}</Text>
      {/* ... hiển thị các thông tin khác ... */}
    </View>
  );
};

export default Detail;
