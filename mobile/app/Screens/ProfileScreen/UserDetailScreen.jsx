import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import { formatDate } from "../../../utils/formatDate";
import Empty from "../../../components/Empty";
import { MaterialIcons } from "@expo/vector-icons";

const UserDetailScreen = () => {
  const route = useRoute();
  const { user } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image style={styles.avatar} />
        </View>
        <Text style={styles.name}>Tên user</Text>
        <Text style={styles.createdDate}>
          Thành viên từ: 12 tháng 6 năm 2024
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Thông tin</Text>
        <InfoItem icon="email" text="example@fpt.edu.vn" />
        <InfoItem icon="phone" text="375995822" />
        <InfoItem icon="location-on" text="113/10 Phan Chu Trinh" />
      </View>

      <View style={styles.introductionSection}>
        <Text style={styles.sectionTitle}>Giới thiệu</Text>
        <Text style={styles.introduction}>Tôi vô cùng đẹp trai</Text>
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
