import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import { getPackagesAPI } from "../api/packages";
import AuthContext from "../../context/AuthProvider";
import formatPrice from "../../utils/formatPrice";
import AdminNagativeButton from "../../components/AdminNagativeButton";

function AdminPackageManager() {
  const { auth } = useContext(AuthContext);
  const [sellingPackages, setSellingPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = async () => {
    try {
      const packageData = await getPackagesAPI(auth.token);
      setSellingPackages(packageData.data);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
    }
  };

  const handleEditPackage = (choosenPackage) => {
    setSelectedPackage(choosenPackage);
    setModalVisible(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Quản lý gói bán hàng</Text>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Danh mục các gói bán hàng</Text>
          <AdminNagativeButton
            to="AdminOrderPackage"
            title="Quản lý đơn gói bán hàng"
            style={styles.productManagerButton}
          />
        </View>
      </View>
      <View style={styles.content}>
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.buttonText}>Tạo gói mới</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderPackageItem = ({ item }) => (
    <View style={styles.card}>
      <Image style={styles.cardImage} source={{ uri: item.imageLink }} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
        <Text style={styles.cardPrice}>
          {formatPrice(item.price)}
          <Text style={styles.pricePerMonth}> / tháng</Text>
        </Text>
        <View style={styles.cardDetail}>
          <Text style={styles.checkIcon}>✓</Text>
          <Text style={styles.detailText}>
            Lượt đăng sản phẩm: {item.productQuantityLimit}
          </Text>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => handleEditPackage(item)}
        >
          <Text style={styles.buttonText}>Sửa gói</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => Alert.alert("Thông báo", "COMING SOON")}
        >
          <Text style={styles.buttonText}>Xóa gói</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sellingPackages}
        renderItem={renderPackageItem}
        keyExtractor={(item) => item.promotionId.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContentContainer}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sửa thông tin gói</Text>
            {selectedPackage && (
              <View style={styles.modalBody}>
                <Image
                  style={styles.modalImage}
                  source={{ uri: selectedPackage.imageLink }}
                />
                <View style={styles.modalInfo}>
                  <Text style={styles.modalPackageName}>
                    {selectedPackage.name}
                  </Text>
                  <Text>{selectedPackage.description}</Text>
                  <Text>Giá: {formatPrice(selectedPackage.price)}</Text>
                  <Text>
                    Số lượng tin: {selectedPackage.productQuantityLimit}
                  </Text>
                </View>
              </View>
            )}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Đóng</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.saveButton]}>
                <Text style={styles.buttonText}>Lưu thay đổi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F8FF",
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "#1E90FF",
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  subtitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "white",
  },
  productManagerButton: {
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
  },
  content: {
    padding: 10,
  },
  createButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  cardBody: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  pricePerMonth: {
    fontSize: 14,
    color: "#666",
  },
  cardDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  checkIcon: {
    color: "green",
    marginRight: 5,
  },
  detailText: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "orange",
  },
  deleteButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalBody: {
    flexDirection: "row",
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 15,
  },
  modalInfo: {
    flex: 1,
  },
  modalPackageName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: "gray",
  },
  saveButton: {
    backgroundColor: "blue",
  },
});

export default AdminPackageManager;
