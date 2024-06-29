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
import axios from "axios";
import Empty from "../../../components/Empty";
import { formatDate } from "../../../utils/formatDate";

const END_POINT = {
  MY_ORDER_REQUEST: "order/soldRequest",
  ACCEPT_ORDER_REQUEST: "order/acceptOrderRequest",
  DENY_ORDER_REQUEST: "order/denyOrderRequest",
};

function SellOrder() {
  const [orders, setOrders] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    fetchOrders();
  }, [auth]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `http://192.168.146.25:7057/api/${END_POINT.MY_ORDER_REQUEST}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      console.log("Tải đơn hàng thành công:", response.data);
      setOrders(response.data);
    } catch (error) {
      console.log("Lỗi khi tải đơn hàng:", error);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      const response = await axios.put(
        `http://192.168.146.25:7057/api/${END_POINT.ACCEPT_ORDER_REQUEST}/${orderId}`,
        null,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      console.log("Chấp nhận đơn hàng thành công:", response.data);
      fetchOrders();
      Alert.alert("Thông báo", "Đã chấp nhận đơn hàng!");
    } catch (error) {
      console.log("Lỗi khi chấp nhận đơn hàng:", error);
      Alert.alert("Lỗi", "Không thể chấp nhận đơn hàng. Vui lòng thử lại sau.");
    }
  };

  const handleDenyOrder = async (orderId) => {
    try {
      const response = await axios.put(
        `http://192.168.146.25:7057/api/${END_POINT.DENY_ORDER_REQUEST}/${orderId}`,
        null,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      console.log("Từ chối đơn hàng thành công:", response.data);
      fetchOrders();
      Alert.alert("Thông báo", "Đã từ chối đơn hàng!");
    } catch (error) {
      console.log("Lỗi khi từ chối đơn hàng:", error);
      Alert.alert("Lỗi", "Không thể từ chối đơn hàng. Vui lòng thử lại sau.");
    }
  };

  const renderOrderItem = ({ item }) => {
    // Assuming API response looks like this:
    // response.data: [{ order: { ... }, product: { ... } }]
    const order = item.order; // Assuming each order item has an 'order' object
    const product = item.product; // Assuming each order item has a 'product' object
    return (
      <View style={styles.orderItem}>
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
              <Text>Chấp nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.denyButton}
              onPress={() => handleDenyOrder(order.orderId)}
            >
              <Text>Từ chối</Text>
            </TouchableOpacity>
          </View>
        )}
        {order.status === 1 && (
          <TouchableOpacity style={styles.rateButton}>
            <Text>Đánh giá</Text>
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
        keyExtractor={(item) =>
          item.order.orderId.toString() + item.product.productId.toString()
        }
      />
    </View>
  );
}

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
    borderWidth: 1,
    borderColor: "#ddd",
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
    backgroundColor: "green",
    padding: 5,
    borderRadius: 5,
  },
  denyButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  rateButton: {
    backgroundColor: "orange",
    padding: 5,
    borderRadius: 5,
    alignSelf: "center",
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
  },
});

export default SellOrder;
