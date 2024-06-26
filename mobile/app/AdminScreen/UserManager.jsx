import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { formatDate } from "../../utils/formatDate";
import Empty from "../../components/Empty";

const UserManager = () => {
  const navigation = useNavigation();

  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://192.168.146.25:7057/api/user/AllProfile(Admin)"
      );
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
      <Text style={styles.title}>Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.userId.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userItem}
            onPress={() =>
              navigation.navigate("UserDetail", { userId: item.userId })
            }
          >
            <Image source={{ uri: item.avarta }} style={styles.userAvatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.fullName}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              <Text style={styles.createdDate}>
                {formatDate(item.createdDate)}
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
    padding: 15,
    gap: 10,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 15,
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
    width: 100,
    height: 100,
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
});

export default UserManager;
