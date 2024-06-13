import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

const DetailProduct = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [showPhone, setShowPhone] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://localhost:7057/api/product/listproduct/${productId}`
        );
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleShowPhone = () => {
    setShowPhone(true);
  };

  const handleShowChat = () => {
    setShowChat(true);
  };

  const handleCreateOrder = () => {
    navigation.navigate("CreateOrder", { productId });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.productContainer}>
        {/* Product Image */}
        {product && product.images && product.images.length > 0 && (
          <Image
            source={{ uri: product.images[0] }}
            style={styles.productImage}
          />
        )}

        {/* Product Details */}
        <View style={styles.productDetails}>
          {/* Product Name */}
          <Text style={styles.productName}>
            {product?.productName || "Sản phẩm không tồn tại"}
          </Text>

          {/* Price */}
          <Text style={styles.productPrice}>${product?.price || ""}</Text>

          {/* Description */}
          <Text style={styles.productDescription}>
            {product?.description ||
              "Cửa Mình thanh lý tủ lạnh máy giặt đang sử dụng hoạt động tốt ạ tủ lạnh từ 90l đến 500l Giá tủ lạnh từ 1tr2 chở lên Máy giặt từ 1tr5 chở lên Máy giặt từ 7kg đến 15kg Bảo hành lâu dài uy tín miễn phí vận chuyển"}
          </Text>

          {/* Seller Information */}
          <View style={styles.sellerInfo}>
            <Text style={styles.sellerInfoTitle}>Thông tin người bán</Text>
            <View style={styles.sellerInfoContent}>
              <Image
                source={{
                  uri:
                    product?.seller?.avarta ||
                    "https://cdn.chotot.com/G-1Z5ZbUlOQ2uJVjMhxxCver9aggaeYCn5ViRzXSzJY/preset:uac/plain/5880693cc1e7c23bec7c83355df078f1-731e14cfed11748e400f5a652062afa74f966b5d.jpg",
                }}
                style={styles.sellerAvatar}
              />
              <View>
                <Text style={styles.sellerName}>
                  {product?.seller?.fullName || "Shop của best yasuo viet nam"}
                </Text>
                <Text style={styles.sellerLocation}>
                  {product?.seller?.addresses?.[0]?.specificAddress ||
                    "Người này chưa tiết lộ thông tin về địa chỉ"}
                </Text>
              </View>
            </View>
          </View>

          {/* Phone Number */}
          <TouchableOpacity
            style={[styles.button, styles.phoneButton]}
            onPress={handleShowPhone}
          >
            <FontAwesome5 name="phone" size={20} color="#fff" />
            {showPhone ? (
              <Text style={styles.buttonText}>
                {product?.seller?.phoneNumber || "096595 ***"}
              </Text>
            ) : (
              <Text style={styles.buttonText}>Hiển thị số điện thoại</Text>
            )}
          </TouchableOpacity>

          {/* Chat */}
          <TouchableOpacity
            style={[styles.button, styles.chatButton]}
            onPress={handleShowChat}
          >
            <FontAwesome5 name="comments" size={20} color="#fff" />
            <Text style={styles.buttonText}>Chat với người bán</Text>
          </TouchableOpacity>

          {/* Create Order */}
          <TouchableOpacity
            style={[styles.button, styles.createOrderButton]}
            onPress={handleCreateOrder}
          >
            <FontAwesome5 name="plus-square" size={20} color="#fff" />
            <Text style={styles.buttonText}>Tạo hóa đơn</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
export default DetailProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  productContainer: {
    padding: 16,
  },
  productImage: {
    width: windowWidth - 32,
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
  },
  productDetails: {
    marginTop: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  sellerInfo: {
    marginBottom: 16,
  },
  sellerInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sellerInfoContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  sellerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  sellerLocation: {
    fontSize: 12,
  },
  button: {
    width: windowWidth - 32,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  phoneButton: {
    backgroundColor: "#3498db",
  },
  chatButton: {
    backgroundColor: "#2ecc71",
  },
  createOrderButton: {
    backgroundColor: "#1abc9c",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
});
