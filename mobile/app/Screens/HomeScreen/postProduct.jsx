import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { StatusBar } from "expo-status-bar";
import { images } from "../../../constants";
import SearchInput from "../../../components/SearchInput";
import { Picker } from "@react-native-picker/picker";
import ImagePicker from "react-native-image-picker";
import { launchImageLibrary } from "react-native-image-picker";

const PostProduct = () => {
  const navigation = useNavigation();

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [isNew, setIsNew] = useState(false);

  const [imageUri, setImageUri] = useState(null);

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#161622" style="light" />
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đăng tin</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Product Image Area */}
          <View style={styles.productImageArea}>
            <Text style={styles.productImageTitle}>Hình ảnh về sản phẩm</Text>
            <Text style={styles.productImageInfo}>
              Xem thêm về{" "}
              <Text style={styles.productImageLink}>
                Quy định đăng tin của FUFM
              </Text>
            </Text>
            <View style={styles.fileUploader}>
              <View style={styles.uploaderHeader}>
                <Text style={styles.uploaderTitle}>Tải ảnh lên</Text>
                <Text style={styles.fileCompletedStatus}> </Text>
              </View>
              <TouchableOpacity
                style={styles.fileUploadBox}
                onPress={handleImagePicker}
              >
                <Text style={styles.boxTitle}>
                  <Text style={styles.fileInstruction}>Drag files here or</Text>
                  <Text style={styles.fileBrowseButton}> browse</Text>
                </Text>
              </TouchableOpacity>
              {imageUri && (
                <Image
                  source={{ uri: imageUri }}
                  style={styles.uploadedImage}
                />
              )}
            </View>
          </View>

          {/* Product Detail Area */}
          <View style={styles.productDetailArea}>
            <Text style={styles.productDetailTitle}>Thông tin chi tiết</Text>

            {/* Category Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputGroupLabel}>Danh mục tin đăng</Text>
              <Picker
                selectedValue={categoryId}
                onValueChange={(itemValue) => setCategoryId(itemValue)}
                style={styles.formSelect}
              >
                <Picker.Item label="Đồ điện tử" value="1" />
                <Picker.Item label="Đồ dùng học tập" value="2" />
                <Picker.Item label="Điện lạnh" value="3" />
                <Picker.Item label="Đồ gia dụng, nội thất" value="4" />
                <Picker.Item label="Đồ ăn, thực phẩm" value="5" />
                <Picker.Item label="Thời trang" value="6" />
                <Picker.Item label="Giải trí, thể thao, sở thích" value="7" />
              </Picker>
            </View>

            {/* Product Condition Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputGroupLabel}>Tình trạng sản phẩm</Text>
              <Picker
                selectedValue={isNew}
                onValueChange={(itemValue) => setIsNew(itemValue)}
                style={styles.formSelect}
              >
                <Picker.Item label="Mới" value={true} />
                <Picker.Item label="Cũ" value={false} />
              </Picker>
            </View>

            {/* Product Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputGroupLabel}>Tên sản phẩm</Text>
              <TextInput
                style={styles.formControl}
                placeholder="Tên sản phẩm"
                value={productName}
                onChangeText={(text) => setProductName(text)}
              />
            </View>

            {/* Price Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputGroupLabel}>Giá bán</Text>
              <TextInput
                style={styles.formControl}
                placeholder="Giá (vnd)"
                keyboardType="numeric"
                value={price}
                onChangeText={(text) => setPrice(text)}
              />
            </View>

            {/* Description Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputGroupLabel}>Mô tả chi tiết</Text>
              <TextInput
                style={[styles.formControl, styles.textArea]}
                multiline
                numberOfLines={10}
                placeholder={`- Xuất xứ, tình trạng chiếc điện thoại
- Thời gian sử dụng
- Bảo hành nếu có
- Sửa chữa, nâng cấp, phụ kiện đi kèm
- Chấp nhận thanh toán/ vận chuyển qua Chợ Tốt
- Chính sách bảo hành, bảo trì, đổi trả hàng hóa/sản phẩm
- Địa chỉ giao nhận, đổi trả hàng hóa/sản phẩm`}
                value={description}
                onChangeText={(text) => setDescription(text)}
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Xem trước</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Đăng tin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PostProduct;

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
    paddingVertical: 10,
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
  productImageArea: {
    marginBottom: 20,
  },
  productImageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productImageInfo: {
    marginBottom: 12,
  },
  productImageLink: {
    color: "#DD0000",
  },
  fileUploader: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
  },
  uploaderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  uploaderTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  fileCompletedStatus: {
    color: "#555",
  },
  fileUploadBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  boxTitle: {
    textAlign: "center",
  },
  fileInstruction: {
    fontSize: 14,
  },
  fileBrowseButton: {
    color: "#DD0000",
    fontSize: 14,
    fontWeight: "bold",
  },
  productDetailArea: {
    marginBottom: 20,
  },
  productDetailTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputGroupLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  formSelect: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    height: 48,
  },
  formControl: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    height: 48,
  },
  textArea: {
    height: 120,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#FFA500",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "48%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
