import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import AuthContext from "../../../context/AuthProvider";
import {
  createTradingOrderAPI,
  getInfoForCreateTradingOrder,
} from "../../api/tradingOrder";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const ALLOW_TWO_SIDES_DIFFERENT_PERCENT = 90;

function CreateTradingOrder({ route, navigation }) {
  const { auth, setAuth } = useContext(AuthContext);
  const { productId } = route.params;

  const [user1Info, setUser1Info] = useState({});
  const [user2Info, setUser2Info] = useState({});
  const [user1Products, setUser1Products] = useState([]);
  const [user2Products, setUser2Products] = useState([]);
  const [user1SelectedItems, setUser1SelectedItems] = useState([]);
  const [user2SelectedItems, setUser2SelectedItems] = useState([]);
  const [user1Total, setUser1Total] = useState(0);
  const [user2Total, setUser2Total] = useState(0);
  const [note, setNote] = useState("");
  const [user1DropdownVisible, setUser1DropdownVisible] = useState(false);
  const [user2DropdownVisible, setUser2DropdownVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getInfoForCreateTradingOrder(
        auth.token,
        productId
      );
      if (response.data) {
        setUser1Info(response.data.requestSide || {});
        setUser2Info(response.data.responseSide || {});
        setUser1Products(response.data.requestSideProducts || []);
        setUser2Products(response.data.responseSideProducts || []);

        if (
          response.data.responseSideProducts &&
          Array.isArray(response.data.responseSideProducts)
        ) {
          const addedItem = response.data.responseSideProducts.find(
            (item) => parseInt(item.productId) === parseInt(productId)
          );
          if (addedItem) addProduct(addedItem, 2);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response && error.response.status === 401) {
        Alert.alert("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại.");
        setAuth(null);
        navigation.navigate("Login");
      } else {
        Alert.alert("Lỗi", "Không thể tải thông tin. Vui lòng thử lại sau.");
      }
    }
  };

  const addProduct = (product, userSide) => {
    const selectedItems =
      userSide === 1 ? user1SelectedItems : user2SelectedItems;
    const setSelectedItems =
      userSide === 1 ? setUser1SelectedItems : setUser2SelectedItems;
    const total = userSide === 1 ? user1Total : user2Total;
    const setTotal = userSide === 1 ? setUser1Total : setUser2Total;

    const existingItem = selectedItems.find(
      (item) => item.product.productId === product.productId
    );
    if (existingItem) {
      if (existingItem.quantity < product.storedQuantity) {
        setTotal(total + product.price);
        setSelectedItems(
          selectedItems.map((item) =>
            item.product.productId === product.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      }
    } else {
      setTotal(total + product.price);
      setSelectedItems([...selectedItems, { product, quantity: 1 }]);
    }
  };

  const removeProduct = (productId, userSide) => {
    const selectedItems =
      userSide === 1 ? user1SelectedItems : user2SelectedItems;
    const setSelectedItems =
      userSide === 1 ? setUser1SelectedItems : setUser2SelectedItems;
    const setTotal = userSide === 1 ? setUser1Total : setUser2Total;

    const removedItem = selectedItems.find(
      (item) => item.product.productId === productId
    );
    setTotal(
      (prevTotal) =>
        prevTotal - removedItem.product.price * removedItem.quantity
    );
    setSelectedItems(
      selectedItems.filter((item) => item.product.productId !== productId)
    );
  };

  const handleSubmit = async () => {
    if (user1SelectedItems.length === 0 || user2SelectedItems.length === 0) {
      Alert.alert("Lỗi", "Phải có vật phẩm trao đổi giữa 2 bên.");
      return;
    }
    if (
      (Math.abs(user1Total - user2Total) / Math.max(user1Total, user2Total)) *
        100 >
      ALLOW_TWO_SIDES_DIFFERENT_PERCENT
    ) {
      Alert.alert(
        "Lỗi",
        `Chênh lệch tổng giá trị giao dịch 2 bên không được quá ${ALLOW_TWO_SIDES_DIFFERENT_PERCENT}%.`
      );
      return;
    }

    const tradingOrderData = {
      tradingOrder: {
        userId1: auth.id,
        userId2: user2Info.userId,
        note: note,
      },
      user1Product: user1SelectedItems.map((item) => ({
        productId: item.product.productId,
        quantity: item.quantity,
      })),
      user2Product: user2SelectedItems.map((item) => ({
        productId: item.product.productId,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await createTradingOrderAPI(tradingOrderData);
      if (response) {
        Alert.alert(
          "Thành công",
          "Tạo đơn trao đổi hoàn tất, đang chờ đối phương xét duyệt!"
        );
        navigation.navigate("TabNavigation");
      }
    } catch (error) {
      console.error("Error tạo đơn trao đổi: ", error);
      console.error("Error tạo đơn trao đổi: ", error.response);
      Alert.alert("Lỗi", "Tạo đơn thất bại!");
    }
  };

  const renderItem = ({ item, userSide }) => (
    <View style={styles.productItem}>
      <Image
        source={{ uri: item.product.imageLink }}
        style={styles.productImage}
      />
      <Text style={styles.productName}>{item.product.productName}</Text>
      <Text style={styles.productPrice}>
        {item.product.price.toLocaleString("vi-VN")} VND
      </Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          onPress={() => removeProduct(item.product.productId, userSide)}
        >
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => addProduct(item.product, userSide)}>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Trao đổi vật phẩm</Text>

      <View style={styles.userInfoContainer}>
        <View style={styles.userInfo}>
          <Image source={{ uri: user1Info.avarta }} style={styles.avatar} />
          <Text style={styles.userName}>{user1Info.fullName}</Text>
        </View>
        <View style={styles.userInfo}>
          <Image source={{ uri: user2Info.avarta }} style={styles.avatar} />
          <Text style={styles.userName}>{user2Info.fullName}</Text>
        </View>
      </View>

      <View style={styles.productsContainer}>
        <View style={styles.userProductsContainer}>
          <Text style={styles.sectionTitle}>Bên yêu cầu</Text>
          <TouchableOpacity
            style={styles.addProductButton}
            onPress={() => setUser1DropdownVisible(true)}
          >
            <Text style={styles.addProductButtonText}>Thêm sản phẩm</Text>
          </TouchableOpacity>
          <FlatList
            data={user1SelectedItems}
            renderItem={({ item }) => renderItem({ item, userSide: 1 })}
            keyExtractor={(item) => item.product.productId.toString()}
          />
        </View>

        <View style={styles.userProductsContainer}>
          <Text style={styles.sectionTitle}>Bên tiếp nhận</Text>
          <TouchableOpacity
            style={styles.addProductButton}
            onPress={() => setUser2DropdownVisible(true)}
          >
            <Text style={styles.addProductButtonText}>Thêm sản phẩm</Text>
          </TouchableOpacity>
          <FlatList
            data={user2SelectedItems}
            renderItem={({ item }) => renderItem({ item, userSide: 2 })}
            keyExtractor={(item) => item.product.productId.toString()}
          />
        </View>
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Tổng giá trị bên yêu cầu: {user1Total.toLocaleString("vi-VN")} VND
        </Text>
        <Text style={styles.totalText}>
          Tổng giá trị bên tiếp nhận: {user2Total.toLocaleString("vi-VN")} VND
        </Text>
      </View>

      <TextInput
        style={styles.noteInput}
        placeholder="Ghi chú..."
        value={note}
        onChangeText={setNote}
        multiline
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <FontAwesome5 name="exchange-alt" size={20} color="#fff" />
        <Text style={styles.submitButtonText}>Tạo hóa đơn trao đổi</Text>
      </TouchableOpacity>

      <Modal
        visible={user1DropdownVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <FlatList
            data={user1Products}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  addProduct(item, 1);
                  setUser1DropdownVisible(false);
                }}
              >
                <Image
                  source={{ uri: item.imageLink }}
                  style={styles.modalItemImage}
                />
                <Text style={styles.modalItemText}>{item.productName}</Text>
                <Text style={styles.modalItemQuantity}>
                  SL: {item.storedQuantity}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.productId.toString()}
          />
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => setUser1DropdownVisible(false)}
          >
            <Text style={styles.closeModalButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        visible={user2DropdownVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <FlatList
            data={user2Products}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  addProduct(item, 2);
                  setUser2DropdownVisible(false);
                }}
              >
                <Image
                  source={{ uri: item.imageLink }}
                  style={styles.modalItemImage}
                />
                <Text style={styles.modalItemText}>{item.productName}</Text>
                <Text style={styles.modalItemQuantity}>
                  SL: {item.storedQuantity}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.productId.toString()}
          />
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => setUser2DropdownVisible(false)}
          >
            <Text style={styles.closeModalButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  userInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  userInfo: {
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userName: {
    marginTop: 8,
    fontSize: 16,
  },
  productsContainer: {
    flexDirection: "column",
  },
  userProductsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  addProductButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  addProductButtonText: {
    color: "white",
    textAlign: "center",
  },
  productItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  productImage: {
    width: "100%",
    height: 200,
    borderRadius: 4,
    marginBottom: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 14,
    color: "#888",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  quantityButton: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 12,
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  totalContainer: {
    marginTop: 16,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noteInput: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    minHeight: 80,
  },
  submitButton: {
    backgroundColor: "#DD0000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 5,
    marginTop: 16,
  },
  submitButtonText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CreateTradingOrder;
