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

const { width } = Dimensions.get("screen");
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

  useEffect(() => {
    fetch("http://192.168.146.25:7057/api/product/ListProduct")
      .then((res) => res.json())
      .then((data) => {
        data.sort((a, b) => {
          const aDays = parseInt(a.createdDate.split(" ")[0]);
          const bDays = parseInt(b.createdDate.split(" ")[0]);
          return aDays - bDays;
        });
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
