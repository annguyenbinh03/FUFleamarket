import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import AuthContext from "../../../context/AuthProvider";
import { formatDate } from "../../../utils/formatDate";
import Empty from "../../../components/Empty";
import formatPrice from "../../../utils/formatPrice";

const PostManager = () => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("ĐANG HIỂN THỊ");
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useContext(AuthContext);
  const navigation = useNavigation();

  const fetchProduct = useCallback(async () => {
    console.log("Đang gọi API để lấy sản phẩm...");
    console.log("Token được sử dụng:", auth.token);

    try {
      setIsLoading(true);
      const response = await axios.get(
        "http://192.168.146.25:7057/api/product/getmyproducts",
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      console.log("Phản hồi từ API:", response.data);

      if (response.status === 200 && Array.isArray(response.data)) {
        setProducts(response.data);
        console.log("Số lượng sản phẩm:", response.data.length);
      } else {
        console.error("Dữ liệu không hợp lệ:", response.data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [auth.token]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const filteredProducts = products.filter((product) => {
    if (activeTab === "ĐANG HIỂN THỊ") return product.status === 1;
    if (activeTab === "HẾT HẠN") return product.status === 2;
    if (activeTab === "BỊ TỪ CHỐI") return product.status === 0;
    return true;
  });

  const renderProductItem = ({ item }) => (
    <View style={styles.productContainer}>
      <View style={styles.productImageContainer}>
        <Image
          source={{ uri: item.imageLink || "https://via.placeholder.com/150" }}
          style={styles.productImage}
        />
        <View style={styles.productStatus}>
          <Text style={styles.productStatusText}>
            {item.status === 0
              ? "Đang chờ duyệt"
              : item.status === 1
                ? "Đã được duyệt"
                : "Từ chối duyệt"}
          </Text>
        </View>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.productName}</Text>
        <Text style={styles.productPrice}>{formatPrice(item.price)} VND</Text>
        <Text style={styles.productCreatedDate}>
          Số lượng:{item.storedQuantity}
        </Text>
        <Text style={styles.productCreatedDate}>
          Ngày đăng: {formatDate(item.createdDate)}
        </Text>
      </View>
      <View style={styles.productActions}>
        <TouchableOpacity style={styles.productActionButton}>
          <FontAwesome5 name="pencil-alt" size={16} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.productActionButton}>
          <FontAwesome5 name="eye-slash" size={16} color="#fff" />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.productActionButton}>
          <FontAwesome5 name="share" size={16} color="#fff" />
        </TouchableOpacity> */}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý tin</Text>
        <View style={{ width: 20 }} />
      </View>

      <View style={styles.tabContainer}>
        {["ĐANG HIỂN THỊ", "HẾT HẠN", "BỊ TỪ CHỐI"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => handleTabChange(tab)}
          >
            <Text style={styles.tabButtonText}>
              {tab} (
              {
                products.filter((p) =>
                  tab === "ĐANG HIỂN THỊ"
                    ? p.status === 1
                    : tab === "HẾT HẠN"
                      ? p.status === 2
                      : p.status === 0
                ).length
              }
              )
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : filteredProducts.length === 0 ? (
        <Empty />
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.productId.toString()}
          style={styles.productList}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#DD0000",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
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
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
  },
  productImageContainer: {
    position: "relative",
  },
  productImage: {
    width: 80,
    height: 80,
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
    marginLeft: 10,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 14,
    color: "#FF6347",
  },
  productCreatedDate: {
    fontSize: 12,
    color: "#777",
  },
  productActions: {
    flexDirection: "column",
    justifyContent: "space-around",
  },
  productActionButton: {
    backgroundColor: "#FFA500",
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PostManager;
