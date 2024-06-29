import React, { useState, useEffect, useContext } from "react";
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
import { useNavigation } from "@react-navigation/native";
import LogoutButton from "../../../components/LogoutButton";
import WishListButton from "../../../components/WishListButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BuyOrderButton from "../../../components/BuyOrderButton";
import SellOrderButton from "../../../components/SellOrderButton";

const { width } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;

const Profile = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const storedAuth = await AsyncStorage.getItem("auth");
        if (storedAuth) {
          setAuth(JSON.parse(storedAuth));
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu xác thực:", error);
        setIsLoading(false);
      }
    };
    fetchAuthData();
  }, []);

  const handleLogout = () => {
    AsyncStorage.removeItem("auth").then(() => {
      setAuth(null);
      navigation.navigate("LoginScreen");
    });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#DD0000" />
      </View>
    );
  }

  if (!auth) {
    return (
      <View style={styles.container}>
        <Text>Bạn chưa đăng nhập.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hồ sơ</Text>
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
        <Text style={styles.email}>{auth.email}</Text>
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
  email: {
    fontSize: 16,
    color: "#555",
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
