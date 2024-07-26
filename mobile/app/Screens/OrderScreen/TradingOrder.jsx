import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Image,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  getMyTradingOrderAPI,
  user1CompleteTradingRequest,
  user1RejectTradingRequest,
} from "../../api/tradingOrder";
import AuthContext from "../../../context/AuthProvider";
import Empty from "../../../components/Empty";

const TradingOrder = () => {
  const [orders, setOrders] = useState([]);
  const { auth } = useContext(AuthContext);
  const navigation = useNavigation();
  const [tab, setTab] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date");

  const fetchOrder = async () => {
    console.log("Đang tải danh sách đơn hàng...");
    setIsLoading(true);
    try {
      const response = await getMyTradingOrderAPI(auth.token, tab, sortBy);
      setIsLoading(false);
      setOrders(response.data);
      console.log("Đã tải xong danh sách đơn hàng:", response.data);
    } catch (error) {
      setOrders([]);
      console.error("Lỗi khi tải danh sách đơn hàng:", error);
      setIsLoading(false);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    console.log("Đang xác nhận hoàn thành đơn hàng:", orderId);
    try {
      await user1CompleteTradingRequest(auth.token, orderId);
      console.log("Đã xác nhận hoàn thành đơn hàng thành công");
      fetchOrder();
    } catch (error) {
      console.error("Lỗi khi xác nhận hoàn thành đơn hàng:", error);
    }
  };

  const handleRejectOrder = async (orderId) => {
    console.log("Đang từ chối đơn hàng:", orderId);
    try {
      await user1RejectTradingRequest(auth.token, orderId);
      console.log("Đã từ chối đơn hàng thành công");
      fetchOrder();
    } catch (error) {
      console.error("Lỗi khi từ chối đơn hàng:", error);
    }
  };

  useEffect(
    () => {
      fetchOrder();
    },
    [tab],
    [sortBy]
  );

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderContainer}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>Bên yêu cầu: {item.user1?.fullName}</Text>
        <View style={styles.productList}>
          {item.user1TradingOrderDetails?.map((product) => (
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
          Bên tiếp nhận: {item.user2?.fullName}
        </Text>
        <View style={styles.productList}>
          {item.user2TradingOrderDetails?.map((product) => (
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
          style={[styles.statusValue, { color: getStatusColor(item.status) }]}
        >
          {getStatusText(item.status)}
        </Text>
      </Text>
      <Text style={styles.noteText}>Ghi chú: {item.note}</Text>
      {item.status === 1 && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => handleRejectOrder(item.tradingOrderId)}
          >
            <Text style={styles.buttonText}>Từ chối giao dịch</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={() => handleCompleteOrder(item.tradingOrderId)}
          >
            <Text style={styles.buttonText}>Hoàn tất giao dịch</Text>
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
        return "Đã từ chối ";
      case 3:
        return "Đã hoàn thành ";
      default:
        return "Đã bị admin ẩn";
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

  const getTabText = (tabNumber) => {
    switch (tabNumber) {
      case 1:
        return "Tất cả";
      case 2:
        return "Đang chờ duyệt";
      case 3:
        return "Đang trao đổi";
      case 4:
        return "Đã hoàn thành";
      case 5:
        return "Đã từ chối";
      default:
        return "Không xác định";
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
              {getTabText(tabNumber)}
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
          renderItem={renderOrderItem}
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
  selectedButton: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
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

export default TradingOrder;
