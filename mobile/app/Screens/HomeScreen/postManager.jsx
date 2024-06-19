import React from "react";
import { View, Text, Button } from "react-native";

const PostManager = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Trang chợ</Text>
      <Button title="Chợ" onPress={() => console.log("Check")} />
    </View>
  );
};

export default PostManager;
