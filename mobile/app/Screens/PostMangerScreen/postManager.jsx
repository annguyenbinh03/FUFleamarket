import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AuthContext from "../../../context/AuthProvider";
import { formatDate } from "../../../utils/formatDate";
import Empty from "../../../components/Empty";
import formatPrice from "../../../utils/formatPrice";
import { getMyProductsAPI } from "../../api/product";
import { getMyPackageAPI } from "../../api/packages";

const PostManager = () => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("ĐANG HIỂN THỊ");
  const [isLoading, setIsLoading] = useState(true);
  const [sellingPackages, setSellingPackages] = useState([]);
  const { auth } = useContext(AuthContext);
  const navigation = useNavigation();

  const fetchProducts = useCallback(async () => {
    console.log("Token:", auth.token);

    try {
      setIsLoading(true);
      const response = await getMyProductsAPI(auth.token);

      console.log("Phản hồi API:", response.data);

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
    fetchProducts();
  }, [fetchProducts]);

  const fetchMyPackage = useCallback(async () => {
    try {
      const response = await getMyPackageAPI(auth.token);
      setSellingPackages(response.data);
      console.log("Gói bán hàng:", response.data);
      console.log(
        "Giới hạn số lượng sản phẩm:",
        response.data[0].promotion.productQuantityLimit
      );
    } catch (error) {
      console.error("Lỗi khi lấy gói bán hàng:", error);
    }
  }, [auth.token]);

  useEffect(() => {
    fetchMyPackage();
  }, [fetchMyPackage]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const filteredProducts = products.filter((product) => {
    if (activeTab === "ĐANG HIỂN THỊ") return product.status === 1;
    if (activeTab === "ĐANG CHỜ DUYỆT") return product.status === 0;
    if (activeTab === "BỊ TỪ CHỐI") return product.status === 2;
    if (activeTab === "ĐÃ ẨN") return product.status === 3;
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
                ? "Đang hiển thị"
                : item.status === 2
                  ? "Bị từ chối"
                  : "Đã ẩn"}
          </Text>
        </View>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.productName}</Text>
        <Text style={styles.productPrice}>{formatPrice(item.price)} VND</Text>
        <Text style={styles.productCreatedDate}>
          Số lượng: {item.storedQuantity}
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
        <TouchableOpacity style={styles.productActionButton}>
          <FontAwesome5 name="share" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#DD0000" barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý tin</Text>
        <View style={{ width: 20 }} />
        <View>
          <Text>
            Số bài đăng {products.length}/
            {sellingPackages[0]?.promotion.productQuantityLimit || 0}
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
      >
        {["ĐANG HIỂN THỊ", "ĐANG CHỜ DUYỆT", "BỊ TỪ CHỐI", "ĐÃ ẨN"].map(
          (tab) => (
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
                    tab === "ĐANG HIỂN THỊ"
                      ? p.status === 1
                      : tab === "ĐANG CHỜ DUYỆT"
                        ? p.status === 0
                        : tab === "BỊ TỪ CHỐI"
                          ? p.status === 2
                          : p.status === 3
                  ).length
                }
                )
              </Text>
            </TouchableOpacity>
          )
        )}
      </ScrollView>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Empty />
        </View>
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
  container: {
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
    margin: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    marginTop: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PostManager;
