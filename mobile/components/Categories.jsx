import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { images } from "../constants";
import { getCategoriesAPI } from "../app/api/product";
import Empty from "./Empty";

const categoryImages = {
  1: images.dodientu,
  2: images.dodunghoctap,
  3: images.dienlanh,
  4: images.donoithat,
  5: images.thucpham,
  6: images.thoitrang,
  7: images.giaitri,
};

const CategoryItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
    <View>
      <Image
        source={categoryImages[item.categoryId]}
        style={styles.categoryPic}
      />
    </View>
    <Text style={styles.categoryText}>{item.name}</Text>
  </TouchableOpacity>
);

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCategoriesAPI();
        console.log("Dữ liệu danh mục:", response.data);
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi API:", error);
        setError("Đã xảy ra lỗi khi tải danh mục sản phẩm");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#FF6600" />;
  }

  if (error) {
    return <Text>Lỗi: {error}</Text>;
  }

  return (
    <View style={styles.categoriesContainerBig}>
      <Text style={styles.categoriesTitle}>Danh mục sản phẩm</Text>
      {categories.length > 0 ? (
        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            horizontal={true}
            renderItem={({ item }) => (
              <CategoryItem
                item={item}
                onPress={() =>
                  navigation.push("ProductListByCategory", { category: item })
                }
              />
            )}
            keyExtractor={(item) => item.categoryId.toString()}
          />
        </View>
      ) : (
        <Empty />
      )}
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
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    numberOfLines: 1,
  },
});

export default Categories;
