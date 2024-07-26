import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import formatPrice from "../../../utils/formatPrice";
import { formatDate } from "../../../utils/formatDate";
import AuthContext from "../../../context/AuthProvider";
import Empty from "../../../components/Empty";

const WishListScreen = () => {
  const navigation = useNavigation();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { auth } = useContext(AuthContext);
  const [error, setError] = useState();
  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get(
        `https://fufleamarketapis.azurewebsites.net/api/Wishlist/user/${auth.userId}`
      );
      console.log("Wishlist: ", response.data);
      setWishlistItems(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      console.error("Error fetching wishlist:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#DD0000" />
      </View>
    );
  }
  if (error) {
    return <Text>Không có sản phẩm</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={wishlistItems}
        keyExtractor={(item) => item.productId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.productItem}
            onPress={() =>
              navigation.navigate("Detail", { productId: item.productId })
            }
          >
            <Image
              source={{ uri: item.imageLink }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.productName}</Text>
              <Text style={styles.productPrice}>
                {formatPrice(item.price)} VND
              </Text>
              <View style={styles.additionalInfo}>
                <Text style={styles.createdDate}>
                  Ngày tạo: {formatDate(item.createdDate)}
                </Text>
                <Text style={styles.dealType}>
                  Loại giao dịch: {item.dealType ? "Bán" : "Trao đổi"}
                </Text>
                <Text style={styles.isNew}>
                  Tình trạng: {item.isNew ? "Mới" : "Đã sử dụng"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
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
    padding: 10,
  },
  productInfo: {
    flex: 1,
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 15,
    borderRadius: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 16,
    color: "#FF6600",
    marginTop: 5,
  },
  additionalInfo: {
    marginTop: 5,
  },
  createdDate: {
    fontSize: 12,
    color: "#555",
  },
  dealType: {
    fontSize: 12,
    color: "#555",
  },
  isNew: {
    fontSize: 12,
    color: "#555",
  },
});

export default WishListScreen;
