import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AuthContext from "../../../context/AuthProvider";
import {
  createTradingOrderAPI,
  getInfoForCreateTradingOrder,
} from "../../api/tradingOrder";

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
  const [note, setNote] = useState("");

  console.log("auth.userId:", auth.userId);
  console.log("Seller:, ", sellerId);

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

  const addProduct = (product, isUser1) => {
    const updatedItems = isUser1
      ? [...user1SelectedItems]
      : [...user2SelectedItems];
    const existingItem = updatedItems.find(
      (item) => item.product.productId === product.productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedItems.push({ product, quantity: 1 });
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
    console.log("Data being sent to createTradingOrderAPI:", tradingOrderData);

    try {
      const response = await createTradingOrderAPI(tradingOrderData);
      console.log("createTradingOrderAPI: ", response);

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

  const renderProductItem = ({ item, isUser1 }) => (
    <View style={styles.productItem}>
      <Text>{item.productName}</Text>
      <Text>Giá: {item.price}</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addProduct(item, isUser1)}
      >
        <Text style={styles.buttonText}>Thêm</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSelectedItem = ({ item, isUser1 }) => (
    <View style={styles.selectedItem}>
      <Text>{item.product.productName}</Text>
      <Text>Số lượng: {item.quantity}</Text>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeProduct(item.product.productId, isUser1)}
      >
        <Text style={styles.buttonText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tạo đơn trao đổi</Text>

      <View style={styles.userSection}>
        <Text style={styles.sectionTitle}>Sản phẩm của bạn</Text>
        <FlatList
          data={user1Products}
          renderItem={({ item }) => renderProductItem({ item, isUser1: true })}
          keyExtractor={(item) => item.productId.toString()}
        />
        <Text style={styles.sectionTitle}>Đã chọn:</Text>
        <FlatList
          data={user1SelectedItems}
          renderItem={({ item }) => renderSelectedItem({ item, isUser1: true })}
          keyExtractor={(item) => item.product.productId.toString()}
        />
        <Text style={styles.totalText}>
          Tổng giá trị: {calculateTotal(user1SelectedItems)}
        </Text>
      </View>

      <View style={styles.userSection}>
        <Text style={styles.sectionTitle}>Sản phẩm đối phương</Text>
        <FlatList
          data={user2Products}
          renderItem={({ item }) => renderProductItem({ item, isUser1: false })}
          keyExtractor={(item) => item.productId.toString()}
        />
        <Text style={styles.sectionTitle}>Đã chọn:</Text>
        <FlatList
          data={user2SelectedItems}
          renderItem={({ item }) =>
            renderSelectedItem({ item, isUser1: false })
          }
          keyExtractor={(item) => item.product.productId.toString()}
        />
        <Text style={styles.totalText}>
          Tổng giá trị: {calculateTotal(user2SelectedItems)}
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  userSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  selectedItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 8,
    borderRadius: 4,
  },
  removeButton: {
    backgroundColor: "#F44336",
    padding: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: "#2196F3",
    padding: 16,
    borderRadius: 4,
    alignItems: "center",
  },
});

export default CreateTradingOrder;
