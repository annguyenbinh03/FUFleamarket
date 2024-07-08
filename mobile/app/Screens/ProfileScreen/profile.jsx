import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AuthContext from "../../../context/AuthProvider";
import { useNavigation, CommonActions } from "@react-navigation/native";
import LogoutButton from "../../../components/LogoutButton";
import WishListButton from "../../../components/WishListButton";
import BuyOrderButton from "../../../components/BuyOrderButton";
import SellOrderButton from "../../../components/SellOrderButton";
import { getShopProfileAPI, editUserProfileAPI } from "../../api/user_api";
import * as ImagePicker from "expo-image-picker";
import { formatDate } from "../../../utils/formatDate";

const Profile = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (!auth || !auth.token) {
      redirectToLogin();
    } else {
      fetchUserInfo();
    }
  }, [auth]);

  const fetchUserInfo = async () => {
    try {
      const response = await getShopProfileAPI(auth.userId);
      setUserInfo(response.data.user);
      setEditedInfo(response.data.user);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user info:", error);
      setLoading(false);
    }
  };

  const redirectToLogin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Login" }],
      })
    );
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      const updatedInfo = {
        ...editedInfo,
        password: newPassword ? newPassword : undefined,
      };
      const response = await editUserProfileAPI(auth.token, updatedInfo);
      if (response.status === 200) {
        setUserInfo(updatedInfo);
        setIsEditing(false);
        setNewPassword("");
        Alert.alert("Thành công", "Profile đã được chỉnh sửa");
      } else {
        Alert.alert("Lỗi", "Chỉnh sửa profile thất bại");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Lỗi", "Có lỗi trong quá trình chỉnh sửa profile");
    }
  };

  const handleCancel = () => {
    setEditedInfo(userInfo);
    setIsEditing(false);
    setNewPassword("");
  };

  const handleChangeAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setEditedInfo({ ...editedInfo, avarta: result.uri });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DD0000" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tài khoản</Text>
        {isEditing ? (
          <View style={styles.editButtons}>
            <TouchableOpacity onPress={handleSave} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={handleEdit}>
            <FontAwesome5 name="edit" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={isEditing ? handleChangeAvatar : null}>
          <Image
            source={{ uri: isEditing ? editedInfo.avarta : userInfo.avarta }}
            style={styles.avatar}
          />
        </TouchableOpacity>
        {isEditing ? (
          <TextInput
            style={styles.editName}
            value={editedInfo.fullName}
            onChangeText={(text) =>
              setEditedInfo({ ...editedInfo, fullName: text })
            }
          />
        ) : (
          <Text style={styles.name}>{userInfo.fullName}</Text>
        )}
      </View>

      <View style={styles.infoSection}>
        <InfoItem icon="envelope" text={userInfo.email} editable={false} />
        <InfoItem
          icon="phone"
          text={isEditing ? editedInfo.phoneNumber : userInfo.phoneNumber}
          editable={isEditing}
          onChangeText={(text) =>
            setEditedInfo({ ...editedInfo, phoneNumber: text })
          }
        />
        <InfoItem
          icon="map-marker-alt"
          text={
            isEditing
              ? editedInfo.addresses[0].specificAddress
              : userInfo.addresses[0].specificAddress
          }
          editable={isEditing}
          onChangeText={(text) =>
            setEditedInfo({
              ...editedInfo,
              addresses: [
                { ...editedInfo.addresses[0], specificAddress: text },
              ],
            })
          }
        />
        <InfoItem
          icon="info-circle"
          text={isEditing ? editedInfo.introduction : userInfo.introduction}
          editable={isEditing}
          onChangeText={(text) =>
            setEditedInfo({ ...editedInfo, introduction: text })
          }
        />
        {isEditing && (
          <InfoItem
            icon="lock"
            text={newPassword}
            editable={true}
            onChangeText={setNewPassword}
            secureTextEntry={true}
            placeholder="Nhập mật khẩu mới"
          />
        )}
        <InfoItem
          icon="calendar-check"
          text={`Đã tham gia: ${formatDate(userInfo.createdDate)}`}
          editable={false}
        />
        <InfoItem
          icon="star"
          text={`Đánh giá bán: ${userInfo.sellRating}`}
          editable={false}
        />
        <InfoItem
          icon="shopping-bag"
          text={`Đánh giá mua: ${userInfo.buyRating}`}
          editable={false}
        />
      </View>

      <View style={styles.buttonContainer}>
        <WishListButton />
        <BuyOrderButton />
        <SellOrderButton />
        <LogoutButton />
      </View>
    </ScrollView>
  );
};

const InfoItem = ({
  icon,
  text,
  editable,
  onChangeText,
  secureTextEntry,
  placeholder,
}) => (
  <View style={styles.infoItem}>
    <FontAwesome5 name={icon} size={20} color="#DD0000" style={styles.icon} />
    {editable ? (
      <TextInput
        style={styles.editInfoText}
        value={text}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
      />
    ) : (
      <Text style={styles.infoText}>{text}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
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
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  infoSection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  icon: {
    marginRight: 15,
    width: 20,
    textAlign: "center",
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  editButtons: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 10,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  editName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DD0000",
  },
  editInfoText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#DD0000",
  },
  buttonContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
});

export default Profile;
