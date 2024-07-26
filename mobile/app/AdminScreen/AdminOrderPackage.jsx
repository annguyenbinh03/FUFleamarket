import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import formatPrice from "../../utils/formatPrice";
import AuthContext from "../../context/AuthProvider";
import { getAdminAllPromoTransac } from "../api/promotionOrder";

const  AdminOrderPackage= () => {
  const { auth } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const orderData = await getAdminAllPromoTransac(auth.token);
      setOrders(orderData.data);
      console.log("AdminAllPromoTransac: ", orderData.data);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.row}>
        <Image source={{ uri: item.imageLink }} style={styles.packageImage} />
        <Text>{item.promotionName}</Text>
      </View>
      <View style={styles.row}>
        <Image source={{ uri: item.avarta }} style={styles.userImage} />
        <Text>{item.fullName}</Text>
      </View>
      <Text>Giá: {formatPrice(item.price)}</Text>
      <Text>Phương thức: {item.paymentMethod}</Text>
      <Text>Mã giao dịch: {item.transactionCode}</Text>
      <Text>Ngày hết hạn: Còn {item.remainedDate} ngày</Text>

      <Text
        style={
          item.promotionOrderStatus === "Active"
            ? styles.statusActive
            : styles.statusInactive
        }
      >
        {item.promotionOrderStatus === "Active"
          ? "Hoạt động"
          : "Không hoạt động"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E90FF" />
      <View style={styles.header}>
        <Text style={styles.title}>Quản lý gói bán hàng</Text>
      </View>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.transactionCode}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F8FF",
  },
  header: {
    backgroundColor: "#1E90FF",
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  listContainer: {
    padding: 10,
  },
  orderItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  packageImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  statusActive: {
    color: "green",
    fontWeight: "bold",
  },
  statusInactive: {
    color: "red",
    fontWeight: "bold",
  },
});

export default AdminOrderPackage;
