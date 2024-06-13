import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetch("http://10.0.2.2:5144/api/category") // Thay thế bằng URL API của bạn
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#FF6600" />;
  }

  return (
    <View style={styles.categoriesContainerBig}>
      <Text style={styles.categoriesTitle}>Danh mục sản phẩm</Text>
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          horizontal={true} // Hiển thị danh mục theo chiều ngang
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() =>
                navigation.navigate("ProductList", {
                  categoryId: item.categoryId,
                })
              } // Truyền categoryId khi chuyển sang ProductList
            >
              <View>
                <Image
                  source={{
                    uri: "https://lighthouse.chotot.com/_next/image?url=https%3A%2F%2Fstatic.chotot.com%2Fstorage%2Fchapy-pro%2Fnewcats%2Fv8%2F5000.png&w=256&q=95",
                  }}
                  style={styles.categoryPic}
                />
              </View>

              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.categoryId.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoriesContainerBig: {
    padding: 5,
  },
  categoriesContainer: {},
  categoriesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "left",
  },
  categoryItem: {
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryPic: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginBottom: 5, // Khoảng cách giữa icon và text
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000", // Màu đen
    textAlign: "center",
    numberOfLines: 1,
  },
});

export default Categories;
