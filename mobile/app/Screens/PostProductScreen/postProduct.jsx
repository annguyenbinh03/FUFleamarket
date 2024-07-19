import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import AuthContext from "../../../context/AuthProvider";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { imageDb } from "../../FirebaseImage/Config";
import { createProductAPI } from "../../api/product";
import formatPrice from "../../../utils/formatPrice";

const PostProduct = () => {
  const navigation = useNavigation();
  const { auth } = useContext(AuthContext);

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [isNew, setIsNew] = useState(true);
  const [dealType, setDealType] = useState(true);
  const [imageUri, setImageUri] = useState(null);
  const [storedQuantity, setStoredQuantity] = useState("");

  const handleImagePicker = async (sourceType) => {
    console.log("Bắt đầu chọn ảnh từ:", sourceType);
    let result;
    if (sourceType === "camera") {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
    }

    console.log("Kết quả chọn ảnh:", result);
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      console.log("Đã cập nhật imageUri:", result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    console.log("Bắt đầu tải ảnh lên...");
    if (!imageUri) {
      console.log("Không có ảnh để tải lên.");
      return "";
    }

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const imageName = `productImages/${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const imageRef = ref(imageDb, imageName);
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      console.log("URL tải ảnh:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error);
      return "";
    }
  };

  const handlePriceChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setPrice(numericValue);
    console.log("Giá sau khi định dạng:", numericValue);
  };

  const handleStoredQuantityChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    if (parseInt(numericValue) > 0 || numericValue === "") {
      setStoredQuantity(numericValue);
    } else {
      Alert.alert("Lỗi", "Số lượng phải lớn hơn 0");
    }
  };

  const handlePostProduct = async () => {
    console.log("Bắt đầu quá trình đăng sản phẩm");

    console.log("Kiểm tra thông tin sản phẩm:");
    console.log("Tên sản phẩm:", productName);
    console.log("Giá:", price);
    console.log("Mô tả:", description);
    console.log("Danh mục ID:", categoryId);
    console.log("Là sản phẩm mới:", isNew);
    console.log("Loại giao dịch:", dealType);
    console.log("URI hình ảnh:", imageUri);
    console.log("Số lượng:", storedQuantity);

    if (
      !productName ||
      !price ||
      !description ||
      !categoryId ||
      !imageUri ||
      !storedQuantity ||
      parseInt(storedQuantity) <= 0
    ) {
      console.log("Thông tin sản phẩm không đầy đủ hoặc không hợp lệ");
      Alert.alert(
        "Thông báo",
        "Vui lòng điền đầy đủ thông tin sản phẩm, chọn ảnh và đảm bảo số lượng lớn hơn 0."
      );
      return;
    }

    const imageUrl = await uploadImage();

    if (!imageUrl) {
      console.log("Không thể tải lên hình ảnh");
      Alert.alert("Lỗi", "Không thể tải lên hình ảnh. Vui lòng thử lại.");
      return;
    }

    const productData = {
      productName,
      price: parseInt(price),
      description,
      categoryId,
      isNew,
      ImageLink: imageUrl,
      storedQuantity: parseInt(storedQuantity),
      dealType,
      status: 1,
    };

    try {
      const response = await createProductAPI(productData);
      console.log("Sản phẩm đã được đăng thành công:", response.data);
      Alert.alert("Thành công", "Sản phẩm đã được đăng thành công");
      navigation.goBack();
    } catch (error) {
      console.error("Lỗi khi đăng sản phẩm:", error.response.data);
      Alert.alert("Lỗi", "Không thể đăng sản phẩm. Vui lòng thử lại.");
    }
  };

  const RadioButton = ({ label, selected, onPress }) => (
    <TouchableOpacity
      style={[styles.radioButton, selected && styles.radioButtonSelected]}
      onPress={onPress}
    >
      <Text
        style={
          selected ? styles.radioButtonTextSelected : styles.radioButtonText
        }
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đăng tin</Text>
          <View style={{ width: 20 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.imagePickerContainer}>
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={() => handleImagePicker("library")}
            >
              <Text>Chọn ảnh từ thư viện</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={() => handleImagePicker("camera")}
            >
              <Text>Chụp ảnh</Text>
            </TouchableOpacity>
          </View>
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.selectedImage} />
          )}

          <TextInput
            style={styles.input}
            placeholder="Tên sản phẩm"
            value={productName}
            onChangeText={setProductName}
          />
          <TextInput
            style={styles.input}
            placeholder="Giá"
            value={formatPrice(price)}
            onChangeText={handlePriceChange}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Số lượng"
            value={storedQuantity}
            onChangeText={handleStoredQuantityChange}
            keyboardType="numeric"
          />
          <Picker
            selectedValue={categoryId}
            onValueChange={setCategoryId}
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
          <View style={styles.radioButtonContainer}>
            <RadioButton
              label="Mới"
              selected={isNew}
              onPress={() => setIsNew(true)}
            />
            <RadioButton
              label="Đã sử dụng"
              selected={!isNew}
              onPress={() => setIsNew(false)}
            />
          </View>
          <View style={styles.radioButtonContainer}>
            <RadioButton
              label="Trao đổi"
              selected={dealType}
              onPress={() => setDealType(true)}
            />
            <RadioButton
              label="Bán"
              selected={!dealType}
              onPress={() => setDealType(false)}
            />
          </View>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Mô tả sản phẩm"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TouchableOpacity
            style={styles.postButton}
            onPress={handlePostProduct}
          >
            <Text style={styles.postButtonText}>Đăng sản phẩm</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
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
  imagePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  imagePickerButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    alignItems: "center",
    marginHorizontal: 4,
  },
  selectedImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 16,
    borderRadius: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
    borderRadius: 4,
  },
  radioButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  radioButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    alignItems: "center",
    marginHorizontal: 4,
  },
  radioButtonSelected: {
    backgroundColor: "#0000ff",
  },
  radioButtonText: {
    color: "#000",
  },
  radioButtonTextSelected: {
    color: "#fff",
  },
  postButton: {
    backgroundColor: "#008000",
    padding: 16,
    borderRadius: 4,
    alignItems: "center",
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PostProduct;
