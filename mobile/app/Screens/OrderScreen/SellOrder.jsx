import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import AuthContext from "../../../context/AuthProvider";
import Empty from "../../../components/Empty";
import { formatDate } from "../../../utils/formatDate";
import {
  getSellOrdersAPI,
  acceptBuyRequestOrdersAPI,
  denyBuyRequestOrdersAPI,
} from "../../api/order";

function SellOrder() {
  const [orders, setOrders] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getSellOrdersAPI(auth.token);
      console.log("Tải đơn hàng thành công:", response.data);
      setOrders(response.data);
    } catch (error) {
      console.log("Lỗi khi tải đơn hàng:", error);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await acceptBuyRequestOrdersAPI(auth.token, orderId);
      console.log("Chấp nhận đơn hàng thành công");
      Alert.alert("Thông báo", "Đã chấp nhận đơn hàng!");
      fetchOrders();
    } catch (error) {
      console.log("Lỗi khi chấp nhận đơn hàng:", error);
      Alert.alert("Lỗi", "Không thể chấp nhận đơn hàng. Vui lòng thử lại sau.");
    }
  };

  const handleDenyOrder = async (orderId) => {
    try {
      await denyBuyRequestOrdersAPI(auth.token, orderId);
      console.log("Từ chối đơn hàng thành công");
      Alert.alert("Thông báo", "Đã từ chối đơn hàng!");
      fetchOrders();
    } catch (error) {
      console.log("Lỗi khi từ chối đơn hàng:", error);
      Alert.alert("Lỗi", "Không thể từ chối đơn hàng. Vui lòng thử lại sau.");
    }
  };

  const renderOrderItem = ({ item }) => {
    const order = item.order;
    const product = item.product;
    const buyer = item.buyer;

    return (
      <View style={styles.orderItem}>
        <View style={styles.buyerInfo}>
          <Image source={{ uri: buyer.avarta }} style={styles.avatar} />
          <Text style={styles.buyerName}>{buyer.name}</Text>
        </View>
        <View style={styles.productInfo}>
          <Image
            source={{ uri: product.imageLink }}
            style={styles.productImage}
          />
          <View>
            <Text>{product.productName}</Text>
            <Text>{order.price} VNĐ</Text>
            <Text>{order.receiverAddress}</Text>
          </View>
        </View>
        {order.status === 0 && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleAcceptOrder(order.orderId)}
            >
              <Text style={styles.buttonText}>Chấp nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.denyButton}
              onPress={() => handleDenyOrder(order.orderId)}
            >
              <Text style={styles.buttonText}>Từ chối</Text>
            </TouchableOpacity>
          </View>
        )}
        {order.status === 1 && (
          <TouchableOpacity style={styles.rateButton}>
            <Text style={styles.buttonText}>Đánh giá người mua</Text>
          </TouchableOpacity>
        )}
        <View style={styles.orderDetails}>
          <Text>Số lượng: {order.quantity}</Text>
          <Text>Giá: {order.price} VNĐ</Text>
          <Text>Phương thức thanh toán: {order.paymentMethod}</Text>
          <Text>Ngày tạo hóa đơn: {formatDate(order.orderDate)}</Text>
        </View>
      </View>
    );
  };

  if (orders.length === 0) {
    return <Empty />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đơn hàng bán</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.order.orderId.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  orderItem: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buyerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  buyerName: {
    fontWeight: "bold",
  },
  productInfo: {
    flexDirection: "row",
    marginBottom: 10,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  acceptButton: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  denyButton: {
    backgroundColor: "#DC3545",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  rateButton: {
    backgroundColor: "#FFC107",
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "bold",
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
  },
});

export default SellOrder;
