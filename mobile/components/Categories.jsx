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
import { images } from "../constants";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const categoryImages = {
    1: images.dodientu,
    2: images.dodunghoctap,
    3: images.dienlanh,
    4: images.donoithat,
    5: images.thucpham,
    6: images.thoitrang,
    7: images.giaitri,
  };

  useEffect(() => {
    // fetch("http://10.0.2.2:7057/api/category")
    fetch("http://192.168.110.7:7057/api/category")
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
          horizontal={true}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() =>
                navigation.navigate("ProductList", {
                  categoryId: item.categoryId,
                })
              }
            >
              <View>
                <Image
                  source={categoryImages[item.categoryId]}
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
    marginBottom: 5,
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
