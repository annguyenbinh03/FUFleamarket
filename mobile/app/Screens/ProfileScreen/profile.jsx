import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AuthContext from "../../../context/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import LogoutButton from "../../../components/LogoutButton";
import WishListButton from "../../../components/WishListButton"; // Import WishListButton
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;

const Profile = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Fetch auth data from AsyncStorage on component mount
    const fetchAuthData = async () => {
      try {
        const storedAuth = await AsyncStorage.getItem("auth");
        if (storedAuth) {
          setAuth(JSON.parse(storedAuth));
        }
        setIsLoading(false); // Set loading to false after fetching
      } catch (error) {
        console.error("Error fetching auth data:", error);
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

  // Conditional rendering based on loading and auth state
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
        <Text>You are not logged in.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hồ sơ</Text>
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
      <View style={styles.savedItemsContainer}>
        <WishListButton />
      </View>
      <View style={styles.logoutContainer}>
        <LogoutButton onPress={handleLogout} />
      </View>
    </View>
  );
};

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
    fontSize: 18,
    color: "#555",
  },
  savedItemsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logoutContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default Profile;
