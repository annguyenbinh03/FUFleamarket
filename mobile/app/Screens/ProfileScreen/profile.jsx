import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AuthContext from "../../../context/AuthProvider";
import { useNavigation } from "@react-navigation/native";
import LogoutButton from "../../../components/LogoutButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;

const Profile = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = () => {
    AsyncStorage.removeItem("auth").then(() => {
      setAuth(null);
      navigation.navigate("LoginScreen");
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý tin</Text>
      </View>
      <View style={styles.profileContainer}>
        <Image source={{ uri: auth.avarta }} style={styles.avatar} />
        <Text style={styles.name}>{auth.fullName}</Text>
        <Text style={styles.email}>{auth.email}</Text>
      </View>
      <View style={styles.SaveItemsContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("WishListScreen", { userId: auth.id });
            console.log("User ID:", auth.id);
          }}
        >
          <FontAwesome5
            name="heart"
            size={20}
            color="#DD0000"
            style={styles.icon}
          />
          <Text style={styles.savedText}>Tin đã lưu</Text>
        </TouchableOpacity>
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
    borderRadius: 50,
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
  SaveItemsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
  },
  savedItemsButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  savedText: {
    fontSize: 16,
    color: "#000000",
    marginLeft: 5,
  },
  icon: {
    marginLeft: 0,
  },
  logoutContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: "row",
    marginTop: 10,
  },
});

export default Profile;
