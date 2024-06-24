import React, { useState, useEffect } from "react";
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
import { getProductAPI } from "../app/api/product";

const { width, height } = Dimensions.get("screen");
const numColumns = 2;
const thumbMeasure = (width - 48 - 32) / numColumns;

const ProductItem = ({ item }) => {
  const navigation = useNavigation();

  const formattedPrice = item.price
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Detail", { productId: item.productId })
      }
      style={styles.productItem}
    >
      <View style={styles.productItemPicContainer}>
        <Image
          source={
            item.productImages && item.productImages.imageLink
              ? { uri: item.productImages.imageLink }
              : {
                  uri: "https://th.bing.com/th/id/OIP.cbb6B9U2dodLdEToGb7XLAHaHa?w=178&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
                }
          }
          style={styles.productItemPic}
        />
      </View>

      <Text style={styles.productTitle}>{item.productName}</Text>
      <Text style={styles.productPrice}>{formattedPrice} VNĐ</Text>
      <View style={styles.sellerInfo}>
        <Image
          source={{ uri: item.seller.avarta }}
          style={styles.sellerAvatar}
        />
        <Text style={styles.sellerName}>{item.createdDate}</Text>
        <Text style={styles.sellerName}> - </Text>
        <Text style={styles.sellerName}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );
};

const ProductListContainer = () => {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  // useEffect(() => {
  //   getProductAPI()
  //     .then((repoonse) => {
  //       console.log(repoonse);
  //       setProductList(repoonse.data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching product data:", err);
  //       setLoading(false);
  //     });
  // }, []);

  // if (loading) {
  //   return <ActivityIndicator size="large" color="#0000ff" />;
  // }

  useEffect(() => {
    //fetch("http://192.168.110.7:8081/api/product/Listproduct")
    // fetch("http://192.168.110.7:7057/api/product/ListProduct")
    fetch("http://192.168.146.25:7057/api/product/ListProduct")
      .then((res) => res.json())
      .then((data) => {
        setProductList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.productListContainerBig}>
      <Text style={styles.productListTitle}>Danh sách sản phẩm</Text>
      <View style={styles.productListContainer}>
        <FlatList
          data={productList}
          numColumns={numColumns}
          renderItem={({ item, index }) => <ProductItem item={item} />}
          keyExtractor={(item) => item.productId.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productListContainerBig: {
    padding: 5,
  },
  productListContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  productListTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "left", // Căn trái
  },
  productItem: {
    width: thumbMeasure - 0, // Điều chỉnh width để phù hợp với khoảng cách
    margin: 5, // Giảm margin để tạo khoảng cách phù hợp
    padding: 20,
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
    width: thumbMeasure - 16,
    height: thumbMeasure - 16,
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
