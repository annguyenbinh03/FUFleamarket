import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { getMyProductsAPI } from "../../api/product";
import { useNavigation } from "@react-navigation/native";
import { useState, useContext } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const PostManager = () => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("ĐANG HIỂN THỊ");
  // const { auth } = useContext(AuthContext);
  const navigation = useNavigation();

  // const fetchProduct = async () => {
  //   try {
  //     const response = await getMyProductsAPI(auth.accessToken);
  //     setProducts(response);
  //   } catch (error) {
  //     console.error("Error fetching product:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchProduct();
  // }, []);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const filteredProducts = products.filter((product) => {
    if (activeTab === "ĐANG HIỂN THỊ") {
      return product.status === 1; // Assuming "ĐANG HIỂN THỊ" means "Approved"
    } else if (activeTab === "HẾT HẠN") {
      return product.status === 2; // Assuming "HẾT HẠN" means "Expired"
    } else if (activeTab === "BỊ TỪ CHỐI") {
      return product.status === 0; // Assuming "BỊ TỪ CHỐI" means "Rejected"
    }
    // Add other status filters as needed...
    return true;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý tin</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {/* Shopview */}
        <View style={styles.shopview}>
          <View style={styles.shopInfo}>
            <View style={[styles.shopAvatar, { backgroundColor: "#ddd" }]} />
            <View style={styles.shopName}>
              {/* <Text style={styles.shopNameText}>{fullName}</Text> */}
              <View style={styles.shopRating}>
                <FontAwesome5 name="star" size={12} color="#FFD700" />
                <FontAwesome5 name="star" size={12} color="#FFD700" />
                <FontAwesome5 name="star" size={12} color="#FFD700" />
                <FontAwesome5 name="star" size={12} color="#FFD700" />
                <FontAwesome5 name="star-half-alt" size={12} color="#FFD700" />
                <Text style={styles.shopRatingText}>(18 reviews)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Post Navigation Tabs */}
        <View style={styles.postNav}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "ĐANG HIỂN THỊ" && styles.activeTab,
              ]}
              onPress={() => handleTabChange("ĐANG HIỂN THỊ")}
            >
              <Text style={styles.tabButtonText}>
                ĐANG HIỂN THỊ (
                {filteredProducts.filter((p) => p.status === 1).length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "HẾT HẠN" && styles.activeTab,
              ]}
              onPress={() => handleTabChange("HẾT HẠN")}
            >
              <Text style={styles.tabButtonText}>
                HẾT HẠN ({filteredProducts.filter((p) => p.status === 2).length}
                )
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "BỊ TỪ CHỐI" && styles.activeTab,
              ]}
              onPress={() => handleTabChange("BỊ TỪ CHỐI")}
            >
              <Text style={styles.tabButtonText}>
                BỊ TỪ CHỐI (
                {filteredProducts.filter((p) => p.status === 0).length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Product List */}
        <ScrollView style={styles.productList}>
          {filteredProducts.map((product) => (
            <View style={styles.productContainer} key={product.productId}>
              <View style={styles.productRow}>
                <View style={styles.productInfo}>
                  <View style={styles.productImage}>
                    <Image
                      source={{
                        uri:
                          product.imageUrl ||
                          "https://th.bing.com/th/id/OIP.W0Eid8HDx9_9G0SoUvWI4AHaE7?w=300&h=200&c=7&r=0&o=5&pid=1.7",
                      }}
                      style={styles.productImage}
                    />
                    {/* Status Icon */}
                    {product.status === 0 && (
                      <View style={styles.productStatusPending}>
                        <Text style={styles.productStatusText}>
                          Đang chờ duyệt
                        </Text>
                      </View>
                    )}
                    {product.status === 1 && (
                      <View style={styles.productStatusApproved}>
                        <Text style={styles.productStatusText}>
                          Đã được duyệt
                        </Text>
                      </View>
                    )}
                    {product.status === 2 && (
                      <View style={styles.productStatusRejected}>
                        <Text style={styles.productStatusText}>
                          Từ chối duyệt
                        </Text>
                      </View>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("ProductDetails", {
                        productId: product.productId,
                      })
                    }
                  >
                    <Text style={styles.productName}>
                      {product.productName}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.productPrice}>{product.price}</Text>
                  <Text style={styles.productAddress}>
                    Phường Dĩ An, Thành phố Dĩ An, Bình Dương
                  </Text>
                  <Text style={styles.productCreatedDate}>
                    Ngày đăng tin: {product.createdDate}
                  </Text>
                </View>
                <View style={styles.productActions}>
                  <TouchableOpacity style={styles.productActionButton}>
                    <FontAwesome5
                      name="pencil-square-o"
                      size={16}
                      color="#fff"
                    />
                    <Text style={styles.productActionButtonText}>Sửa tin</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.productActionButton}>
                    <FontAwesome5 name="eye-slash" size={16} color="#fff" />
                    <Text style={styles.productActionButtonText}>Ẩn tin</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.productActionButton}>
                    <FontAwesome5 name="share" size={16} color="#fff" />
                    <Text style={styles.productActionButtonText}>Chia sẻ</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
      {/* <Footer /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  scrollView: {
    flex: 1,
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
  shopview: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  shopInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  shopAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  shopName: {
    flex: 1,
  },
  shopNameText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  shopRating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  shopRatingText: {
    fontSize: 12,
    marginLeft: 5,
  },
  postNav: {
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tabButton: {
    padding: 10,
    backgroundColor: "#fff",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    flex: 1,
    margin: 5,
  },
  activeTab: {
    backgroundColor: "#FFA500",
  },
  tabButtonText: {
    textAlign: "center",
    fontSize: 14,
    color: "#333",
  },
  productList: {
    padding: 16,
    backgroundColor: "#fff",
  },
  productContainer: {
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productInfo: {
    flex: 1,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginBottom: 10,
  },
  productStatusPending: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  productStatusApproved: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  productStatusRejected: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#f44336",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  productStatusText: {
    color: "#fff",
    fontSize: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    marginBottom: 5,
  },
  productAddress: {
    fontSize: 12,
    marginBottom: 5,
  },
  productCreatedDate: {
    fontSize: 12,
    marginBottom: 5,
    color: "#777",
  },
  productActions: {
    flexDirection: "row",
  },
  productActionButton: {
    backgroundColor: "#FFA500",
    padding: 8,
    borderRadius: 5,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  productActionButtonText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 5,
  },
});

export default PostManager;
