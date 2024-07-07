import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductAPI, getProductByProductIdAPI } from "../../api/product";
import AuthContext from "../../context/AuthProvider";
import { getUserProfileAPI } from "../../api/user";
import { createOrderAPI } from "../../api/order";
import Header from "../../Header";
import Footer from "../../Footer";
import { toast } from "react-toastify";

const fetchData = [
  {
    productId: 1,
    productName: "iPhone 13",
    price: 10000000,
    isNew: true,
    description: "The latest iPhone model with advanced features.",
    seller: {
      fullName: "Dan Thu",
      phoneNumber: "1234567890",
      avarta: "https://zpsocial-f58-org.zadn.vn/e24c0fc754d3b48dedc2.jpg",
    },
    categoryId: 1,
    categoryName: "Đồ điện tử",
    status: 1,
    createdDate: "1 tháng trước",
    categories: [
      {
        categoryId: 1,
        name: "Đồ điện tử",
        imageLink: null,
        iconLink: null,
      },
    ],
    productImages:
      "https://th.bing.com/th/id/OIP.AivK9zFJ7PfalbxQrwDvaQHaGc?rs=1&pid=ImgDetMain",
    storedQuantity: 10,
  },
  {
    productId: 2,
    productName: "Laptop HP Spectre x360",
    price: 16500000,
    isNew: false,
    description: "A versatile and powerful laptop for professionals.",
    seller: {
      fullName: "Dan Thu",
      phoneNumber: "1234567890",
      avarta: "https://zpsocial-f58-org.zadn.vn/e24c0fc754d3b48dedc2.jpg",
    },
    categoryId: 1,
    categoryName: "Đồ điện tử",
    status: 1,
    createdDate: "1 tháng trước",
    categories: [
      {
        categoryId: 1,
        name: "Đồ điện tử",
        imageLink: null,
        iconLink: null,
      },
    ],
    productImages:
      "https://th.bing.com/th/id/OIP.mGba6CDEayK-G5BrQdIgywHaFc?rs=1&pid=ImgDetMain",
    storedQuantity: 5,
  },
  {
    productId: 3,
    productName: "Smart TV Samsung QLED",
    price: 5540000,
    isNew: true,
    description: "Immerse yourself in a stunning visual experience.",
    seller: {
      fullName: "Dan Thu",
      phoneNumber: "1234567890",
      avarta: "https://zpsocial-f58-org.zadn.vn/e24c0fc754d3b48dedc2.jpg",
    },
    categoryId: 1,
    categoryName: "Đồ điện tử",
    status: 1,
    createdDate: "21 ngày trước",
    categories: [
      {
        categoryId: 1,
        name: "Đồ điện tử",
        imageLink: null,
        iconLink: null,
      },
    ],
    productImages:
      "https://th.bing.com/th/id/R.6832579c872dcb0fbe6587ab7b827b18?rik=E5gfeoYKwrUmtw&pid=ImgRaw&r=0",
    storedQuantity: 7,
  },
  {
    productId: 4,
    productName: "Mens Dress Shirt",
    price: 200000,
    isNew: false,
    description: "A stylish and comfortable shirt for formal occasions.",
    seller: {
      fullName: "Quy duc",
      phoneNumber: "0987654321",
      avarta: "https://zpsocial-f43-org.zadn.vn/57f136ac3541d91f8050.jpg",
    },
    categoryId: 6,
    categoryName: "Thời trang",
    status: 1,
    createdDate: "20 ngày trước",
    categories: [
      {
        categoryId: 6,
        name: "Thời trang",
        imageLink: null,
        iconLink: null,
      },
    ],
    productImages:
      "https://th.bing.com/th/id/OIP.eyHjNYJpIui1VJdyHfCzogHaJ4?rs=1&pid=ImgDetMain",
    storedQuantity: 4,
  },
  {
    productId: 5,
    productName: "Womens Summer Dress",
    price: 227000,
    isNew: true,
    description: "Stay cool and fashionable in this lightweight dress.",
    seller: {
      fullName: "Quy duc",
      phoneNumber: "0987654321",
      avarta: "https://zpsocial-f43-org.zadn.vn/57f136ac3541d91f8050.jpg",
    },
    categoryId: 6,
    categoryName: "Thời trang",
    status: 1,
    createdDate: "28 ngày trước",
    categories: [
      {
        categoryId: 6,
        name: "Thời trang",
        imageLink: null,
        iconLink: null,
      },
    ],
    productImages:
      "https://th.bing.com/th/id/OIP.gkRheGEuNAHdSZtvYnEtMAHaNg?rs=1&pid=ImgDetMain",
    storedQuantity: 8,
  },
];

const ALLOW_TWO_SIDES_DIFFERENT_PERCENT = 10;

function CreateTradingOrder() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { productId } = useParams();

  const [products, setProducts] = useState(fetchData);
  const [user1Products, setUser1Products] = useState([]);
  const [user1SelectedItems, setUser1SelectedItems] = useState([]);
  const [user1Total, setUser1Total] = useState(0);

  const [user2Products, setUser2Products] = useState([]);
  const [user2SelectedItems, setUser2SelectedItems] = useState([]);
  const [user2Total, setUser2Total] = useState(0);

  //Effect
  useEffect(()=>{
    //fetchData...
    if(productId){
      const addedItem = user2SelectedItems.find(
        (item) => item.product.productId === productId
      );
    }
    
  },[productId])

  //User1 interact
  const User1AddProduct = (product) => {
    const updatedItems = user1SelectedItems.map((item) => {
      if (item.product.productId === product.productId) {
        if (item.product.storedQuantity === item.quantity) {
          pushErrorToast(
            `Không đủ số lượng sản phẩm trong kho để thêm(Kho: ${item.product.storedQuantity}).`
          );
        } else {
          setUser1Total(user1Total + item.product.price);
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
      }
      return item;
    });
    if (
      !updatedItems.find((item) => item.product.productId === product.productId)
    ) {
      var quantity = 1;
      var newItem = { product, quantity };
      setUser1Total(user1Total + newItem.product.price);
      updatedItems.push(newItem);
    }
    setUser1SelectedItems(updatedItems);
  };
  const User1RemoveItem = (productId) => {
    const removedItem = user1SelectedItems.find(
      (item) => item.product.productId === productId
    );
    setUser1Total(
      user1Total - removedItem.product.price * removedItem.quantity
    );
    const updatedItems = user1SelectedItems.filter(
      (item) => item.product.productId !== productId
    );
    setUser1SelectedItems(updatedItems);
  };
  const User1AddQuantityProduct = (productId) => {
    const updatedItems = user1SelectedItems.map((item) => {
      if (item.product.productId === productId) {
        if (item.product.storedQuantity === item.quantity) {
          pushErrorToast(
            `Không đủ số lượng sản phẩm trong kho để thêm(Kho: ${item.product.storedQuantity}).`
          );
        } else {
          setUser1Total(user1Total + item.product.price);
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
      }
      return item;
    });
    setUser1SelectedItems(updatedItems);
  };
  const User1DecreaseQuantityProduct = (productId) => {
    const updatedItems = user1SelectedItems
      .map((item) => {
        if (item.product.productId === productId) {
          setUser1Total(user1Total - item.product.price);
          if (item.quantity === 1) {
            return null;
          } else {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }
        }
        return item;
      })
      .filter((item) => item);
    setUser1SelectedItems(updatedItems);
  };

  //User2 interact
  const User2AddProduct = (product) => {
    const updatedItems = user2SelectedItems.map((item) => {
      if (item.product.productId === product.productId) {
        if (item.product.storedQuantity === item.quantity) {
          pushErrorToast(
            `Không đủ số lượng sản phẩm trong kho để thêm(Kho: ${item.product.storedQuantity}).`
          );
        } else {
          setUser2Total(user2Total + item.product.price);
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
      }
      return item;
    });
    if (
      !updatedItems.find((item) => item.product.productId === product.productId)
    ) {
      var quantity = 1;
      var newItem = { product, quantity };
      setUser2Total(user2Total + newItem.product.price);
      updatedItems.push(newItem);
    }
    setUser2SelectedItems(updatedItems);
  };
  const User2RemoveItem = (productId) => {
    const removedItem = user2SelectedItems.find(
      (item) => item.product.productId === productId
    );
    setUser2Total(
      user2Total - removedItem.product.price * removedItem.quantity
    );
    const updatedItems = user2SelectedItems.filter(
      (item) => item.product.productId !== productId
    );
    setUser2SelectedItems(updatedItems);
  };
  const User2AddQuantityProduct = (productId) => {
    const updatedItems = user2SelectedItems.map((item) => {
      if (item.product.productId === productId) {
        if (item.product.storedQuantity === item.quantity) {
          pushErrorToast(
            `Không đủ số lượng sản phẩm trong kho để thêm(Kho: ${item.product.storedQuantity}).`
          );
        } else {
          setUser2Total(user2Total + item.product.price);
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
      }
      return item;
    });
    setUser2SelectedItems(updatedItems);
  };
  const User2DecreaseQuantityProduct = (productId) => {
    const updatedItems = user2SelectedItems
      .map((item) => {
        if (item.product.productId === productId) {
          setUser2Total(user2Total - item.product.price);
          if (item.quantity === 1) {
            return null;
          } else {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }
        }
        return item;
      })
      .filter((item) => item);
    setUser2SelectedItems(updatedItems);
  };

  //submit
  const isDifferenceGreaterThan10Percent = (num1, num2) => {
    const difference = Math.abs(num1 - num2);
    const percentDifference = (difference / num1) * 100;
    return percentDifference > ALLOW_TWO_SIDES_DIFFERENT_PERCENT;
  };

  const handleSubmitForm = () => {
    if (user1SelectedItems.length === 0 && user2SelectedItems.length === 0) {
      pushErrorToast(
        `Phải có vật phẩm trao đổi giữa 2 bên ${ALLOW_TWO_SIDES_DIFFERENT_PERCENT}%.`
      );
      return;
    }
    if (isDifferenceGreaterThan10Percent(user1Total, user2Total)) {
      pushErrorToast(
        `Chênh lệch tổng giá trị giao dịch 2 bên không được quá ${ALLOW_TWO_SIDES_DIFFERENT_PERCENT}%.`
      );
      return;
    }
  };

  //checkAlert toast
  const pushErrorToast = (error) => {
    toast.error(error, {
      position: "bottom-right",
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  //format
  const formatPrice = (value) => {
    return value.toLocaleString("vi-VN");
  };

  return (
    <div>
      <Header />
      <section className="create-trading-order spad">
        <div className="container bg-white py-4">
          <div className="row p-3">
            <div className="fs-2 fw-bold text-center">Trao đổi vật phẩm </div>
          </div>
          <div className="row">
            <div className="col-lg-6 col-md-6 p-3">
              <div className="border-bottom border-info border-2  p-3 d-flex">
                <div className="fs-2 text-info px-2">
                  <i className="fa fa-map-marker" aria-hidden="true" />
                </div>
                <div className="ps-2 d-flex">
                  <div>
                    <img
                      className="border border-info border-2 rounded-3 me-3"
                      style={{ maxWidth: "60px", maxHeight: "60px" }}
                      src="https://scontent.fsgn2-5.fna.fbcdn.net/v/t39.30808-1/366338080_1661872127655573_4244859400445488746_n.jpg?stp=dst-jpg_p100x100&_nc_cat=104&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeFkyDqfEFeTPULwxxHUXxPCv4K9-ZaRHge_gr35lpEeByAPVNjH8uCnTR_mdwRVw5aftgXmhv7Oa4j18bayuCWc&_nc_ohc=HSPu2kkrPLsQ7kNvgFrfmjM&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.fsgn2-5.fna&gid=AtForDzVgOcg2lPH0-BWuNh&oh=00_AYBMW_UuXkTxzDhPgWXfmskhPTLDsU7CY1-qQYWq8s445A&oe=668D8975"
                      alt="user1"
                    />
                  </div>
                  <div>
                    <div>
                      <strong> Bên yêu cầu</strong>
                    </div>
                    <div>SKT.T1_Yasuo</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 p-3">
              <div className="border-bottom border-danger border-2  p-3 d-flex justify-content-end">
                <div className="ps-2 d-flex">
                  <div>
                    <img
                      className="border border-danger border-2 rounded-3 me-3"
                      style={{ maxWidth: "60px", maxHeight: "60px" }}
                      src="https://scontent.fsgn2-5.fna.fbcdn.net/v/t39.30808-1/366338080_1661872127655573_4244859400445488746_n.jpg?stp=dst-jpg_p100x100&_nc_cat=104&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeFkyDqfEFeTPULwxxHUXxPCv4K9-ZaRHge_gr35lpEeByAPVNjH8uCnTR_mdwRVw5aftgXmhv7Oa4j18bayuCWc&_nc_ohc=HSPu2kkrPLsQ7kNvgFrfmjM&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.fsgn2-5.fna&gid=AtForDzVgOcg2lPH0-BWuNh&oh=00_AYBMW_UuXkTxzDhPgWXfmskhPTLDsU7CY1-qQYWq8s445A&oe=668D8975"
                      alt="user2"
                    />
                  </div>
                  <div>
                    <div>
                      <strong> Bên tiếp nhận</strong>
                    </div>
                    <div>SKT.T1_Yasuo</div>
                  </div>
                </div>
                <div className="fs-2 text-danger px-3">
                  <i className="fa fa-dot-circle-o" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
          <div className="row px-3 pt-3">
            <div className="row">
              <div className="col-md">
                <div className="dropdown" style={{ width: "60%" }}>
                  <button
                    className="btn btn-secondary dropdown-toggle bg-white text-black w-100 text-left"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    id="inputGroupSelect01"
                  >
                    Thêm sản phẩm
                  </button>
                  <ul className="dropdown-menu w-100">
                    {products?.length > 0 ? (
                      <>
                        {products.map((product) => (
                          <li
                            className="dropdown-item"
                            value="1"
                            key={product.productId}
                            onClick={() => User1AddProduct(product)}
                          >
                            <span className="badge text-bg-primary">
                              {" "}
                              {product.storedQuantity}
                            </span>
                            {"  "}
                            <img
                              style={{
                                maxWidth: "30px",
                                maxHeight: "24px",
                              }}
                              src={`${product.productImages}`}
                              alt="product"
                            />
                            {"  "}
                            {product.productName}
                          </li>
                        ))}
                      </>
                    ) : (
                      <>
                        <li value="">Tất cả</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="mt-3">
                  {user1SelectedItems?.length > 0 ? (
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Sản phẩm</th>
                          <th scope="col">Giá niêm yết</th>
                          <th scope="col">Số lượng</th>
                          <th scope="col">{""}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {user1SelectedItems?.map((item) => (
                          <tr key={item.product.productId}>
                            <td>
                              <div className="product-name">
                                <img
                                  style={{
                                    maxWidth: "30px",
                                    maxHeight: "24px",
                                  }}
                                  src={`${item.product.productImages}`}
                                  alt="product"
                                />
                                {item.product.productName}
                              </div>
                            </td>
                            <td>{formatPrice(item.product.price)}</td>
                            <td>
                              <button
                                className="btn btn-info btn-sm"
                                onClick={() =>
                                  User1DecreaseQuantityProduct(
                                    item.product.productId
                                  )
                                }
                              >
                                -
                              </button>
                              <span className="px-2">{item.quantity} </span>
                              <button
                                className="btn btn-info btn-sm"
                                onClick={() =>
                                  User1AddQuantityProduct(
                                    item.product.productId
                                  )
                                }
                              >
                                +
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() =>
                                  User1RemoveItem(item.product.productId)
                                }
                              >
                                Bỏ
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div
                      className="d-flex align-items-center"
                      style={{ minHeight: "300px" }}
                    >
                      Chưa có sản phẩm nào được chọn!
                    </div>
                  )}
                </div>
              </div>
              {/* user2 */}
              <div className="col-md d-flex  flex-column text-end">
                <div className="d-flex justify-content-end">
                  <div className="dropdown" style={{ width: "60%" }}>
                    <button
                      className="btn btn-secondary dropdown-toggle bg-white text-black w-100 text-left"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      id="inputGroupSelect01"
                    >
                      Thêm sản phẩm
                    </button>
                    <ul className="dropdown-menu w-100">
                      {products?.length > 0 ? (
                        <>
                          {products.map((product) => (
                            <li
                              className="dropdown-item"
                              value="1"
                              key={product.productId}
                              onClick={() => User2AddProduct(product)}
                            >
                              <span className="badge text-bg-primary">
                                {" "}
                                {product.storedQuantity}
                              </span>
                              {"  "}
                              <img
                                style={{
                                  maxWidth: "30px",
                                  maxHeight: "24px",
                                }}
                                src={`${product.productImages}`}
                                alt="product"
                              />
                              {"  "}
                              {product.productName}
                            </li>
                          ))}
                        </>
                      ) : (
                        <>
                          <li value="">Tất cả</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="mt-3">
                  {user2SelectedItems?.length > 0 ? (
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Sản phẩm</th>
                          <th scope="col">Giá niêm yết</th>
                          <th scope="col">Số lượng</th>
                          <th scope="col">{""}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {user2SelectedItems?.map((item) => (
                          <tr key={item.product.productId}>
                            <td>
                              <div className="product-name">
                                <img
                                  style={{
                                    maxWidth: "30px",
                                    maxHeight: "24px",
                                  }}
                                  src={`${item.product.productImages}`}
                                  alt="product"
                                />
                                {item.product.productName}
                              </div>
                            </td>
                            <td>{formatPrice(item.product.price)}</td>
                            <td>
                              <button
                                className="btn btn-info btn-sm"
                                onClick={() =>
                                  User2DecreaseQuantityProduct(
                                    item.product.productId
                                  )
                                }
                              >
                                -
                              </button>
                              <span className="px-2">{item.quantity} </span>
                              <button
                                className="btn btn-info btn-sm"
                                onClick={() =>
                                  User2AddQuantityProduct(
                                    item.product.productId
                                  )
                                }
                              >
                                +
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn btn-danger"
                                onClick={() =>
                                  User2RemoveItem(item.product.productId)
                                }
                              >
                                Bỏ
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div
                      className="d-flex justify-content-end align-items-center"
                      style={{ minHeight: "300px" }}
                    >
                      Chưa có sản phẩm nào được chọn!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 d-flex justify-content-between fs-4 px-4 fw-bold">
            <div className="col-md">
              <span className="text-body-secondary">Tổng giá trị: </span>
              {formatPrice(user1Total)}
              <span className="text-body-secondary"> vnd</span>
            </div>
            <div className="col-md text-end">
              <span className="text-body-secondary">Tổng giá trị: </span>
              {formatPrice(user2Total)}
              <span className="text-body-secondary"> vnd</span>
            </div>
          </div>
          <div className="row  mt-4">
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-warning"
                onClick={() => handleSubmitForm()}
              >
                Tạo hóa đơn
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default CreateTradingOrder;
