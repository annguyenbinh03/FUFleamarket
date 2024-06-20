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

  const categoryImages = {
    1: "https://th.bing.com/th/id/OIP.BGwhDC-5eqhHHqZkDPDMygHaE7?rs=1&pid=ImgDetMain",
    2: "https://th.bing.com/th/id/OIP.h8ad_GoFNr756ufq9-aaNwAAAA?pid=ImgDet&w=204&h=175&c=7",
    3: "https://th.bing.com/th/id/OIP.eCRz4IvORHX8GuPK9QtnBQAAAA?rs=1&pid=ImgDetMain",

    4: "https://th.bing.com/th/id/R.d5e39142b9c02fd27a0323ea09f50294?rik=1IKuzLMieHFNrA&pid=ImgRaw&r=0",

    5: "https://th.bing.com/th/id/OIP.WRjgN9bpfQAMR9FG4RVUQgHaI3?rs=1&pid=ImgDetMain",

    6: "https://i.pinimg.com/originals/b0/9e/ee/b09eee4a864f044d7616cf3fd8271279.jpg",
    7: "https://th.bing.com/th/id/OIP.jxfGNxjhixVX3BMtJ_H4vgAAAA?rs=1&pid=ImgDetMain",
    8: "https://th.bing.com/th/id/OIP.ID8Wa0zGXGAaRuqICpPyoAHaER?w=323&h=186&c=7&r=0&o=5&pid=1.7",
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
                  source={{
                    uri:
                      categoryImages[item.categoryId] ||
                      "https://lighthouse.chotot.com/_next/image?url=https%3A%2F%2Fstatic.chotot.com%2Fstorage%2Fchapy-pro%2Fnewcats%2Fv8%2F5000.png&w=256&q=95",
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
