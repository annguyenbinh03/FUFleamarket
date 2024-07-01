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
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { imageDb } from "../../FirebaseImage/Config";

const PostProduct = () => {
  const navigation = useNavigation();
  const { auth } = useContext(AuthContext);

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(1);
  const [isNew, setIsNew] = useState(true);
  const [imageUri, setImageUri] = useState(null);
  const [storedQuantity, setStoredQuantity] = useState("");

  const handleImagePicker = async (sourceType) => {
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

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    console.log("Uploading image...");
    if (!imageUri) {
      console.log("No image to upload.");
      return "";
    }

    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const imageName = `productImages/${Date.now()}-${Math.random().toString(36).substring(7)}`;
      const imageRef = ref(imageDb, imageName);
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      return "";
    }
  };

  const handlePostProduct = async () => {
    console.log("Posting product...");

    if (
      !productName ||
      !price ||
      !description ||
      !categoryId ||
      !imageUri ||
      !storedQuantity
    ) {
      Alert.alert(
        "Thông báo",
        "Vui lòng điền đầy đủ thông tin sản phẩm và chọn ảnh."
      );
      return;
    }

    const imageUrl = await uploadImage();

    if (!imageUrl) {
      Alert.alert("Lỗi", "Không thể tải lên hình ảnh. Vui lòng thử lại.");
      return;
    }

    const productData = {
      productName,
      price: parseFloat(price),
      description,
      categoryId,
      isNew,
      imageLink: imageUrl,
      storedQuantity: parseInt(storedQuantity),
    };

    try {
      const response = await axios.post(
        "http://192.168.146.25:7057/api/product/createproductforsellers",
        productData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          "Thành công",
          "Sản phẩm đã được đăng và đang chờ admin duyệt."
        );
        setProductName("");
        setPrice("");
        setDescription("");
        setCategoryId(1);
        setIsNew(true);
        setImageUri(null);
        setStoredQuantity("");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error posting product:", error);
      Alert.alert("Lỗi", "Không thể đăng sản phẩm. Vui lòng thử lại sau.");
    }
  };

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
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Số lượng"
            value={storedQuantity}
            onChangeText={setStoredQuantity}
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
            <TouchableOpacity
              style={[styles.radioButton, isNew && styles.radioButtonSelected]}
              onPress={() => setIsNew(true)}
            >
              <Text
                style={
                  isNew
                    ? styles.radioButtonTextSelected
                    : styles.radioButtonText
                }
              >
                Mới
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioButton, !isNew && styles.radioButtonSelected]}
              onPress={() => setIsNew(false)}
            >
              <Text
                style={
                  !isNew
                    ? styles.radioButtonTextSelected
                    : styles.radioButtonText
                }
              >
                Đã sử dụng
              </Text>
            </TouchableOpacity>
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
    backgroundColor: "#DD0000",
  },
  radioButtonText: {
    color: "#000",
  },
  radioButtonTextSelected: {
    color: "#fff",
  },
  postButton: {
    backgroundColor: "#DD0000",
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
