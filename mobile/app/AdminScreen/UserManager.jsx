import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { formatDate } from "../../utils/formatDate";
import Empty from "../../components/Empty";
import { getAllUserAPI } from "../api/user_api";
import AuthContext from "../../context/AuthProvider";

const UserManager = () => {
  const navigation = useNavigation();

  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const { auth } = useContext(AuthContext);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await getAllUserAPI();
      console.log("Check API Response:", response.data);
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Check Error fetching users:", error);
      setError(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    console.log("Check Users:", users);
  }, [users]);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#DD0000" />
      </View>
    );
  }

  if (error || users.length === 0) {
    return <Empty />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Quản lý người dùng</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.userId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() =>
              navigation.navigate("UserDetailScreen", { userId: item.userId })
            }
          >
            <Image source={{ uri: item.avarta }} style={styles.userAvatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.fullName}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              <Text style={styles.createdDate}>
                {formatDate(item.createdDate)}
              </Text>
              <Text style={styles.role}>
                {item.roleId === 1 ? "Người dùng" : "Người điều hành"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F8FF",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    backgroundColor: "#1E90FF",
    padding: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  userItem: {
    flexDirection: "row",
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: "white",
    gap: 10,
  },
  userInfo: {
    flex: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: 50,
    shadowColor: "black",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 15,
    color: "#555",
  },
  createdDate: {
    fontSize: 10,
    color: "#555",
  },
  role: {
    fontSize: 10,
    color: "#555",
    fontWeight: "bold",
    color: "green",
  },
});

export default UserManager;
