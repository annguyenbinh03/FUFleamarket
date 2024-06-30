import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import axios from "axios";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ChatButton from "../../../components/ChatButton";
import WishListAddButton from "../../../components/WishListAddButton";
import formatPrice from "../../../utils/formatPrice";
import Empty from "../../../components/Empty";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const UserDetailScreen = ({ route }) => {
  const { userId } = route.params;
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      console.log("userId:", userId);
      try {
        const response = await axios.get(
          `http://192.168.146.25:7057/api/product/ShopProfile?id=${userId}`
        );
        setUserInfo(response.data.user);
        console.log("userInfo:", response.data.user);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);

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

  console.log("Họ và tên:", userInfo.fullName);
  console.log("Ảnh đại diện:", userInfo.avarta);
  console.log("Số điện thoại:", userInfo.phoneNumber);
  console.log("Địa chỉ:", userInfo.addresses?.[0]?.specificAddress);
  console.log("Xếp hạng bán hàng:", userInfo.sellRating);
  console.log("Giới thiệu:", userInfo.introduction);

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
        <Text style={styles.createdDate}>
          Thành viên từ: {userInfo.createdDate}
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Thông tin</Text>
        <InfoItem icon="phone" text={userInfo.phoneNumber || "Chưa cập nhật"} />
        <InfoItem
          icon="location-on"
          text={userInfo.addresses?.[0]?.specificAddress || "Chưa cập nhật"}
        />
        <InfoItem
          icon="star"
          text={
            userInfo.sellRating !== 0
              ? userInfo.sellRating.toString()
              : "Chưa có đánh giá"
          }
        />
      </View>

      <View style={styles.introductionSection}>
        <Text style={styles.sectionTitle}>Giới thiệu</Text>
        <Text style={styles.introduction}>
          {userInfo.introduction || "Người dùng chưa thêm giới thiệu."}
        </Text>
      </View>
    </ScrollView>
  );
};

const InfoItem = ({ icon, text }) => (
  <View style={styles.infoItem}>
    <MaterialIcons name={icon} size={24} color="#4A90E2" style={styles.icon} />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#4A90E2",
    padding: 20,
    alignItems: "center",
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    elevation: 5,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  createdDate: {
    fontSize: 14,
    color: "#E0E0E0",
  },
  infoSection: {
    backgroundColor: "#FFFFFF",
    margin: 15,
    borderRadius: 10,
    padding: 15,
    elevation: 2,
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
  },
  introductionSection: {
    backgroundColor: "#FFFFFF",
    margin: 15,
    borderRadius: 10,
    padding: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  introduction: {
    fontSize: 16,
    color: "#555555",
    lineHeight: 22,
  },
});

export default UserDetailScreen;
