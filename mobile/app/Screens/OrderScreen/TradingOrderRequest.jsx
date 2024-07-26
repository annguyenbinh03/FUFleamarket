import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  ActivityIndicator,
  Alert,
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
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrder = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
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
        <Text style={styles.userName}>
          Bên yêu cầu: {order.user1?.fullName}
        </Text>
        <View style={styles.productList}>
          {order.user1TradingOrderDetails?.map((product) => (
            <View key={product.tradingOrderDetailId} style={styles.productItem}>
              <Image
                source={{ uri: product.product?.imageLink }}
                style={styles.productImage}
              />
              <Text style={styles.productName}>
                {product.product?.productName}
              </Text>
              <Text style={styles.productQuantity}>x {product.quantity}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.userName}>
          Bên tiếp nhận: {order.user2?.fullName}
        </Text>
        <View style={styles.productList}>
          {order.user2TradingOrderDetails?.map((product) => (
            <View key={product.tradingOrderDetailId} style={styles.productItem}>
              <Image
                source={{ uri: product.product?.imageLink }}
                style={styles.productImage}
              />
              <Text style={styles.productName}>
                {product.product?.productName}
              </Text>
              <Text style={styles.productQuantity}>x {product.quantity}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.statusText}>
        Trạng thái:{" "}
        <Text
          style={[styles.statusValue, { color: getStatusColor(order.status) }]}
        >
          {getStatusText(order.status)}
        </Text>
      </Text>
      <Text style={styles.noteText}>Ghi chú: {order.note}</Text>
      {order.status === 0 && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={() => handleAcceptOrder(order.tradingOrderId)}
          >
            <Text style={styles.buttonText}>Bắt đầu trao đổi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => handleRejectOrder(order.tradingOrderId)}
          >
            <Text style={styles.buttonText}>Từ chối giao dịch</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Đang chờ duyệt";
      case 1:
        return "Đang trao đổi";
      case 2:
        return "Đã bị từ chối";
      case 3:
        return "Đã hoàn thành";
      default:
        return "Đã bị Admin ẩn";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "#6c757d"; // secondary
      case 1:
        return "#17a2b8"; // info
      case 2:
        return "#dc3545"; // danger
      case 3:
        return "#28a745"; // success
      default:
        return "#6c757d"; // secondary
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#DD0000" barStyle="light-content" />
      <View style={styles.tabContainer}>
        {[1, 2, 3, 4, 5].map((tabNumber) => (
          <TouchableOpacity
            key={tabNumber}
            style={[styles.tab, tab === tabNumber && styles.selectedTab]}
            onPress={() => setTab(tabNumber)}
          >
            <Text
              style={[
                styles.tabText,
                tab === tabNumber && styles.selectedTabText,
              ]}
            >
              {tabNumber === 1
                ? "Tất cả"
                : tabNumber === 2
                  ? "Chờ duyệt"
                  : tabNumber === 3
                    ? "Đang trao đổi"
                    : tabNumber === 4
                      ? "Hoàn thành"
                      : "Từ chối"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.sortByContainer}>
        <Text style={styles.sortByLabel}>Sắp xếp theo:</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === "date" && styles.selectedSortButton,
            ]}
            onPress={() => setSortBy("date")}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === "date" && styles.selectedSortButtonText,
              ]}
            >
              Mới nhất
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortBy === "price" && styles.selectedSortButton,
            ]}
            onPress={() => setSortBy("price")}
          >
            <Text
              style={[
                styles.sortButtonText,
                sortBy === "price" && styles.selectedSortButtonText,
              ]}
            >
              Giá cao nhất
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#DD0000" />
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={(item) => item.tradingOrderId.toString()}
          ListEmptyComponent={Empty}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
    backgroundColor: "#fff",
    elevation: 2,
  },
  tab: {
    padding: 8,
    borderRadius: 5,
  },
  selectedTab: {
    backgroundColor: "#FFA500",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  selectedTabText: {
    color: "#fff",
  },
  listContent: {
    padding: 10,
  },
  orderContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userInfo: {
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  productList: {
    marginBottom: 10,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    padding: 8,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  productName: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  productQuantity: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  statusText: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
  statusValue: {
    fontWeight: "bold",
  },
  noteText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sortByContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  sortByLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  buttonGroup: {
    flexDirection: "row",
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#007AFF",
    marginLeft: 10,
  },
  selectedSortButton: {
    backgroundColor: "#007AFF",
  },
  sortButtonText: {
    fontSize: 14,
    color: "#007AFF",
  },
  selectedSortButtonText: {
    color: "#fff",
  },
});

export default TradingOrderRequest;
