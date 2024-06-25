import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { StatusBar } from "expo-status-bar";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import AuthContext from "../../../context/AuthProvider";
import axios from "axios";
import formatPrice from "../../../utils/formatPrice";

const PostProduct = () => {
  const navigation = useNavigation();
  const { auth } = useContext(AuthContext);

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [isNew, setIsNew] = useState(true);
  const [imageUri, setImageUri] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleImagePicker = async (type) => {
    let permissionResult;
    let result;

    if (type === "camera") {
      permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert(
          "Thông báo",
          "Bạn cần cấp quyền truy cập camera để sử dụng tính năng này."
        );
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert(
          "Thông báo",
          "Bạn cần cấp quyền truy cập thư viện ảnh để sử dụng tính năng này."
        );
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePostProduct = async () => {
    if (!productName || !price || !description || !categoryId || !imageUri) {
      Alert.alert(
        "Thông báo",
        "Vui lòng điền đầy đủ thông tin sản phẩm và chọn ảnh."
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.146.25:7057/api/product/CreateProductForSellers",
        {
          productName,
          price: parseFloat(price),
          description,
          categoryId,
          isNew,
          imageUrl: imageUri,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert(
          "Thành công",
          "Sản phẩm đã được đăng và đang chờ admin duyệt."
        );
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error posting product:", error);
      Alert.alert("Lỗi", "Không thể đăng sản phẩm. Vui lòng thử lại sau.");
    }
  };

  const renderPreviewModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showPreview}
      onRequestClose={() => setShowPreview(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Xem trước sản phẩm</Text>
          <ScrollView style={styles.previewScroll}>
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            )}
            <View style={styles.previewInfoContainer}>
              <Text style={styles.previewProductName}>{productName}</Text>
              <Text style={styles.previewPrice}>
                Giá: {formatPrice(price)} VNĐ
              </Text>
              <Text style={styles.previewCategory}>
                {getCategoryName(categoryId)}
              </Text>
              <Text style={styles.previewCondition}>
                Tình trạng:
                {isNew ? " Mới" : " Đã sử dụng"}
              </Text>
              <Text style={styles.previewDescription}>{description}</Text>
            </View>
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowPreview(false)}
          >
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const getCategoryName = (id) => {
    const categories = {
      1: "Đồ điện tử",
      2: "Đồ dùng học tập",
      3: "Điện lạnh",
      4: "Đồ gia dụng, nội thất",
      5: "Đồ ăn, thực phẩm",
      6: "Thời trang",
      7: "Giải trí, thể thao, sở thích",
    };
    return categories[id] || "Unknown";
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#DD0000" style="light" />
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đăng tin</Text>
          <View style={{ width: 20 }} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Product Image Area */}
          <View style={styles.productImageArea}>
            <Text style={styles.sectionTitle}>Hình ảnh sản phẩm</Text>
            <View style={styles.imagePickerButtonsContainer}>
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={() => handleImagePicker("library")}
              >
                <FontAwesome5 name="images" size={20} color="#fff" />
                <Text style={styles.imagePickerText}>Thư viện</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={() => handleImagePicker("camera")}
              >
                <FontAwesome5 name="camera" size={20} color="#fff" />
                <Text style={styles.imagePickerText}>Chụp ảnh</Text>
              </TouchableOpacity>
            </View>
            {imageUri && (
              <Image source={{ uri: imageUri }} style={styles.uploadedImage} />
            )}
          </View>

          {/* Product Detail Area */}
          <View style={styles.productDetailArea}>
            <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>

            {/* Category Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Danh mục</Text>
              <Picker
                selectedValue={categoryId}
                onValueChange={(itemValue) => setCategoryId(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Đồ điện tử" value={1} />
                <Picker.Item label="Đồ dùng học tập" value={2} />
                <Picker.Item label="Điện lạnh" value={3} />
                <Picker.Item label="Đồ gia dụng, nội thất" value={4} />
                <Picker.Item label="Đồ ăn, thực phẩm" value={5} />
                <Picker.Item label="Thời trang" value={6} />
                <Picker.Item label="Giải trí, thể thao, sở thích" value={7} />
              </Picker>
            </View>

            {/* Product Condition Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tình trạng sản phẩm</Text>
              <Picker
                selectedValue={isNew}
                onValueChange={(itemValue) => setIsNew(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Mới" value={true} />
                <Picker.Item label="Cũ" value={false} />
              </Picker>
            </View>

            {/* Product Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tên sản phẩm</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập tên sản phẩm"
                value={productName}
                onChangeText={setProductName}
              />
            </View>

            {/* Price Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Giá bán (VNĐ)</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập giá sản phẩm"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mô tả chi tiết</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={6}
                placeholder="Mô tả chi tiết về sản phẩm"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.previewButton}
                onPress={() => setShowPreview(true)}
              >
                <Text style={styles.buttonText}>Xem trước</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.postButton}
                onPress={handlePostProduct}
              >
                <Text style={styles.buttonText}>Đăng tin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      {renderPreviewModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#DD0000",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  productImageArea: {
    marginBottom: 24,
  },
  imagePickerButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  imagePickerButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 8,
    flexDirection: "row",
    justifyContent: "center",
  },
  imagePickerText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  uploadedImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginTop: 16,
    borderRadius: 8,
  },
  productDetailArea: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  previewButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  postButton: {
    backgroundColor: "#34C759",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "90%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  previewScroll: {
    maxHeight: "80%",
  },
  previewImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    marginBottom: 16,
    borderRadius: 12,
  },
  previewInfoContainer: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 12,
  },
  previewProductName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  previewPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ed1c24",
    marginBottom: 8,
  },
  previewCategory: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  previewCondition: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
  },
  closeButton: {
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default PostProduct;
