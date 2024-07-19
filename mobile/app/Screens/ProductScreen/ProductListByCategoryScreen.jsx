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
import { Picker } from "@react-native-picker/picker";
import { getCategoriesAPI, getProductAPI } from "../../api/product";
import formatPrice from "./../../../utils/formatPrice";

export default function ProductListByCategory() {
  const route = useRoute();
  const navigation = useNavigation();
  const { category } = route.params;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(category.categoryId);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const productResponse = await getProductAPI();
      const categoryResponse = await getCategoriesAPI();

      setProducts(productResponse.data);
      setCategories(categoryResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(
    (product) => product.categoryId === selectedCategory
  );

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
          onValueChange={(value) => setSelectedCategory(value)}
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
                Giá: {formatPrice(item.price)} VND
              </Text>
              <Text>Loại : {item.dealType ? "Trao đổi" : "Bán"}</Text>
              <Text>Tình trạng: {item.isNew ? "Mới" : "Đã sử dụng"}</Text>
              <Text>Người bán: {item.seller.fullName}</Text>
              <Text>Ngày đăng: {item.createdDate}</Text>
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
    fontSize: 20,
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
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 15,
    borderRadius: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: "#FF6600",
    marginTop: 5,
  },
});
