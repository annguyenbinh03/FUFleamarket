import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import formatPrice from "../../../utils/formatPrice";
import Empty from "../../../components/Empty";
import { MaterialIcons } from "@expo/vector-icons";
import { formatDate } from "../../../utils/formatDate";
import { getShopProfileAPI } from "../../api/user_api";

const { width } = Dimensions.get("window");

const UserDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params;
  const [userInfo, setUserInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getShopProfileAPI;
        setUserInfo(response.data.user);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  const renderProductItem = useCallback(
    ({ item }) => {
      const handlePressToDetail = () => {
        navigation.navigate("Detail", { productId: item.productId });
      };

      return (
        <TouchableOpacity
          style={styles.productItem}
          onPress={handlePressToDetail}
        >
          <Image source={{ uri: item.imageLink }} style={styles.productImage} />
          <Text style={styles.productName}>{item.productName}</Text>
          <Text style={styles.productPrice}>{formatPrice(item.price)} VND</Text>
          <Text style={styles.description}>{item.description}</Text>
        </TouchableOpacity>
      );
    },
    [navigation]
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#DD0000" />
      </View>
    );
  }

  if (!userInfo) {
    return <Empty />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri:
                userInfo.avarta ||
                "https://i.pinimg.com/originals/d9/b8/3a/d9b83aa1a08be3e46ebb47254db8cf75.jpg",
            }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>{userInfo.fullName}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Thông tin</Text>
        <Text style={styles.createdDate}>
          Thành viên từ: {formatDate(userInfo.createdDate)}
        </Text>
        <View style={styles.infoItem}>
          <MaterialIcons
            name="phone"
            size={24}
            color="#4A90E2"
            style={styles.icon}
          />
          <Text style={styles.infoText}>
            {userInfo.phoneNumber || "Chưa cập nhật"}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialIcons
            name="location-on"
            size={24}
            color="#4A90E2"
            style={styles.icon}
          />
          <Text style={styles.infoText}>
            {userInfo.addresses?.[0]?.specificAddress || "Chưa cập nhật"}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialIcons
            name="star"
            size={24}
            color="#4A90E2"
            style={styles.icon}
          />
          <Text style={styles.infoText}>
            {userInfo.sellRating !== 0
              ? `${userInfo.sellRating.toFixed(1)} ⭐`
              : "Chưa có đánh giá"}
          </Text>
        </View>
      </View>

      <View style={styles.introductionSection}>
        <Text style={styles.sectionTitle}>Giới thiệu</Text>
        <Text style={styles.introduction}>
          {userInfo.introduction || "Người dùng chưa thêm giới thiệu."}
        </Text>
      </View>

      <View style={styles.productsSection}>
        <Text style={styles.sectionTitle}>
          Sản phẩm đang bán: {products.length}
        </Text>

        {products.length > 0 ? (
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.productId.toString()}
            numColumns={2}
            contentContainerStyle={styles.productList}
          />
        ) : (
          <Text style={styles.noProductText}>Không có sản phẩm nào.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#4A90E2",
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  createdDate: {
    fontSize: 16,
    color: "#333333",
    flex: 1,
  },
  infoSection: {
    backgroundColor: "#FFFFFF",
    margin: 15,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  icon: {
    marginRight: 15,
  },
  infoText: {
    fontSize: 16,
    color: "#333333",
    flex: 1,
  },
  introductionSection: {
    backgroundColor: "#FFFFFF",
    margin: 15,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 15,
  },
  introduction: {
    fontSize: 16,
    color: "#555555",
    lineHeight: 24,
  },
  productsSection: {
    margin: 15,
  },
  productList: {
    justifyContent: "space-between",
  },
  productItem: {
    width: (width - 45) / 2,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    marginLeft: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 14,
    color: "#DD0000",
    fontWeight: "bold",
  },
  description: {
    fontSize: 12,
    color: "#777",
    marginTop: 5,
  },
  noProductText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
    marginTop: 20,
  },
});

export default UserDetailScreen;
