import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import formatPrice from "../utils/formatPrice";
import { getProductAPI } from "../app/api/product";
import Empty from "./Empty";

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
      <View style={styles.productItemPicContainer}>
        <Image
          source={{ uri: item.productImages }}
          style={styles.productItemPic}
        />
      </View>

      <Text style={styles.productTitle}>{item.productName}</Text>
      <Text style={styles.productPrice}>{formatPrice(item.price)} VNĐ</Text>
      <View style={styles.sellerInfo}>
        <Image
          source={{ uri: item.seller.avarta }}
          style={styles.sellerAvatar}
        />
        <Text style={styles.sellerName}>{item.createdDate}</Text>
        <Text style={styles.sellerName}>{item.storedQuatity}</Text>
        <Text style={styles.sellerName}> - </Text>
        <Text style={styles.sellerName}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );
};

const ProductListContainer = () => {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProductAPI();
      console.log("Dữ liệu API:", response.data);
      setProductList(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi API:", error);
      setError("Đã xảy ra lỗi khi tải danh sách sản phẩm");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Lỗi: {error}</Text>;
  }

  return (
    <View style={styles.productListContainerBig}>
      <Text style={styles.productListTitle}>Danh sách sản phẩm</Text>
      {productList.length > 0 ? (
        <View style={styles.productListWrapper}>
          <FlatList
            data={productList}
            numColumns={numColumns}
            renderItem={({ item }) => <ProductItem item={item} />}
            keyExtractor={(item) => item.productId.toString()}
            contentContainerStyle={styles.productListContainer}
            scrollEnabled={false}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>
      ) : (
        <Empty />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  productListContainerBig: {
    padding: 5,
    alignItems: "center",
  },
  productListWrapper: {
    width: "100%",
    alignItems: "center",
  },
  productListContainer: {
    paddingBottom: 20,
  },
  productListTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  columnWrapper: {
    justifyContent: "space-around",
  },
  productItem: {
    width: thumbMeasure,
    margin: 5,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productItemPicContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  productItemPic: {
    width: thumbMeasure - 20,
    height: thumbMeasure - 20,
    borderRadius: 8,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  productPrice: {
    fontSize: 14,
    color: "#CC0000",
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

export default ProductListContainer;
