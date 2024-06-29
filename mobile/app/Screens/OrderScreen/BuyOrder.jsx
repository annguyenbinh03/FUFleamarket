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
import formatPrice from "../../../utils/formatPrice";

const END_POINT = {
  BUY_ORDER: "order/bought",
};

function BuyOrder() {
  const [orders, setOrders] = useState([]);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    fetchOrders();
  }, [auth]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `http://192.168.146.25:7057/api/${END_POINT.BUY_ORDER}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      console.log("Tải đơn hàng thành công:", response.data);
      setOrders(response.data); // Assuming response.data contains the orders
    } catch (error) {
      console.log("Lỗi khi tải đơn hàng:", error);
      Alert.alert("Lỗi", "Không thể tải đơn hàng. Vui lòng thử lại sau.");
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
            <Text>{formatPrice(order.price)} VNĐ</Text>
            <Text>{order.receiverAddress}</Text>
          </View>
        </View>
        <View style={styles.orderDetails}>
          <Text>Số lượng: {order.quantity}</Text>
          <Text>Giá: {order.price} VNĐ</Text>
          <Text>Phương thức thanh toán: {order.paymentMethod}</Text>
          <Text>Ngày tạo hóa đơn: {formatDate(order.orderDate)}</Text>
        </View>
        {order.status === 0 && (
          <Text style={styles.orderStatus}>Đang chờ xác nhận</Text>
        )}
        {order.status === 1 && (
          <Text style={styles.orderStatus}>Đơn hàng đã được xác nhận</Text>
        )}
        {order.status === 2 && (
          <Text style={styles.orderStatus}>Đơn hàng đã bị hủy</Text>
        )}
        {order.status === 1 && (
          <TouchableOpacity style={styles.rateButton}>
            <Text>Đánh giá người bán</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (orders.length === 0) {
    return <Empty />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đơn mua của tôi</Text>
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
  productInfo: {
    flexDirection: "row",
    marginBottom: 10,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
  },
  orderStatus: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  rateButton: {
    backgroundColor: "orange",
    padding: 5,
    borderRadius: 5,
    alignSelf: "center",
  },
});

export default BuyOrder;
