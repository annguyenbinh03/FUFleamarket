import React from "react";
import { View, Text, Button } from "react-native";

const PostProduct = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Trang Nhắn tin</Text>
      <Button title="Nhắn tin" onPress={() => console.log("Check")} />
    </View>
  );
};

export default PostProduct;
