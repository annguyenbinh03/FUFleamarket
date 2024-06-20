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

const { width, height } = Dimensions.get("screen");
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
          source={{ uri: item.productImages.imageLink }}
          style={styles.productItemPic}
        />
      </View>

      <Text style={styles.productTitle}>{item.productName}</Text>
      <Text style={styles.productPrice}>Giá: ${item.price}</Text>
      <View style={styles.sellerInfo}>
        <Image
          source={{ uri: item.seller.avarta }} // Sử dụng avarta từ API
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
    // fetch("http://10.0.2.2:5144/api/product/listproduct")
    fetch("http://10.0.2.2:7057/api/product/ListProduct")
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
    color: "#EE0000",
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
