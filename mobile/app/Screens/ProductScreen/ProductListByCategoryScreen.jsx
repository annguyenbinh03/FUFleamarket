import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  sortProductsByDate,
  sortProductsByPrice,
} from "../../../utils/filterProduct";
import formatPrice from "../../../utils/formatPrice";
import { Picker } from "@react-native-picker/picker";

export default function ProductListByCategory() {
  const route = useRoute();
  const { category } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [dateSortOrder, setDateSortOrder] = useState("desc"); // Default to descending
  const [priceSortOrder, setPriceSortOrder] = useState("desc"); // Default to descending
  const [selectedDateSortOrder, setSelectedDateSortOrder] = useState("desc");
  const [selectedPriceSortOrder, setSelectedPriceSortOrder] = useState("desc");

  useEffect(() => {
    fetch("http://192.168.146.25:7057/api/product/ListProduct")
      .then((res) => res.json())
      .then((data) => {
        const filteredProducts = data.filter(
          (product) => product.categoryId === category.categoryId
        );

        let sortedProducts = filteredProducts; // Start with unfiltered data

        // Sort by price first
        if (priceSortOrder === "asc") {
          sortedProducts = sortProductsByPrice(sortedProducts, true);
        } else {
          sortedProducts = sortProductsByPrice(sortedProducts, false);
        }

        // Sort by date (applied after price sorting)
        if (dateSortOrder === "asc") {
          sortedProducts = sortProductsByDate(sortedProducts, true);
        } else {
          sortedProducts = sortProductsByDate(sortedProducts, false);
        }

        setProducts(sortedProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products data:", err);
        setLoading(false);
      });
  }, [category, dateSortOrder, priceSortOrder]);

  const applySorting = () => {
    setDateSortOrder(selectedDateSortOrder);
    setPriceSortOrder(selectedPriceSortOrder);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#FF6600" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category.name}</Text>
      <View style={styles.sortContainer}>
        <View style={styles.sortContainerItem}>
          <Text style={styles.sortTitle}>Sắp xếp theo ngày:</Text>
          <Picker
            selectedValue={selectedDateSortOrder}
            onValueChange={(value) => setSelectedDateSortOrder(value)}
            style={styles.picker}
          >
            <Picker.Item label="Mới nhất" value="desc" />
            <Picker.Item label="Cũ nhất" value="asc" />
          </Picker>
        </View>
        <View style={styles.sortContainerItem}>
          <Text style={styles.sortTitle}>Sắp xếp theo giá:</Text>
          <Picker
            selectedValue={selectedPriceSortOrder}
            onValueChange={(value) => setSelectedPriceSortOrder(value)}
            style={styles.picker}
          >
            <Picker.Item label="Giá thấp nhất" value="asc" />
            <Picker.Item label="Giá cao nhất" value="desc" />
          </Picker>
        </View>
        <Button title="Áp dụng" onPress={applySorting} />
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.productId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productItem}
            onPress={() =>
              navigation.navigate("Detail", { productId: item.productId })
            }
          >
            <View style={styles.productItem}>
              <Image
                source={
                  item.productImages && item.productImages.imageLink
                    ? { uri: item.productImages.imageLink }
                    : {
                        uri: "https://th.bing.com/th/id/OIP.cbb6B9U2dodLdEToGb7XLAHaHa?w=178&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
                      }
                }
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
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sortContainerItem: {
    marginRight: 20,
  },
  sortTitle: {
    fontSize: 16,
  },
  picker: {
    height: 30,
    width: 100,
  },
});
