import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  getMyTradingOrderAPI,
  user1CompleteTradingRequest,
  user1RejectTradingRequest,
} from "../../api/tradingOrder";
import AuthContext from "../../../context/AuthProvider";

const TradingOrder = () => {
  const [orders, setOrders] = useState([]);
  const { auth, setAuth } = useContext(AuthContext);
  const navigation = useNavigation();

  console.log("Auth:", auth);

  const sortBy = "date";

  const checkTokenValidity = async () => {
    if (!auth.token) {
      Alert.alert("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại.");
      navigation.navigate("Login");
      return false;
    }

    try {
      // Gọi một API đơn giản để kiểm tra token
      await getMyTradingOrderAPI(auth.token, 1, sortBy);
      return true;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại.");
        setAuth({});
        navigation.navigate("Login");
        return false;
      }
      console.error("Lỗi khi kiểm tra token:", error);
      return false;
    }
  };

  const fetchOrder = async () => {
    console.log("Đang tải danh sách đơn hàng...");
    if (await checkTokenValidity()) {
      try {
        const response = await getMyTradingOrderAPI(auth.token, 1, sortBy);
        setOrders(response.data);
        console.log("Đã tải xong danh sách đơn hàng:", response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách đơn hàng:", error);
        if (error.response && error.response.status === 404) {
          Alert.alert("Thông báo", "Bạn hiện chưa có đơn hàng nào");
        } else {
          Alert.alert(
            "Lỗi",
            "Đã xảy ra lỗi khi tải đơn hàng. Vui lòng thử lại sau."
          );
        }
      }
    }
  };

  const handleCompleteOrder = async (orderId) => {
    console.log("Đang xác nhận hoàn thành đơn hàng:", orderId);
    if (await checkTokenValidity()) {
      try {
        await user1CompleteTradingRequest(auth.token, orderId);
        console.log("Đã xác nhận hoàn thành đơn hàng thành công");
        fetchOrder();
      } catch (error) {
        console.error("Lỗi khi xác nhận hoàn thành đơn hàng:", error);
      }
    }
  };

  const handleRejectOrder = async (orderId) => {
    console.log("Đang từ chối đơn hàng:", orderId);
    if (await checkTokenValidity()) {
      try {
        await user1RejectTradingRequest(auth.token, orderId);
        console.log("Đã từ chối đơn hàng thành công");
        fetchOrder();
      } catch (error) {
        console.error("Lỗi khi từ chối đơn hàng:", error);
      }
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text>Bên yêu cầu: {item.user1?.fullName}</Text>
      <View style={styles.productList}>
        {item.user1TradingOrderDetails?.map((product) => (
          <View key={product.tradingOrderDetailId} style={styles.productItem}>
            <Image
              source={{ uri: product.product?.imageLink }}
              style={styles.productImage}
            />
            <Text>{product.product?.productName}</Text>
            <Text> x {product.quantity}</Text>
          </View>
        ))}
      </View>
      <Text>Bên tiếp nhận: {item.user2?.fullName}</Text>
      <View style={styles.productList}>
        {item.user2TradingOrderDetails?.map((product) => (
          <View key={product.tradingOrderDetailId} style={styles.productItem}>
            <Image
              source={{ uri: product.product?.imageLink }}
              style={styles.productImage}
            />
            <Text>{product.product?.productName}</Text>
            <Text> x {product.quantity}</Text>
          </View>
        ))}
      </View>
      <Text>
        Trạng thái:{" "}
        {item.status === 0
          ? "Đang chờ duyệt"
          : item.status === 1
            ? "Đang trao đổi"
            : item.status === 2
              ? "Đã bị từ chối"
              : item.status === 3
                ? "Đã hoàn thành"
                : "Đã bị Admin ẩn"}
      </Text>
      <Text>Ghi chú: {item.note}</Text>
      {item.status === 0 && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleRejectOrder(item.tradingOrderId)}
          >
            <Text style={styles.buttonText}>Từ chối giao dịch</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleCompleteOrder(item.tradingOrderId)}
          >
            <Text style={styles.buttonText}>Hoàn tất giao dịch</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  // const getStatusText = (status) => {
  //   switch (status) {
  //     case 0:
  //       return "Đang chờ duyệt";
  //     case 1:
  //       return "Đang trao đổi";
  //     case 2:
  //       return "Đã từ chối trao đổi";
  //     case 3:
  //       return "Đã hoàn thành trao đổi";
  //     default:
  //       return "Đã bị admin ẩn";
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đơn trao đổi của tôi</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.tradingOrderId.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  productList: {
    marginBottom: 10,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
});

export default TradingOrder;
