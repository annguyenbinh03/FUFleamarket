import React, { useState, useEffect, useCallback } from "react";
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
import Empty from "../../../components/Empty";

const WishListScreen = ({ route }) => {
  const { userId } = route.params;
  const navigation = useNavigation();
  console.log("Received User ID:", userId);

  const [wishlistItems, setWishlistItems] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchWishList = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://192.168.146.25:7057/api/Wishlist/user/${userId}`
      );
      console.log("Check API Response:", response.data);
      setWishlistItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Check Error fetching wishlist:", error);
      setError(true);
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchWishList();
  }, [fetchWishList]);

  useEffect(() => {
    console.log("Check Wishlist Items:", wishlistItems);
  }, [wishlistItems]);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#DD0000" />
      </View>
    );
  }

  if (error || wishlistItems.length === 0) {
    return <Empty />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wish List</Text>
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
              source={{
                uri: "https://th.bing.com/th/id/OIP.cbb6B9U2dodLdEToGb7XLAHaHa?w=178&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
              }}
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.productName}</Text>
              <Text style={styles.productPrice}>
                {formatPrice(item.price)} VND
              </Text>
              <View style={styles.sellerInfo}>
                <Text style={styles.createdDate}>
                  {formatDate(item.createdDate)}
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
    gap: 10,
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
    gap: 10,
  },
  productInfo: {
    flex: 1,
  },
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
  createdDate: {
    fontSize: 10,
    color: "#555",
  },
});

export default WishListScreen;
