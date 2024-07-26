import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { getProductAPI } from "../app/api/product";
import formatPrice from "../utils/formatPrice";

const { width } = Dimensions.get("screen");
const numColumns = 2;
const thumbMeasure = (width - 48 - 32) / numColumns;

const ProductItem = ({ item }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Detail", { productId: item.productId })
      }
      style={styles.productItem}
    >
      <View style={styles.iconContainer}>
        <FontAwesome5
          name={item.dealType ? "exchange-alt" : "credit-card"}
          size={16}
          color="#fff"
          style={styles.icon}
        />
      </View>
      <Image
        source={{ uri: item.productImages }}
        style={styles.productItemPic}
      />
      <Text style={styles.productTitle} numberOfLines={2}>
        {item.productName}
      </Text>
      <Text style={styles.productPrice}>{formatPrice(item.price)} VND</Text>
      <View style={styles.sellerInfo}>
        <Image
          source={{ uri: item.seller.avarta }}
          style={styles.sellerAvatar}
        />
        <Text style={styles.sellerName}>{item.createdDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

const ProductListContainer = ({ refreshing }) => {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProductAPI();
      console.log("Dữ liệu API:", response.data);
      setProductList(response.data);
    } catch (error) {
      console.error("Lỗi API:", error);
      console.log("lỗi ở listproduct");
      setError("Đã xảy ra lỗi khi tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (refreshing) {
      fetchProducts();
    }
  }, [refreshing, fetchProducts]);

  if (loading && !refreshing) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error && !refreshing) {
    return <Text>Lỗi: {error}</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.productListTitle}>Danh sách sản phẩm</Text>
      <FlatList
        data={productList}
        numColumns={numColumns}
        renderItem={({ item }) => <ProductItem item={item} />}
        keyExtractor={(item) => item.productId.toString()}
        contentContainerStyle={styles.productListContainer}
        columnWrapperStyle={styles.columnWrapper}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  productListContainer: {
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  productListTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
    marginLeft: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  productItem: {
    width: thumbMeasure,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  productItemPic: {
    width: "100%",
    height: thumbMeasure,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    marginHorizontal: 8,
    height: 40,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#CC0000",
    marginHorizontal: 8,
    marginTop: 4,
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginHorizontal: 8,
    marginBottom: 8,
  },
  sellerAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  sellerName: {
    fontSize: 12,
    color: "#555",
  },
  iconContainer: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    padding: 4,
  },
  icon: {
    textAlign: "center",
  },
});

export default ProductListContainer;
