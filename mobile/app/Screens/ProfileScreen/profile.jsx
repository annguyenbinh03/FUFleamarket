import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AuthContext from "../../../context/AuthProvider";
import { useNavigation, CommonActions } from "@react-navigation/native";
import LogoutButton from "../../../components/LogoutButton";
import WishListButton from "../../../components/WishListButton";
import BuyOrderButton from "../../../components/BuyOrderButton";
import SellOrderButton from "../../../components/SellOrderButton";
import { getShopProfileAPI } from "../../api/user_api";
import { formatDate } from "../../../utils/formatDate";
import TradingOrderButton from "../../../components/TradingOrderButton";
import MySellingPackageButton from "../../../components/MySellingPackageButton";
import TradingOrderRequestButton from "../../../components/TradingOrderRequestButton";

const Profile = () => {
  const { auth } = useContext(AuthContext);
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !auth.token) {
      redirectToLogin();
    } else {
      fetchUserInfo();
    }
  }, [auth]);

  const fetchUserInfo = async () => {
    try {
      const response = await getShopProfileAPI(auth.userId);
      if (response && response.data && response.data.user) {
        setUserInfo(response.data.user);
      } else {
        console.error("Invalid response structure:", response);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setLoading(false);
    }
  };

  const redirectToLogin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DD0000" />
      </View>
    );
  }

  if (!userInfo) {
    return (
      <View style={styles.errorContainer}>
        <Text>Không thể tải thông tin người dùng. Vui lòng thử lại sau.</Text>
      </View>
    );
  }

  return (
    <ScrollView nestedScrollEnabled={true} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome5 name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tài khoản</Text>
        <View style={styles.placeholder}></View>
      </View>

      <View style={styles.profileContainer}>
        <Image source={{ uri: userInfo.avarta }} style={styles.avatar} />
        <Text style={styles.name}>{userInfo.fullName}</Text>
      </View>

      <View style={styles.infoSection}>
        <InfoItem icon="envelope" text={userInfo.email} />
        <InfoItem icon="phone" text={userInfo.phoneNumber} />
        <InfoItem
          icon="map-marker-alt"
          text={
            userInfo.addresses && userInfo.addresses[0]
              ? userInfo.addresses[0].specificAddress
              : "Không có địa chỉ"
          }
        />
        <InfoItem
          icon="info-circle"
          text={userInfo.introduction || "Không có giới thiệu"}
        />
        <InfoItem
          icon="calendar-check"
          text={`Đã tham gia: ${formatDate(userInfo.createdDate)}`}
        />
        <InfoItem
          icon="star"
          text={`Đánh giá bán: ${userInfo.sellRating || "Chưa có"}`}
        />
        <InfoItem
          icon="shopping-bag"
          text={`Đánh giá mua: ${userInfo.buyRating || "Chưa có"}`}
        />
      </View>

      <View style={styles.buttonContainer}>
        <WishListButton />
        <SellOrderButton />
        <TradingOrderRequestButton />
        <BuyOrderButton />
        <TradingOrderButton />
        <MySellingPackageButton />
        <LogoutButton />
      </View>
    </ScrollView>
  );
};

const InfoItem = ({ icon, text }) => (
  <View style={styles.infoItem}>
    <FontAwesome5 name={icon} size={20} color="#DD0000" style={styles.icon} />
    <Text style={styles.infoText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#DD0000",
    textAlign: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  infoSection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  icon: {
    marginRight: 15,
    width: 20,
    textAlign: "center",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  editButtons: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 10,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  editName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DD0000",
  },
  editInfoText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#DD0000",
  },
  buttonContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
});

export default Profile;
