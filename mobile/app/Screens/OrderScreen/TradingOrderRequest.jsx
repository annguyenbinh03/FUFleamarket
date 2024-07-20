import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import AuthContext from "../../../context/AuthProvider";
import {
  getMyTradingOrderRequestAPI,
  user2AcceptRequest,
  user2RejectRequest,
} from "../../api/tradingOrder";
import Empty from "../../../components/Empty";

const TradingOrderRequest = () => {
  const [orders, setOrders] = useState([]);
  const { auth } = useContext(AuthContext);
  const [tab, setTab] = useState(1);
  const [sortBy, setSortBy] = useState("date");

  const fetchOrder = async () => {
    try {
      const response = await getMyTradingOrderRequestAPI(
        auth.token,
        tab,
        sortBy
      );
      setOrders(response.data);
      console.log("fetch trading Order: ", response.data);
    } catch (error) {
      setOrders([]);
      console.error("Error fetching order:", error);
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
  }, [tab, sortBy]);

  const renderOrder = ({ item: order }) => (
    <View style={styles.orderContainer}>
      <View style={styles.userInfo}>
        <Text>Bên yêu cầu: {order.user1?.fullName}</Text>
        <View style={styles.productList}>
          {order.user1TradingOrderDetails?.map((product) => (
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
        <Text>Bên tiếp nhận: {order.user2?.fullName}</Text>
        <View style={styles.productList}>
          {order.user2TradingOrderDetails?.map((product) => (
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
      </View>

      <Text>
        Trạng thái:{" "}
        {order.status === 0
          ? "Đang chờ duyệt"
          : order.status === 1
            ? "Đang trao đổi"
            : order.status === 2
              ? "Đã bị từ chối"
              : order.status === 3
                ? "Đã hoàn thành"
                : "Đã bị Admin ẩn"}
      </Text>
      <Text>Ghi chú: {order.note}</Text>
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
        {[1, 2, 3, 4, 5].map((tabNumber) => (
          <TouchableOpacity
            key={tabNumber}
            style={[styles.tab, tab === tabNumber && styles.selectedTab]}
            onPress={() => setTab(tabNumber)}
          >
            <Text>
              {tabNumber === 1
                ? "Tất cả"
                : tabNumber === 2
                  ? "Đang chờ duyệt"
                  : tabNumber === 3
                    ? "Đang trao đổi"
                    : tabNumber === 4
                      ? "Đã hoàn thành"
                      : "Đã từ chối"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={(item) => item.tradingOrderId.toString()}
        ListEmptyComponent={Empty}
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
    marginRight: 0,
    backgroundColor: "#e0e0e0",
  },
  selectedTab: {
    backgroundColor: "yellow",
  },
  orderContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  userInfo: {
    marginBottom: 10,
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
