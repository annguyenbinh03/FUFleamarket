import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import AuthContext from "../../../context/AuthProvider";
import axios from "axios";
import Empty from "../../../components/Empty";
import { formatDate } from "../../../utils/formatDate";
import formatPrice from "../../../utils/formatPrice";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

const END_POINT = {
  BUY_ORDER: "order/bought",
};

function BuyOrder() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    fetchOrders();
  }, [auth]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://192.168.146.25:7057/api/${END_POINT.BUY_ORDER}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      console.log("Tải đơn hàng thành công:", response.data);
      setOrders(response.data);
    } catch (error) {
      console.log("Lỗi khi tải đơn hàng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOrderItem = ({ item }) => {
    const order = item.order;
    const product = item.product;
    const seller = order.seller;
    console.log("Seller object:", order.seller);

    return (
      <View style={styles.productContainer}>
        <View style={styles.productImageContainer}>
          <Image
            source={{ uri: product.imageLink }}
            style={styles.productImage}
          />
          <View style={styles.productStatus}>
            <Text style={styles.productStatusText}>
              {getStatusText(order.status)}
            </Text>
          </View>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.productName}</Text>
          <Text style={styles.productPrice}>
            {formatPrice(order.price)} VNĐ
          </Text>
          <Text style={styles.productCreatedDate}>
            Ngày đặt: {formatDate(order.orderDate)}
          </Text>
        </View>
        <View style={styles.productActions}>
          {order.status === 1 && (
            <TouchableOpacity style={styles.productActionButton}>
              <Text style={styles.tabButtonText}>Đánh giá</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.sellerInfo}>
          <Image source={{ uri: seller.avarta }} style={styles.sellerAvatar} />
          <View style={styles.sellerDetails}>
            <Text style={styles.sellerName}>Người bán: {seller.fullName}</Text>
            <Text style={styles.sellerContact}>
              Liên hệ: {seller.phoneNumber}
            </Text>
          </View>
        </View>
        <View style={styles.orderDetails}>
          <Text style={styles.orderDetailText}>Mã đơn: {order.orderId}</Text>
          <Text style={styles.orderDetailText}>Số lượng: {order.quantity}</Text>
          <Text style={styles.orderDetailText}>
            Phương thức thanh toán: {order.paymentMethod}
          </Text>
          <Text style={styles.orderDetailText}>
            Địa chỉ nhận hàng: {order.receiverAddress}
          </Text>
          {order.note && (
            <Text style={styles.orderDetailText}>Ghi chú: {order.note}</Text>
          )}
          {order.deliveryDate && (
            <Text style={styles.orderDetailText}>
              Ngày giao hàng: {formatDate(order.deliveryDate)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Chờ xác nhận";
      case 1:
        return "Đã xác nhận";
      case 2:
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const filteredOrders = orders.filter((item) => {
    switch (activeTab) {
      case "pending":
        return item.order.status === 0;
      case "confirmed":
        return item.order.status === 1;
      case "cancelled":
        return item.order.status === 2;
      default:
        return true;
    }
  });

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#DD0000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#DD0000" style="light" />
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "pending" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("pending")}
        >
          <Text style={styles.tabButtonText}>Chờ xác nhận</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "confirmed" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("confirmed")}
        >
          <Text style={styles.tabButtonText}>Đã xác nhận</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "cancelled" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("cancelled")}
        >
          <Text style={styles.tabButtonText}>Đã hủy</Text>
        </TouchableOpacity>
      </View>
      {filteredOrders.length === 0 ? (
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
    padding: 10,
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: "#FFA500",
  },
  tabButtonText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  productList: {
    padding: 10,
  },
  productContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000000",
    padding: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  productImageContainer: {
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: 200,
    borderRadius: 5,
  },
  productStatus: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 5,
    borderRadius: 3,
  },
  productStatusText: {
    color: "#fff",
    fontSize: 12,
  },
  productInfo: {
    marginTop: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 14,
    color: "#FF6347",
    marginTop: 5,
  },
  productCreatedDate: {
    fontSize: 12,
    color: "#777",
    marginTop: 5,
  },
  productActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  productActionButton: {
    backgroundColor: "#FFA500",
    padding: 8,
    borderRadius: 5,
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  sellerContact: {
    fontSize: 12,
    color: "#666",
  },
  orderDetails: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  orderDetailText: {
    fontSize: 12,
    color: "#444",
    marginBottom: 5,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BuyOrder;
