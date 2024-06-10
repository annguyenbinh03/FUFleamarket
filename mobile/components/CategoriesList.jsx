import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

const categories = [
  "Đồ dùng điện tử",
  "ĐỒ dùng học tập",
  "Đồ gia dụng, nội thất &nbsp; &nbsp;",
  "Đồ ăn, thực phẩm",
  "Thời trang",
  "Giải trí, thể thao, sở thích",
  "Khác",
];

const CategoriesList = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleCategorySelect = (category) => {
    console.log(`Select Categories: ${category}`);
    setModalVisible(false);
  };

  return (
    <View style={styles.categoriesContainer}>
      <TouchableOpacity
        style={styles.categoryButton}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome5 name="list" size={20} color="#fff" />
        <Text style={styles.categoryButtonText}>Danh mục</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn danh mục</Text>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => handleCategorySelect(item)}
                >
                  <Text style={styles.categoryItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  categoriesContainer: {
    flexDirection: "row", // Thêm để đặt các nút cạnh nhau
    justifyContent: "flex-start", // Đặt nút Danh mục ở bên trái
    alignItems: "center",
    marginTop: 10,
    padding: 5,
    backgroundColor: "#fff", // Màu trắng
    width: "100%", // Chiều rộng chiếm toàn bộ màn hình
  },

  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#FFA500", // Màu cam
    borderRadius: 5,
    borderWidth: 1, // Độ dày viền
    borderColor: "#000", // Màu viền đen
    marginRight: 10, // Khoảng cách giữa các nút
  },

  categoryButtonText: {
    color: "#fff", // Màu trắng
    marginLeft: 5,
    fontSize: 12, // Thu nhỏ font size
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  categoryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  categoryItemText: {
    fontSize: 18,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#DD0000",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
  },
});

export default CategoriesList;
