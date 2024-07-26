import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import AuthContext from "../../../context/AuthProvider";
import {
  createTradingOrderAPI,
  getInfoForCreateTradingOrder,
} from "../../api/tradingOrder";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const ALLOW_TWO_SIDES_DIFFERENT_PERCENT = 90;

function CreateTradingOrder() {
  const navigation = useNavigation();
  const route = useRoute();
  const { auth } = useContext(AuthContext);
  const { productId, sellerId } = route.params;

  const [user1Products, setUser1Products] = useState([]);
  const [user2Products, setUser2Products] = useState([]);
  const [user1SelectedItems, setUser1SelectedItems] = useState([]);
  const [user2SelectedItems, setUser2SelectedItems] = useState([]);
  const [selectedUser1Product, setSelectedUser1Product] = useState(null);
  const [selectedUser2Product, setSelectedUser2Product] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getInfoForCreateTradingOrder(
        auth.token,
        productId
      );
      setUser1Products(response.data.requestSideProducts);
      setUser2Products(response.data.responseSideProducts);
      console.log("Products: ", response.data.requestSideProducts);

      // Automatically add the selected product to user2's items
      const selectedProduct = response.data.responseSideProducts.find(
        (item) => item.productId === parseInt(productId)
      );
      if (selectedProduct) {
        setUser2SelectedItems([{ product: selectedProduct, quantity: 1 }]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const checkStoredQuantity = (productId, quantity, isUser1) => {
    const products = isUser1 ? user1Products : user2Products;
    const product = products.find((p) => p.productId === productId);

    if (product && quantity > product.storedQuantity) {
      Alert.alert("Thông báo", "Số lượng đã đạt đến giới hạn");
      return false;
    }
    return true;
  };

  const updateQuantity = (productId, isUser1, change) => {
    const updatedItems = isUser1
      ? [...user1SelectedItems]
      : [...user2SelectedItems];
    const item = updatedItems.find(
      (item) => item.product.productId === productId
    );
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      if (checkStoredQuantity(productId, newQuantity, isUser1)) {
        item.quantity = newQuantity;
        if (isUser1) {
          setUser1SelectedItems(updatedItems);
        } else {
          setUser2SelectedItems(updatedItems);
        }
      }
    }
  };

  const addProduct = (product, isUser1) => {
    const updatedItems = isUser1
      ? [...user1SelectedItems]
      : [...user2SelectedItems];
    const existingItem = updatedItems.find(
      (item) => item.product.productId === product.productId
    );

    if (existingItem) {
      if (
        checkStoredQuantity(
          product.productId,
          existingItem.quantity + 1,
          isUser1
        )
      ) {
        existingItem.quantity += 1;
      }
    } else {
      if (checkStoredQuantity(product.productId, 1, isUser1)) {
        updatedItems.push({ product, quantity: 1 });
      }
    }

    if (isUser1) {
      setUser1SelectedItems(updatedItems);
    } else {
      setUser2SelectedItems(updatedItems);
    }
  };

  const removeProduct = (productId, isUser1) => {
    const updatedItems = isUser1
      ? user1SelectedItems.filter(
          (item) => item.product.productId !== productId
        )
      : user2SelectedItems.filter(
          (item) => item.product.productId !== productId
        );

    if (isUser1) {
      setUser1SelectedItems(updatedItems);
    } else {
      setUser2SelectedItems(updatedItems);
    }
  };

  const calculateTotal = (items) => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const handleSubmit = async () => {
    const user1Total = calculateTotal(user1SelectedItems);
    const user2Total = calculateTotal(user2SelectedItems);

    if (user1SelectedItems.length === 0 || user2SelectedItems.length === 0) {
      alert("Phải có vật phẩm trao đổi giữa 2 bên.");
      return;
    }

    const difference = Math.abs(user1Total - user2Total);
    const percentDifference =
      (difference / Math.max(user1Total, user2Total)) * 100;

    if (percentDifference > ALLOW_TWO_SIDES_DIFFERENT_PERCENT) {
      alert(
        `Chênh lệch tổng giá trị giao dịch 2 bên không được quá ${ALLOW_TWO_SIDES_DIFFERENT_PERCENT}%.`
      );
      return;
    }

    const tradingOrderData = {
      tradingOrder: {
        userId1: auth.userId,
        userId2: sellerId,
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
        alert("Tạo đơn trao đổi hoàn tất, đang chờ đối phương xét duyệt!");
      } else {
        alert("Tạo đơn thất bại!");
      }
    } catch (error) {
      console.error("Error creating trading order:", error);
      alert(`Tạo đơn thất bại: ${error.message}`);
    }
  };

  const renderSelectedItem = ({ item, isUser1 }) => (
    <View style={styles.selectedItem}>
      <Image
        source={{ uri: item.product.imageLink }}
        style={styles.selectedItemImage}
      />
      <View style={styles.selectedItemInfo}>
        <Text
          style={styles.selectedItemName}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.product.productName}
        </Text>
        <Text style={styles.selectedItemPrice}>
          {item.product.price.toLocaleString()} đ
        </Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => updateQuantity(item.product.productId, isUser1, -1)}
          >
            <FontAwesome5 name="minus-circle" size={18} color="#F44336" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => updateQuantity(item.product.productId, isUser1, 1)}
          >
            <FontAwesome5 name="plus-circle" size={18} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeProduct(item.product.productId, isUser1)}
      >
        <FontAwesome5 name="times-circle" size={20} color="#F44336" />
      </TouchableOpacity>
    </View>
  );

  const ProductPicker = ({
    products,
    selectedProduct,
    onValueChange,
    userLabel,
  }) => (
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerLabel}>{`Chọn sản phẩm ${userLabel}:`}</Text>
      <Picker
        selectedValue={selectedProduct}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        <Picker.Item label="Chọn sản phẩm" value={null} />
        {products.map((product) => (
          <Picker.Item
            key={product.productId}
            label={`${product.productName} - ${product.price.toLocaleString()} đ`}
            value={product}
          />
        ))}
      </Picker>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tạo đơn trao đổi</Text>

      <View style={styles.userSection}>
        <Text style={styles.sectionTitle}>Sản phẩm của bạn</Text>
        <ProductPicker
          products={user1Products}
          selectedProduct={selectedUser1Product}
          onValueChange={(value) => {
            setSelectedUser1Product(value);
            if (value) {
              addProduct(value, true);
            }
          }}
          userLabel="của bạn"
        />
        {user1SelectedItems.map((item) =>
          renderSelectedItem({ item, isUser1: true })
        )}
        <Text style={styles.totalText}>
          Tổng giá trị: {calculateTotal(user1SelectedItems).toLocaleString()} đ
        </Text>
      </View>

      <View style={styles.userSection}>
        <Text style={styles.sectionTitle}>Sản phẩm đối phương</Text>
        <ProductPicker
          products={user2Products}
          selectedProduct={selectedUser2Product}
          onValueChange={(value) => {
            setSelectedUser2Product(value);
            if (value) {
              addProduct(value, false);
            }
          }}
          userLabel="đối phương"
        />
        {user2SelectedItems.map((item) =>
          renderSelectedItem({ item, isUser1: false })
        )}
        <Text style={styles.totalText}>
          Tổng giá trị: {calculateTotal(user2SelectedItems).toLocaleString()} đ
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
        <Text style={styles.buttonText}>Tạo đơn trao đổi</Text>
      </TouchableOpacity>
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
    marginBottom: 24,
    color: "#333",
  },
  userSection: {
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  selectedItemImage: {
    width: 30,
    height: 30,
    borderRadius: 5,
    marginRight: 8,
  },
  selectedItemInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedItemName: {
    fontSize: 12,
    fontWeight: "bold",
    flex: 1,
    marginRight: 4,
  },
  selectedItemPrice: {
    fontSize: 12,
    color: "#666",
    marginRight: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 4,
    paddingHorizontal: 4,
  },
  quantityText: {
    fontSize: 12,
    fontWeight: "bold",
    marginHorizontal: 8,
  },
  removeButton: {
    padding: 4,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    color: "#333",
  },
  noteInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    minHeight: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 8,
  },
});

export default CreateTradingOrder;
