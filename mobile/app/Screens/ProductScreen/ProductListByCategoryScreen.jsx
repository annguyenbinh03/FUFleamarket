import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import formatPrice from "../../../utils/formatPrice";
import { Picker } from "@react-native-picker/picker";

export default function ProductListByCategory() {
  const route = useRoute();
  const { category } = route.params;
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category.categoryId);
  const navigation = useNavigation();

  useEffect(() => {
    Promise.all([
      fetch("http://192.168.146.25:7057/api/product/ListProduct").then((res) =>
        res.json()
      ),
      fetch("http://192.168.146.25:7057/api/category").then((res) =>
        res.json()
      ),
    ])
      .then(([productData, categoryData]) => {
        setProducts(productData);
        setCategories(categoryData);
        filterProducts(productData, category.categoryId);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, [category]);

  const filterProducts = (products, categoryId) => {
    const filtered = products.filter(
      (product) => product.categoryId === categoryId
    );
    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    filterProducts(products, categoryId);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#FF6600" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sản phẩm theo danh mục</Text>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Chọn danh mục:</Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={handleCategoryChange}
          style={styles.picker}
        >
          {categories.map((cat) => (
            <Picker.Item
              key={cat.categoryId}
              label={cat.name}
              value={cat.categoryId}
            />
          ))}
        </Picker>
      </View>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.productId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productItem}
            onPress={() =>
              navigation.navigate("Detail", { productId: item.productId })
            }
          >
            <Image
              source={{ uri: item.productImages }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
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
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 15,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  productItem: {
    flexDirection: "row",
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: "white",
    padding: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 15,
    borderRadius: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 16,
    color: "#FF6600",
    marginTop: 5,
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  sellerAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  sellerName: {
    fontSize: 12,
    color: "#555",
    marginRight: 10,
  },
});
