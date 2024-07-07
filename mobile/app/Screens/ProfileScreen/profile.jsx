import React, { useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AuthContext from "../../../context/AuthProvider";
import { useNavigation, CommonActions } from "@react-navigation/native";
import LogoutButton from "../../../components/LogoutButton";
import WishListButton from "../../../components/WishListButton";
import BuyOrderButton from "../../../components/BuyOrderButton";
import SellOrderButton from "../../../components/SellOrderButton";

const { width } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;

const Profile = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    if (!auth || !auth.token) {
      console.log(
        "Không tìm thấy thông tin xác thực, chuyển hướng đến màn hình đăng nhập"
      );
      redirectToLogin();
    } else {
      console.log("Auth:", auth);
    }
  }, [auth]);

  const redirectToLogin = () => {
    console.log("Chuyển hướng đến màn hình đăng nhập");
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "LoginScreen" }],
      })
    );
  };

  const handleLogout = async () => {
    console.log("Đang đăng xuất...");
    await logout();
    console.log("Đã đăng xuất thành công rồi");
    redirectToLogin();
  };

  if (!auth || !auth.token) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#DD0000" />
      </View>
    );
  }

  console.log("Hiển thị thông tin người dùng:", auth);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tài khoản</Text>
        <View style={{ width: 20 }} />
      </View>
      <View style={styles.profileContainer}>
        <Image
          source={
            auth.avarta
              ? { uri: auth.avarta }
              : require("../../../assets/images/empty.png")
          }
          style={styles.avatar}
        />
        <Text style={styles.name}>{auth.fullName}</Text>
      </View>
      <View style={styles.infoSection}>
        <InfoItem icon="envelope" text={auth.email} />
        <InfoItem icon="phone" text={auth.phoneNumber || "Chưa cập nhật"} />
        <InfoItem
          icon="map-marker-alt"
          text={auth.address || "Chưa cập nhật"}
        />
      </View>
      <View style={styles.buttonContainer}>
        <WishListButton />
        <BuyOrderButton />
        <SellOrderButton />
        <LogoutButton onPress={handleLogout} />
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
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  avatar: {
    width: thumbMeasure,
    height: thumbMeasure,
    borderRadius: 100,
    backgroundColor: "#ccc",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  infoSection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 20,
    elevation: 2,
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
  },
  buttonContainer: {
    paddingHorizontal: 15,
  },
});

export default Profile;
