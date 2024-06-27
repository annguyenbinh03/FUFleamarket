import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ChatButton from "../../../components/ChatButton";
import WishListAddButton from "../../../components/WishListAddButton";
import formatPrice from "../../../utils/formatPrice";
import Empty from "../../../components/Empty";

const { width } = Dimensions.get("window");

const Detail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://192.168.146.25:7057/api/product/GetProductById/${productId}`
        );
        setProduct(response.data.product);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#DD0000" />
      </View>
    );
  }

  if (!product) {
    return <Empty />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.productImages }}
          style={styles.productImage}
        />
        <View style={styles.wishlistButtonContainer}>
          <WishListAddButton productId={productId} />
        </View>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.productName}>{product.productName}</Text>
        <Text style={styles.productPrice}>
          {formatPrice(product.price)} VNĐ
        </Text>
        <Text style={styles.productStatus}>
          Tình trạng: {product.isNew ? "Mới" : "Đã sử dụng"}
        </Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        <SellerInfo seller={product.seller} address={product.address} />
        <View style={styles.buttonGroup}>
          <ChatButton phoneNumber={product.seller.phoneNumber} />
          <TouchableOpacity
            style={styles.orderButton}
            onPress={() => {
              navigation.navigate("CreateOrder", {
                productId: productId,
                productName: product.productName,
                productImage: product.productImages,
                productPrice: product.price,
                sellerName: product.seller.fullName,
                sellerAvatar: product.seller.avarta,
              });
            }}
          >
            <View style={styles.buttonContent}>
              <FontAwesome5 name="plus-square" size={20} color="#fff" />
              <Text style={styles.buttonText}>TẠO HÓA ĐƠN</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const SellerInfo = ({ seller, address }) => (
  <View style={styles.sellerInfoContainer}>
    <View style={styles.sellerHeader}>
      <Image source={{ uri: seller.avarta }} style={styles.sellerAvatar} />
      <View style={styles.sellerDetails}>
        <Text style={styles.sellerName}>{seller.fullName}</Text>
        <Text style={styles.sellerPhoneNumber}>{seller.phoneNumber}</Text>
      </View>
    </View>
    <View style={styles.sellerAddress}>
      <Text style={styles.khuVuc}>Khu Vực</Text>
      <View style={styles.sellerAddressFlex}>
        <FontAwesome5 name="map-marker-alt" size={16} color="#666" />
        <Text style={styles.addressText}>
          {address || "Chưa cập nhật địa chỉ"}
        </Text>
      </View>
    </View>
    <View style={styles.reportWrapper}>
      <View style={styles.reportWrapperText}>
        <FontAwesome5
          name="shield-alt"
          size={16}
          color="#4CAF50"
          style={styles.safeTradeIcon}
        />
        <Text style={styles.reportText}>
          Tin đăng này đã được kiểm duyệt. Nếu gặp vấn đề, vui lòng báo cáo tin
          đăng hoặc liên hệ CSKH để được trợ giúp.
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          // Xử lý sự kiện khi nhấn vào nút "Báo tin không hợp lệ"
        }}
        style={styles.reportButton}
      >
        <Text style={styles.reportButtonText}>Báo tin không hợp lệ</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#DC3545",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 300,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  wishlistButtonContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  contentContainer: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  productPrice: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#DC3545",
  },
  productStatus: {
    fontSize: 16,
    marginBottom: 10,
    color: "#666",
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
    lineHeight: 24,
  },
  sellerInfoContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 20,
  },
  sellerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sellerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  sellerPhoneNumber: {
    fontSize: 16,
    color: "#666",
  },
  sellerAddress: {
    marginBottom: 15,
  },
  khuVuc: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  sellerAddressFlex: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#666",
  },
  reportWrapper: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
  },
  reportWrapperText: {
    flexDirection: "row",
    marginBottom: 15,
  },
  safeTradeIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  reportText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  reportButton: {
    backgroundColor: "#DC3545",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
  },
  reportButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  orderButton: {
    backgroundColor: "#28A745",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Detail;
