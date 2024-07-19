import React, { useState, useEffect, useContext, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../../context/AuthProvider";
import { MaterialIcons } from "@expo/vector-icons";
import AdminProductManagerButton from "../../components/AdminProductManagerButton";
import formatPrice from "./../../utils/formatPrice";
import Empty from "../../components/Empty";
import {
  acceptCreateProductRequestAPI,
  getAdminProductRequestAPI,
  rejectCreateProductRequestAPI,
} from "../api/product";

const AdminPostManager = () => {
  const [products, setProducts] = useState([]);
  const { auth } = useContext(AuthContext);
  const navigation = useNavigation();

  const fetchData = async () => {
    try {
      const response = await getAdminProductRequestAPI(auth.token);
      setProducts(response.data);
      console.log("Lấy dữ liệu sản phẩm ok");
    } catch (error) {
      console.error("Lỗi API:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveProduct = async (productId) => {
    try {
      console.log(`Duyệt sản phẩm ID: ${productId}`);
      await acceptCreateProductRequestAPI(auth.token, productId);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.productId !== productId)
      );
      console.log("Đã phê duyệt sản phẩm ok");
    } catch (error) {
      console.error(
        "Lỗi khi phê duyệt sản phẩm:",
        error.response?.data || error.message
      );
    }
  };

  const handleRejectProduct = async (productId) => {
    try {
      console.log(`Từ chối sản phẩm ID: ${productId}`);
      await rejectCreateProductRequestAPI(auth.token, productId);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.productId !== productId)
      );
      console.log("Đã từ chối sản phẩm ok");
    } catch (error) {
      console.error(
        "Lỗi khi từ chối sản phẩm:",
        error.response?.data || error.message
      );
    }
  };

  const pendingProducts = useMemo(() => {
    return products.filter((product) => product.status === 0);
  }, [products]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.userInfo}>
        <Image source={{ uri: item.seller.avarta }} style={styles.avatar} />
        <Text style={styles.userName}>{item.seller.fullName}</Text>
      </View>
      <View style={styles.productInfo}>
        <Image source={{ uri: item.linkImage }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.productName}</Text>
          <Text style={styles.productStatus}>
            {" "}
            Tình trạng: {item.isNew === true ? "Mới" : "Đã qua sử dụng"}
          </Text>
          <Text style={styles.productStatus}>
            {" "}
            Loại: {item.dealType === true ? "Trao đổi" : "Bán"}
          </Text>
          <Text style={styles.productPrice}>{formatPrice(item.price)} VND</Text>
          <Text style={styles.productCategory}>{item.categoryName}</Text>
        </View>
      </View>
      <Text style={styles.productDescription}>{item.description}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() =>
            navigation.navigate("Detail", { productId: item.productId })
          }
        >
          <MaterialIcons name="visibility" size={24} color="white" />
          <Text style={styles.buttonText}>Xem chi tiết</Text>
        </TouchableOpacity>
        {item.status === 0 ? (
          <View style={styles.approvalButtons}>
            <TouchableOpacity
              style={[styles.button, styles.approveButton]}
              onPress={() => handleApproveProduct(item.productId)}
            >
              <MaterialIcons name="check-circle" size={24} color="white" />
              <Text style={styles.buttonText}>Chấp nhận</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={() => handleRejectProduct(item.productId)}
            >
              <MaterialIcons name="cancel" size={24} color="white" />
              <Text style={styles.buttonText}>Từ chối</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text
            style={
              item.status === 1 ? styles.approvedText : styles.rejectedText
            }
          >
            {item.status === 1 ? "Đã chấp nhận" : "Đã từ chối"}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E90FF" />
      <View style={styles.header}>
        <Text style={styles.title}>Quản lý yêu cầu đăng bài</Text>
        <Text style={styles.subtitle}>
          Danh sách sản phẩm <Text style={styles.pending}>chờ phê duyệt</Text>
        </Text>
        <AdminProductManagerButton
          to="AdminProductManager"
          title="Quản lý sản phẩm"
          style={styles.productManagerButton}
        />
      </View>
      <FlatList
        data={pendingProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.productId.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Empty />
          </View>
        }
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
    padding: 20,
    paddingTop: StatusBar.currentHeight + 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "white",
  },
  pending: {
    fontWeight: "bold",
  },
  listContainer: {
    padding: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
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
    justifyContent: "center",
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productStatus: {
    fontSize: 14,
    color: "#666",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
  },
  productCategory: {
    fontSize: 14,
    color: "#666",
  },
  productDescription: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "column",
  },
  viewButton: {
    backgroundColor: "#1E90FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  approvalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "bold",
  },
  approvedText: {
    color: "#4CAF50",
    textAlign: "center",
    fontWeight: "bold",
  },
  rejectedText: {
    color: "#F44336",
    textAlign: "center",
    fontWeight: "bold",
  },
  productManagerButton: {
    marginTop: 10,
  },
});

export default AdminPostManager;
