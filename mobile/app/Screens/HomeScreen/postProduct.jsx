import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React from "react";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import { images } from "../../../constants";
import SearchInput from "../../../components/SearchInput";
import { Picker } from "@react-native-picker/picker";

const PostProduct = () => {
  const navigation = useNavigation();

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [isNew, setIsNew] = useState(false);
  return (
    <View>
      <ScrollView style={styles.container}>
        <StatusBar backgroundColor="#161622" style="light" />
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Image source={images.logo} style={styles.logoImage} />
            <View style={styles.searchContainer}>
              <SearchInput style={styles.searcInput} />
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => console.log("Bell")}
              >
                <FontAwesome5 name="bell" size={20} color="#111111" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => console.log("Message")}
              >
                <FontAwesome5 name="comments" size={20} color="#111111" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

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
              <View style={styles.fileUploadBox}>
                <Text style={styles.boxTitle}>
                  <Text style={styles.fileInstruction}>Drag files here or</Text>
                  <Text style={styles.fileBrowseButton}>browse</Text>
                </Text>
              </View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between", // Align logo and icons
    alignItems: "center",
    padding: 15,
    backgroundColor: "#DD0000",
    width: "100%",
  },
  logo: {
    alignItems: "center",
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    marginLeft: 10, // Add space between icons
  },
  content: {
    padding: 20,
  },
  // ... (rest of your existing styles)

  // Reusable Styles
  inputGroup: {
    marginBottom: 15,
  },
  inputGroupLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  formSelect: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
  },
  formControl: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    height: 40,
  },
  textArea: {
    height: 100,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#FFA500",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "48%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
