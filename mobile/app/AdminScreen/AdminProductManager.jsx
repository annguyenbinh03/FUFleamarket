import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import AuthContext from "../../context/AuthProvider";
import Empty from "./../../components/Empty";
import formatPrice from "./../../utils/formatPrice";
import { getAdminProductS123API } from "../api/product";
import { useNavigation } from "expo-router";

const AdminProductManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { auth } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("ĐÃ DUYỆT");
  const navigation = useNavigation();

  const fetchData = async () => {
    console.log("Bắt đầu lấy dữ liệu");
    if (!auth.token) {
      console.log("Lỗi: Không có token");
      setError("Không có token truy cập");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getAdminProductS123API(auth.token, null);
      console.log("Dữ liệu nhận được:", response.data.length, "sản phẩm");

      let validProducts = response.data.filter(
        (product) => product && product.productId
      );
      console.log("Số sản phẩm hợp lệ:", validProducts.length);
      setProducts(validProducts);
      setError(null);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      setError("Không thể lấy danh sách sản phẩm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
      console.log("Kết thúc lấy dữ liệu");
    }
  };

  useEffect(() => {
    console.log("useEffect chạy - Token thay đổi");
    fetchData();
  }, [auth.token]);

  const handleTabChange = (tabName) => {
    console.log("Chuyển tab:", tabName);
    setActiveTab(tabName);
  };

  const filteredProducts = products.filter((product) => {
    if (activeTab === "ĐÃ DUYỆT") return product.status === 1;
    if (activeTab === "TỪ CHỐI") return product.status === 2;
    if (activeTab === "ĐÃ XÓA") return product.status === 3;
    return false;
  });

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.linkImage }} style={styles.productImage} />
        <View style={styles.productStatus}>
          <Text style={styles.productStatusText}>
            {item.status === 1
              ? "Đã duyệt"
              : item.status === 2
                ? "Đã từ chối"
                : "Đã xóa"}
          </Text>
        </View>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.productName}</Text>
        <Text style={styles.productPrice}>Giá: {formatPrice(item.price)}</Text>
        <Text style={styles.productCategory}>
          Danh mục: {item.categoryName}
        </Text>
        <Text style={styles.productUser}>
          Người đăng: {item.seller?.fullName || "Không có thông tin"}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() =>
          navigation.navigate("Detail", { productId: item.productId })
        }
      >
        <Text style={styles.buttonText}>Xem</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Empty />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E90FF" />
      <View style={styles.header}>
        <Text style={styles.title}>Quản lý sản phẩm </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
      >
        {["ĐÃ DUYỆT", "TỪ CHỐI", "ĐÃ XÓA"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => handleTabChange(tab)}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab} (
              {
                products.filter((p) =>
                  tab === "ĐÃ DUYỆT"
                    ? p.status === 1
                    : tab === "TỪ CHỐI"
                      ? p.status === 2
                      : p.status === 3
                ).length
              }
              )
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.productId.toString()}
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
  productItem: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    borderColor: "blue",
    borderWidth: 2,
  },
  productImageContainer: {
    position: "relative",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
  },
  productStatus: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 2,
    borderRadius: 3,
  },
  productStatusText: {
    color: "#fff",
    fontSize: 10,
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 14,
    color: "red",
  },
  productCategory: {
    fontSize: 12,
    color: "#666",
  },
  productUser: {
    fontSize: 12,
    color: "#666",
    fontWeight: "bold",
  },
  viewButton: {
    backgroundColor: "#FFA500",
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#cc0000",
    fontSize: 16,
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
});

export default AdminProductManager;
