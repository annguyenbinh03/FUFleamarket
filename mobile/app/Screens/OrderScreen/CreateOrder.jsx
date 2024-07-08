import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AuthContext from "../../../context/AuthProvider";
import formatPrice from "../../../utils/formatPrice";
import axios from "axios";
import { getProductByIdAPI } from "../../api/product";
import { createOrderAPI } from "../../api/order";

const CreateOrder = () => {
  const route = useRoute();
  const { productId } = route.params;
  const navigation = useNavigation();
  const { auth, logout } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [note, setNote] = useState("");
  const [formattedPrice, setFormattedPrice] = useState("");

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  const fetchProductData = async () => {
    try {
      const response = await getProductByIdAPI(productId);
      setProduct(response.data.product);
      setPrice(response.data.product.price.toString());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product data:", error);
      checkTokenExpiration(error);
      Alert.alert(
        "Lỗi",
        "Không thể lấy thông tin sản phẩm. Vui lòng thử lại sau."
      );
      setLoading(false);
    }
  };

  const handlePriceChange = (value) => {
    const unformattedValue = value.replace(/\./g, "");
    setPrice(unformattedValue);
    setFormattedPrice(formatPrice(unformattedValue));
  };

  const checkQuantity = (value) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      Alert.alert("Cảnh báo", "Vui lòng nhập một số hợp lệ.");
      setQuantity("1");
      return;
    }
    if (numValue <= 0) {
      Alert.alert("Cảnh báo", "Số lượng phải lớn hơn 0.");
      setQuantity("1");
      return;
    }
    if (numValue > product.storedQuantity) {
      Alert.alert(
        "Cảnh báo",
        `Số lượng muốn mua không được vượt quá số lượng trong kho (${product.storedQuantity}).`
      );
      setQuantity(product.storedQuantity.toString());
    } else {
      setQuantity(value);
    }
  };

  const handleCreateOrder = async () => {
    console.log("tạo đơn hàng");

    const numQuantity = parseInt(quantity);
    if (
      isNaN(numQuantity) ||
      numQuantity <= 0 ||
      numQuantity > product.storedQuantity
    ) {
      console.log("Lỗi: Số lượng sai");
      Alert.alert("Lỗi", "Số lượng không hợp lệ. Vui lòng kiểm tra lại.");
      return;
    }

    if (!price || !paymentMethod || !receiverAddress) {
      console.log("Lỗi: Thiếu thông tin bắt buộc");
      Alert.alert(
        "Lỗi",
        "Vui lòng điền đầy đủ thông tin bắt buộc (giá, phương thức thanh toán, địa điểm giao dịch)."
      );
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        productId: productId,
        quantity: numQuantity,
        price: parseInt(price),
        paymentMethod: paymentMethod,
        receiverAddress: receiverAddress,
        note: note,
      };
      console.log("Dữ liệu đơn hàng:", orderData);

      console.log("Gửi yêu cầu tạo đơn hàng");

      const response = await createOrderAPI(orderData);
      console.log("server:", response.data);

      setLoading(false);
      console.log("Tạo đơn hàng thành công may quá ");
      Alert.alert("Thông báo", "Đã tạo đơn hàng thành công!", [
        {
          text: "OK",
          onPress: () => {
            console.log("Chuyển về Detail");
            navigation.navigate("Detail", { productId: productId });
          },
        },
      ]);
    } catch (error) {
      setLoading(false);
      console.error("Lỗi tạo đơn hàng:", error);
      console.log("lỗi:", error.response?.data);
      checkTokenExpiration(error);
      Alert.alert("Lỗi", "Không thể tạo đơn hàng. Vui lòng thử lại sau.");
    }
  };

  const checkTokenExpiration = (error) => {
    if (error.response && error.response.status === 401) {
      Alert.alert("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại.");
      logout();
      navigation.navigate("Login");
    }
  };

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
        <Text style={styles.errorText}>Không thể tải thông tin sản phẩm</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.productInfo}>
        <Image
          source={{ uri: product.productImages }}
          style={styles.productImage}
        />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{product.productName}</Text>
          <Text style={styles.productPrice}>
            {formatPrice(product.price)} VNĐ
          </Text>
          <Text>Tình trạng: {product.isNew ? "Mới" : "Đã qua sử dụng"}</Text>
          <Text>Số lượng trong kho: {product.storedQuantity}</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Giá mong muốn (VNĐ):</Text>
        <TextInput
          style={styles.input}
          value={formattedPrice}
          onChangeText={handlePriceChange}
          keyboardType="numeric"
          placeholder="Nhập giá mong muốn"
        />

        <Text style={styles.label}>Số lượng:</Text>
        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
          onEndEditing={() => checkQuantity(quantity)}
          keyboardType="numeric"
          placeholder="Nhập số lượng"
          returnKeyType="done"
          onSubmitEditing={() => checkQuantity(quantity)}
        />

        <Text style={styles.label}>Phương thức thanh toán:</Text>
        <View style={styles.paymentMethods}>
          <TouchableOpacity
            style={[
              styles.paymentMethod,
              paymentMethod === "Thanh toán trực tiếp" &&
                styles.selectedPayment,
            ]}
            onPress={() => setPaymentMethod("Thanh toán trực tiếp")}
          >
            <Text>Thanh toán trực tiếp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.paymentMethod,
              paymentMethod === "Chuyển khoản" && styles.selectedPayment,
            ]}
            onPress={() => setPaymentMethod("Chuyển khoản")}
          >
            <Text>Chuyển khoản</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Địa điểm giao dịch:</Text>
        <TextInput
          style={styles.input}
          value={receiverAddress}
          onChangeText={setReceiverAddress}
          placeholder="Nhập địa điểm giao dịch"
        />

        <Text style={styles.label}>Ghi chú:</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={note}
          onChangeText={setNote}
          multiline
          placeholder="Nhập ghi chú (nếu có)"
        />

        <TouchableOpacity
          style={styles.orderButton}
          onPress={handleCreateOrder}
        >
          <FontAwesome5 name="shopping-cart" size={20} color="#fff" />
          <Text style={styles.orderButtonText}>Tạo yêu cầu mua hàng</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  productDetails: {
    marginLeft: 15,
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 16,
    color: "#DC3545",
    marginTop: 5,
  },
  formContainer: {
    padding: 15,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  paymentMethods: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  paymentMethod: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  selectedPayment: {
    backgroundColor: "#e0e0e0",
  },
  orderButton: {
    backgroundColor: "#28A745",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});

export default CreateOrder;
