import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import WishListAddButton from "../../../components/WishListAddButton";
import formatPrice from "../../../utils/formatPrice";
import Empty from "../../../components/Empty";
import { getProductByIdAPI } from "../../../app/api/product";
import AuthContext from "../../../context/AuthProvider";
import OrderTradeButton from "../../../components/OrderTradeButton";
import OrderBuyButton from "../../../components/OrderBuyButton";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
const { width } = Dimensions.get("window");

const Detail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);

  console.log("Auth: ", auth);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductByIdAPI(productId);
        console.log("fetchProduct: ", response.data);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error loading product information:", error);
        setError("An error occurred while loading product information");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <ActivityIndicator size="large" color="#DD0000" />;
  if (error) return <Text>{error}</Text>;
  if (!product) return <Empty />;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: product.product.productImages }}
        style={styles.productImage}
      />
      <View style={styles.wishlistButtonContainer}>
        <WishListAddButton productId={productId} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.productName}>{product.product.productName}</Text>
        <Text style={styles.productPrice}>
          {formatPrice(product.product.price)} VND
        </Text>
        <View style={styles.infoContainer}>
          <InfoItem
            icon="tag"
            text={product.product.isNew ? "Mới" : "Đã qua sử dụng"}
          />
          <InfoItem
            icon="cubes"
            text={`Số lượng: ${product.product.storedQuantity}`}
          />
          <InfoItem
            icon="list"
            text={`Danh mục: ${product.product.categoryName}`}
          />
          <InfoItem
            icon="calendar-alt"
            text={`Ngày đăng: ${product.product.createdDate}`}
          />
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Mô tả sản phẩm</Text>
          <Text style={styles.descriptionText}>
            {product.product.description}
          </Text>
        </View>
        <View style={styles.sellerInfo}>
          <Text style={styles.sellerTitle}>Thông tin người bán</Text>
          <View style={styles.sellerProfile}>
            <Image
              source={{ uri: product.product.seller.avarta }}
              style={styles.sellerAvatar}
            />
            <View style={styles.sellerDetails}>
              <Text style={styles.sellerName}>
                {product.product.seller.fullName}
              </Text>
              <Text style={styles.sellerAddress}>
                {product.address || "Chưa cung cấp địa chỉ"}
              </Text>
            </View>
          </View>
        </View>
        {auth?.userId !== product.sellerId && auth.role != 2 && (
          <View style={styles.actionButtonsContainer}>
            {product.product.dealType ? (
              <OrderTradeButton product={product} navigation={navigation} />
            ) : (
              <OrderBuyButton product={product} navigation={navigation} />
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const InfoItem = ({ icon, text }) => (
  <View style={styles.infoItem}>
    <FontAwesome5 name={icon} size={16} color="#666" />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  productImage: {
    width: width,
    height: width,
    resizeMode: "cover",
  },
  wishlistButtonContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  contentContainer: {
    padding: 15,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#DD0000",
    marginBottom: 15,
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  descriptionContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  descriptionText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  sellerInfo: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  sellerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  sellerProfile: {
    flexDirection: "row",
    alignItems: "center",
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
    marginBottom: 5,
  },
  sellerAddress: {
    fontSize: 14,
    color: "#666",
  },
  actionButtonsContainer: {
    marginTop: 15,
  },
  errorText: {
    fontSize: 18,
    color: "#DD0000",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Detail;
