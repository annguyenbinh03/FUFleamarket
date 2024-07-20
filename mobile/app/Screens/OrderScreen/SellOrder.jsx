import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import AuthContext from "../../../context/AuthProvider";
import Empty from "../../../components/Empty";
import { formatDate } from "../../../utils/formatDate";
import formatPrice from "../../../utils/formatPrice";
import {
  getSellOrdersAPI,
  acceptBuyRequestOrdersAPI,
  denyBuyRequestOrdersAPI,
} from "../../api/order";
import axios from "axios";

function SellOrder() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    fetchOrders();
  }, [auth]);

  const fetchOrders = async () => {
    console.log("auth: ", auth.token);
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://fufleamarketapi.azurewebsites.net/api/order/soldRequest?sortBy=date&descending=true`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      console.log("SellOrdersAPI: ", response.data);
      setOrders(response.data);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
      if (error.response && error.response.status === 404) {
        Alert.alert("Thông báo", "Bạn hiện chưa có đơn hàng nào");
      } else {
        Alert.alert(
          "Lỗi",
          "Đã xảy ra lỗi khi tải đơn hàng. Vui lòng thử lại sau."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await acceptBuyRequestOrdersAPI(auth.token, orderId);
      fetchOrders();
    } catch (error) {
      console.error("Lỗi khi chấp nhận đơn hàng:", error);
    }
  };

  const handleDenyOrder = async (orderId) => {
    try {
      await denyBuyRequestOrdersAPI(auth.token, orderId);
      fetchOrders();
    } catch (error) {
      console.error("Lỗi khi từ chối đơn hàng:", error);
    }
  };

  const renderOrderItem = ({ item }) => {
    const order = item.order;
    const product = item.product;
    const buyer = item.buyer;

    return (
      <View style={styles.productContainer}>
        <View style={styles.buyerInfo}>
          <Image source={{ uri: buyer.avarta }} style={styles.avatar} />
          <Text style={styles.fullName}>{buyer.name}</Text>
        </View>
        <View style={styles.productHeader}>
          <Image
            source={{ uri: product.imageLink }}
            style={styles.productImage}
          />
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={1}>
              {product.productName}
            </Text>
            <Text style={styles.productPrice}>
              {formatPrice(order.price)} VND
            </Text>
            <Text
              style={[
                styles.productStatus,
                { backgroundColor: getStatusColor(order.status) },
              ]}
            >
              {getStatusText(order.status)}
            </Text>
          </View>
        </View>
        <View style={styles.orderDetails}>
          <Text style={styles.orderDetailText}>Số lượng: {order.quantity}</Text>
          <Text style={styles.orderDetailText}>
            Ngày đặt: {formatDate(order.orderDate)}
          </Text>
          <Text style={styles.productPrice}>
            {formatPrice(order.price)} VND
          </Text>
        </View>
        {order.status === 0 && (
          <View style={styles.actionButtons}>
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
        {order.status === 3 && (
          <TouchableOpacity style={styles.productActionButton}>
            <Text style={styles.buttonText}>Đánh giá người mua</Text>
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
        return "Đã từ chối giao dịch";
      case 3:
        return "Đã hoàn thành giao dịch";
      case 4:
        return "Đã bị admin ẩn";
      default:
        return "Không xác định";
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
        return "#007bff"; // primary
      case 4:
        return "#dc3545"; // danger
      default:
        return "#6c757d"; // secondary
    }
  };

  const getTabText = (tab) => {
    switch (tab) {
      case "all":
        return "Tất cả";
      case "pending":
        return "Chờ duyệt";
      case "exchanging":
        return "Đang trao đổi";
      case "rejected":
        return "Đã từ chối";
      case "completed":
        return "Hoàn thành";
      case "hidden":
        return "Bị ẩn";
      default:
        return "";
    }
  };

  const filteredOrders = orders.filter((item) => {
    switch (activeTab) {
      case "all":
        return true;
      case "pending":
        return item.order.status === 0;
      case "exchanging":
        return item.order.status === 1;
      case "rejected":
        return item.order.status === 2;
      case "completed":
        return item.order.status === 3;
      case "hidden":
        return item.order.status === 4;
      default:
        return true;
    }
  });

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#DD0000" style="light" />
      <View style={styles.tabContainer}>
        {[
          "all",
          "pending",
          "exchanging",
          "rejected",
          "completed",
          "hidden",
        ].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={styles.tabButtonText}>{getTabText(tab)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#DD0000" />
      ) : filteredOrders.length === 0 ? (
        <Empty />
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) =>
            item.order.orderId.toString() + item.product.productId.toString()
          }
          contentContainerStyle={styles.productList}
        />
      )}
    </View>
  );
}
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
  },
  tabButton: {
    padding: 8,
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: "#FFA500",
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  productList: {
    padding: 10,
  },
  productContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 12,
    color: "#FF6347",
    marginTop: 2,
  },
  productStatus: {
    backgroundColor: "#008000",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginTop: 4,
    color: "#fff",
  },
  orderDetails: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  orderDetailText: {
    fontSize: 12,
    color: "#444",
    marginBottom: 2,
  },
  productActionButton: {
    backgroundColor: "#FFA500",
    padding: 8,
    borderRadius: 5,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
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
  fullName: {
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  denyButton: {
    backgroundColor: "#F44336",
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
});

export default SellOrder;
