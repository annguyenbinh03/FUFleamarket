import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AuthContext from "../../../context/AuthProvider";
import {
  getMyTradingOrderRequestAPI,
  user2AcceptRequest,
  user2RejectRequest,
} from "../../api/tradingOrder";

const TradingOrderRequest = () => {
  const [orders, setOrders] = useState([]);
  const { auth } = useContext(AuthContext);
  const [tab, setTab] = useState(1);
  const sortBy = "price";

  const fetchOrder = async () => {
    try {
      const response = await getMyTradingOrderRequestAPI(
        auth.token,
        tab,
        sortBy
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching order:", error);
      console.error("fetch Order trading:", error.response.data);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await user2AcceptRequest(auth.token, orderId);
      fetchOrder();
      alert("Đã xác nhận trao đổi!");
    } catch (error) {
      console.error("Error accepting order:", error);
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      await user2RejectRequest(auth.token, orderId);
      fetchOrder();
      alert("Đã từ chối yêu cầu mua hàng");
    } catch (error) {
      console.error("Error rejecting order:", error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [tab]);

  const renderOrder = ({ item: order }) => (
    <View style={styles.orderContainer}>
      <Text>Bên yêu cầu: {order.user1?.fullName}</Text>
      <Text>Bên tiếp nhận: {order.user2?.fullName}</Text>
      <Text>
        Trạng thái:{" "}
        {order.status === 0
          ? "Đang chờ duyệt"
          : order.status === 1
            ? "Đang trao đổi"
            : "Khác"}
      </Text>
      {order.status === 0 && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAcceptOrder(order.tradingOrderId)}
          >
            <Text>Bắt đầu trao đổi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleRejectOrder(order.tradingOrderId)}
          >
            <Text>Từ chối giao dịch</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yêu cầu trao đổi</Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, tab === 1 && styles.selectedTab]}
          onPress={() => setTab(1)}
        >
          <Text>Tất cả</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 2 && styles.selectedTab]}
          onPress={() => setTab(2)}
        >
          <Text>Đang chờ duyệt</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={orders}
        renderItem={renderOrder}
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
  tabContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  tab: {
    padding: 10,
    marginRight: 10,
    backgroundColor: "#e0e0e0",
  },
  selectedTab: {
    backgroundColor: "#b0b0b0",
  },
  orderContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  button: {
    padding: 10,
    backgroundColor: "#e0e0e0",
  },
});

export default TradingOrderRequest;
