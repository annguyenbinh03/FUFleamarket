import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Empty from "../../../components/Empty";
import { formatDate } from "../../../utils/formatDate";
import formatPrice from "../../../utils/formatPrice";
import { getBuyOrdersAPI, completeOrdersByBuyerAPI } from "../../api/order";
import AuthContext from "../../../context/AuthProvider";

const BuyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const [sortBy, setSortBy] = useState("date");
  const { auth } = useContext(AuthContext);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching orders for tab:", tab);
      const response = await getBuyOrdersAPI(auth.token, tab, sortBy);
      setOrders(response.data);
      setIsLoading(false);
      console.log("Đã tải xong danh sách đơn hàng:", response.data);
    } catch (error) {
      setOrders([]);
      setIsLoading(false);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    console.log("Đang xác nhận hoàn thành đơn hàng:", orderId);
    try {
      await completeOrdersByBuyerAPI(auth.token, orderId);
      console.log("Đã xác nhận hoàn thành đơn hàng thành công");
      fetchOrders();
      Alert.alert("Thành công", "Đã hoàn thành giao dịch");
    } catch (error) {
      console.error(
        "Lỗi khi xác nhận hoàn thành đơn hàng:",
        error.response.data
      );
      Alert.alert(
        "Lỗi",
        "Không thể hoàn thành giao dịch. Vui lòng thử lại sau."
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [tab, sortBy]);

  const renderOrderItem = ({ item }) => {
    const order = item.order;
    const product = item.product;
    const seller = order.seller;

    return (
      <View style={styles.orderContainer}>
        <View style={styles.sellerInfo}>
          <Image source={{ uri: seller.avarta }} style={styles.avatar} />
          <Text style={styles.fullName}>{seller.fullName}</Text>
        </View>
        <View style={styles.productInfo}>
          <Image
            source={{ uri: product.imageLink }}
            style={styles.productImage}
          />
          <View style={styles.productDetails}>
            <Text style={styles.productName} numberOfLines={2}>
              {product.productName}
            </Text>
            <Text style={styles.productPrice}>
              {formatPrice(order.price)} VND
            </Text>
            <Text style={styles.quantityText}>Số lượng: {order.quantity}</Text>
          </View>
        </View>
        <Text style={styles.orderDate}>
          Ngày đặt: {formatDate(order.orderDate)}
        </Text>
        <Text style={styles.statusText}>
          Trạng thái:{" "}
          <Text
            style={[
              styles.statusValue,
              { color: getStatusColor(order.status) },
            ]}
          >
            {getStatusText(order.status)}
          </Text>
        </Text>
        {order.status === 1 && (
          <TouchableOpacity
            style={styles.completeButton}
            onPress={() => handleCompleteOrder(order.orderId)}
          >
            <Text style={styles.buttonText}>Hoàn thành giao dịch</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Đang chờ duyệt";
      case 1:
        return "Đang trao đổi";
      case 2:
        return "Đã từ chối";
      case 3:
        return "Đã hoàn thành";
      default:
        return "Đã bị admin ẩn";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "#6c757d";
      case 1:
        return "#17a2b8";
      case 2:
        return "#dc3545";
      case 3:
        return "#28a745";
      default:
        return "#6c757d";
    }
  };

  // const getTabText = (tabNumber) => {
  //   switch (tabNumber) {
  //     case 1:
  //       return "Tất cả";
  //     case 2:
  //       return "Đang chờ duyệt";
  //     case 3:
  //       return "Đang trao đổi";
  //     case 4:
  //       return "Đã hoàn thành";
  //     case 5:
  //       return "Đã từ chối";
  //     default:
  //       return "Không xác định";
  //   }
  // };

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
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.order.orderId.toString()}
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
  sellerInfo: {
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
  fullName: {
    fontWeight: "bold",
    fontSize: 14,
  },
  productInfo: {
    flexDirection: "row",
    marginBottom: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: "#FF6347",
    marginBottom: 5,
  },
  quantityText: {
    fontSize: 14,
    color: "#666",
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    marginBottom: 10,
  },
  statusValue: {
    fontWeight: "bold",
  },
  completeButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
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

export default BuyOrder;
