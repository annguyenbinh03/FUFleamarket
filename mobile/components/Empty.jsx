import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { images } from "../constants";

const Empty = () => {
  return (
    <View style={styles.emptyContainer}>
      <Image source={images.empty} style={styles.emptyImage} />
      <Text style={styles.emptyText}>Không có sản phẩm nào!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
  },
});

export default Empty; // Update the export to Empty
