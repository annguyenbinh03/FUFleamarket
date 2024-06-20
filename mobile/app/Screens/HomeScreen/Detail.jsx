import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
// import Stars from "react-native-stars-view";

const Detail = () => {
  const route = useRoute();
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSaveProduct = () => {
    console.log("Save product:", product);
  };

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
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Không tìm thấy sản phẩm</Text>
      </View>
    );
  }

  const formattedPrice = product.price
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: product.productImages.imageLink }}
        style={styles.productImage}
      />
      <TouchableOpacity onPress={handleSaveProduct} style={styles.saveButton}>
        <FontAwesome5 name="heart" size={20} color="#DD0000" />
        <Text style={{ marginLeft: 5 }}>Lưu tin</Text>
      </TouchableOpacity>
      <Text style={styles.productName}>{product.productName}</Text>
      <Text style={styles.productPrice}>Giá: {formattedPrice} VNĐ</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
      <SellerInfo seller={product.seller} address={product.address} />
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => {
            // Xử lý khi nhấn vào nút chat
          }}
        >
          <View style={styles.buttonContent}>
            <FontAwesome5 name="comments" size={20} color="#fff" />
            <Text style={styles.buttonText}>CHAT VỚI NGƯỜI BÁN</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => {
            // Xử lý khi nhấn vào nút tạo hóa đơn
          }}
        >
          <View style={styles.buttonContent}>
            <FontAwesome5 name="plus-square" size={20} color="#fff" />
            <Text style={styles.buttonText}>TẠO HÓA ĐƠN</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const SellerInfo = ({ seller, address }) => (
  <View style={styles.sellerInfoContainer}>
    <Image source={{ uri: seller.avarta }} style={styles.sellerAvatar} />
    <View style={styles.sellerDetails}>
      {/* <Stars
        default={4}
        count={5}
        half={true}
        starSize={50}
        fullStar={<Text style={[styles.starStyle]}>★</Text>}
        emptyStar={
          <Text style={[styles.starStyle, styles.emptyStarStyle]}>☆</Text>
        }
        halfStar={<Text style={[styles.starStyle]}>★</Text>}
      /> */}
      <Text style={styles.sellerName}>{seller.fullName}</Text>
      <Text style={styles.sellerPhoneNumber}>SĐT: {seller.phoneNumber}</Text>
    </View>
    <View style={styles.sellerAddress}>
      <Text style={styles.khuVuc}>Khu Vực</Text>
      <View style={styles.sellerAddressFlex}>
        <View style={styles.sellerAddressLeft}>
          <Image
            style={styles.locationIcon}
            source={{
              uri: "https://static.chotot.com/storage/icons/logos/ad-param/location.svg",
            }}
          />
        </View>
        <View style={styles.sellerAddressRight}>
          <Text>
            {address || "Người này chưa tiết lộ thông tin về địa chỉ"}
          </Text>
        </View>
      </View>
    </View>
    <View style={styles.reportWrapper}>
      <View style={styles.reportWrapperText}>
        <View style={styles.reportWrapperTextLeft}>
          <Image
            style={styles.safeTradeIcon}
            source={{
              uri: "https://static.chotot.com/storage/marketplace/shield-iconx4.png",
            }}
          />
        </View>
        <View style={styles.reportWrapperTextRight}>
          <Text>
            Tin đăng này đã được kiểm duyệt. Nếu gặp vấn đề, vui lòng báo cáo
            tin đăng hoặc liên hệ CSKH để được trợ giúp.
          </Text>
          <TouchableOpacity
            onPress={() => {
              // Xử lý sự kiện khi nhấn vào link "Xem thêm"
            }}
          >
            <Text style={styles.readMoreLink}>Xem thêm ››</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.reportWrapperButton}>
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
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
  },
  productImage: {
    width: "100%",
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: -30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DD0000",
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  productPrice: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
    color: "#CC0000",
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  sellerInfoContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  sellerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: "bold",
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
  },
  sellerAddressFlex: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sellerAddressLeft: {
    marginRight: 10,
  },
  sellerAddressRight: {
    flex: 1,
  },
  locationIcon: {
    width: 20,
    height: 20,
  },
  reportWrapper: {
    marginTop: 20,
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
  },
  reportWrapperText: {
    flexDirection: "row",
    marginBottom: 10,
  },
  reportWrapperTextLeft: {
    marginRight: 10,
  },
  safeTradeIcon: {
    width: 20,
    height: 20,
  },
  reportWrapperTextRight: {
    flex: 1,
  },
  readMoreLink: {
    color: "blue",
    textDecorationLine: "underline",
  },
  reportWrapperButton: {
    flexDirection: "row",
    justifyContent: "center",
  },
  reportButton: {
    backgroundColor: "#DD0000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  reportButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
  },
  chatButton: {
    backgroundColor: "#1E90FF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  orderButton: {
    backgroundColor: "#009933",
    paddingVertical: 10,
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
    marginLeft: 5,
  },
  starStyle: {
    fontSize: 25,
    color: "#FFD700", // Màu vàng
  },
  emptyStarStyle: {
    color: "#CCCCCC", // Màu xám
  },
});

export default Detail;
