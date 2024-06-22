import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function ProductListByCategoryScreen() {
  const route = useRoute();
  const { category } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://192.168.146.25:7057/api/product/ListProduct")
      .then((res) => res.json())
      .then((data) => {
        const filteredProducts = data.filter(
          (product) => product.categoryId === category.categoryId
        );
        setProducts(filteredProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products data:", err);
        setLoading(false);
      });
  }, [category]);

  if (loading) {
    return <ActivityIndicator size="large" color="#FF6600" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category.name}</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.productId.toString()}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Image
              source={{ uri: item.productImages.imageLink }}
              style={styles.productImage}
            />
            <View styles={styles.productItem}>
              <Text style={styles.productName}>{item.productName}</Text>
              <Text style={styles.productPrice}>
                {formatPrice(item.price)} VND
              </Text>
              <View style={styles.sellerInfo}>
                <Image
                  source={{ uri: item.seller.avarta }}
                  style={styles.sellerAvatar}
                />
                <Text style={styles.sellerName}>{item.sellerName}</Text>
                <Text style={styles.sellerName}>{item.createdDate}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    gap: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 15,
  },
  productItem: {
    flexDirection: "row",
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: "white",
    gap: 10,
  },
  productInfo: {},
  productImage: {
    width: 100,
    height: 100,
    marginRight: 15,
    borderRadius: 15,
    shadowColor: "black",
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 15,
    color: "#FF6600",
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  sellerAvatar: {
    width: 15,
    height: 15,
    borderRadius: 15,
    marginRight: 5,
  },
  sellerName: {
    fontSize: 10,
    color: "#555",
  },
});
