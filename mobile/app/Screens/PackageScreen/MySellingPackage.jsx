import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { getMyPackageAPI } from "../../api/packages";
import { getUserPromoTransac } from "../../api/promotionOrder";
import AuthContext from "../../../context/AuthProvider";
import { formatDate } from "../../../utils/formatDate";
import formatPrice from "../../../utils/formatPrice";

const MySellingPackage = () => {
  const navigation = useNavigation();
  const { auth } = useContext(AuthContext);
  const [sellingPackages, setSellingPackages] = useState([]);
  const [transactionOrders, setTransactionOrders] = useState([]);

  const fetchMyPackage = async () => {
    try {
      const response = await getMyPackageAPI(auth.token);
      setSellingPackages(response.data);
      console.log("MyPackageAPI: ", response.data);
    } catch (error) {
      console.error("Error fetching packages:", error);
      if (error.response && error.response.status === 404) {
        Alert.alert("Thông báo", "Bạn hiện chưa có gói bán hàng nào");
      } else {
        Alert.alert(
          "Lỗi",
          "Đã xảy ra lỗi khi tải gói bán hàng. Vui lòng thử lại sau."
        );
      }
    }
  };

  const fetchPromoOrderTransactions = async () => {
    try {
      const response = await getUserPromoTransac(auth.token);
      console.log("UserPromoTransac: ", response.data);
      setTransactionOrders(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchMyPackage();
    fetchPromoOrderTransactions();
  }, []);

  const handleBuy = (userId, promotionId) => {
    const url = `https://fufleamarketapis.azurewebsites.net/api/VNPay/payment/${userId}/${promotionId}`;
    Linking.openURL(url).catch((error) =>
      console.error("An error occurred", error)
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Gói bán hàng của tôi</Text>
        <Text style={styles.subHeaderText}>
          Quản lý và gia hạn các gói bán hàng của bạn
        </Text>
      </View>

      <TouchableOpacity
        style={styles.buyMoreButton}
        onPress={() => navigation.navigate("SellingPackage")}
      >
        <Text style={styles.buyMoreButtonText}>Mua thêm gói bán hàng</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Các gói đang hoạt động</Text>

      <View style={styles.packagesContainer}>
        {sellingPackages.map((sPackage, index) => (
          <View key={index} style={styles.card}>
            <Image
              source={{ uri: sPackage.promotion.imageLink }}
              style={styles.cardImage}
            />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{sPackage.promotion.name}</Text>
              <Text style={styles.cardDescription}>
                {sPackage.promotion.description}
              </Text>
              <Text style={styles.cardStatus}>
                {sPackage.status === "Active" ? "Đang hoạt động" : "Đang chờ"}
              </Text>
              <Text style={styles.remainingDays}>
                Còn lại {sPackage.remainedDate} ngày
              </Text>
              <Text style={styles.cardDetail}>
                Lượt đăng sản phẩm: {sPackage.promotion.productQuantityLimit}
              </Text>
              <Text style={styles.cardPrice}>
                {formatPrice(sPackage.promotion.price)}
                <Text style={styles.pricePerMonth}> / tháng</Text>
              </Text>
            </View>
            <TouchableOpacity
              style={styles.renewButton}
              onPress={() => handleBuy(auth.userId, sPackage.promotionId)}
            >
              <Text style={styles.renewButtonText}>Gia hạn</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Lịch sử giao dịch</Text>
      {transactionOrders.map((order, index) => (
        <View key={index} style={styles.transactionItem}>
          <Image
            source={{ uri: order.imageLink }}
            style={styles.packageImage}
          />
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionTitle}>{order.promotionName}</Text>
            <Text style={styles.transactionDetail}>
              Giá: {formatPrice(order.price)}
            </Text>
            <Text style={styles.transactionDetail}>
              Ngày giao dịch: {formatDate(order.transactionCreatedDate)}
            </Text>
            <Text style={styles.transactionDetail}>
              Trạng thái:{" "}
              {order.transactionStatus === "Completed"
                ? "Thành công"
                : "Thất bại"}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  packagesContainer: {
    paddingHorizontal: 20,
  },
  card: {
    marginBottom: 20,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  cardImage: {
    width: "auto",
    height: 300,
    resizeMode: "cover",
  },
  cardBody: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  cardStatus: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#4CAF50",
  },
  remainingDays: {
    fontSize: 14,
    marginBottom: 10,
    color: "#666",
  },
  cardDetail: {
    fontSize: 14,
    marginBottom: 5,
    color: "#666",
  },
  cardPrice: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  pricePerMonth: {
    fontSize: 16,
    color: "#666",
  },
  renewButton: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  renewButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  buyMoreButton: {
    backgroundColor: "#1E90FF", // Màu xanh dương đậm
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  buyMoreButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  transactionItem: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
  },
  packageImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  transactionDetail: {
    fontSize: 14,
    marginBottom: 3,
    color: "#666",
  },
});

export default MySellingPackage;
