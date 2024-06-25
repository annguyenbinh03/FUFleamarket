import React, { useState, useEffect, useContext } from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
import AuthContext from "../context/AuthProvider";

const WishListAddButton = ({ productId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    checkIfFavorite();
  }, [productId, auth]);

  const checkIfFavorite = async () => {
    if (auth && productId) {
      try {
        const response = await axios.get(
          `http://192.168.146.25:7057/api/Wishlist/user/${auth.id}/product/${productId}`
        );
        setIsFavorite(response.data);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    }
  };

  const handleSaveProduct = async () => {
    if (!auth) {
      Alert.alert("Thông báo", "Vui lòng đăng nhập để lưu sản phẩm.");
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(
          `http://192.168.146.25:7057/api/Wishlist/${auth.id}/${productId}`
        );
        setIsFavorite(false);
        Alert.alert(
          "Thông báo",
          "Sản phẩm đã được xóa khỏi danh sách yêu thích."
        );
      } else {
        await axios.post("http://192.168.146.25:7057/api/Wishlist", {
          userId: auth.id,
          productId: productId,
        });
        setIsFavorite(true);
        Alert.alert(
          "Thông báo",
          "Sản phẩm đã được lưu vào danh sách yêu thích thành công."
        );
      }
    } catch (error) {
      console.error("Error saving product:", error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi lưu sản phẩm.");
    }
  };

  return (
    <TouchableOpacity
      onPress={handleSaveProduct}
      style={[styles.saveButton, isFavorite && styles.savedButton]}
    >
      <FontAwesome5
        name="heart"
        size={20}
        color={isFavorite ? "#fff" : "#DD0000"}
      />
      <Text
        style={[styles.saveButtonText, isFavorite && styles.savedButtonText]}
      >
        {isFavorite ? "Đã lưu" : "Lưu tin"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DD0000",
  },
  savedButton: {
    backgroundColor: "#DD0000",
  },
  saveButtonText: {
    marginLeft: 5,
    color: "#DD0000",
  },
  savedButtonText: {
    color: "#fff",
  },
});

export default WishListAddButton;
