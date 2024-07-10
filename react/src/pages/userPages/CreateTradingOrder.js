import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import Header from "../../Header";
import Footer from "../../Footer";
import { toast } from "react-toastify";
import { getInfoForCreateTradingOrder } from "../../api/tradingOrder";

const ALLOW_TWO_SIDES_DIFFERENT_PERCENT = 10;

function CreateTradingOrder() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { productId } = useParams();

  const [user1Info, setUser1Info] = useState();
  const [user1Products, setUser1Products] = useState([]);
  const [user1SelectedItems, setUser1SelectedItems] = useState([]);
  const [user1Total, setUser1Total] = useState(0);

  const [user2Info, setUser2Info] = useState();
  const [user2Products, setUser2Products] = useState([]);
  const [user2SelectedItems, setUser2SelectedItems] = useState([]);
  const [user2Total, setUser2Total] = useState(0);

  const fetchDataTest = async () =>{
    try {
      console.log('ProductID: ' + productId);
        const response = await getInfoForCreateTradingOrder(auth.accessToken, productId);
        console.log(response);
        setUser1Info(response.requestSide);
        setUser2Info(response.responseSide);
        setUser1Products(response.requestSideProducts);
        setUser2Products(response.responseSideProducts);
    } catch (error) {
      console.log(error)
    }
  }
  //Effect
  useEffect(()=>{
    if(productId){
      const addedItem = user2SelectedItems.find(
        (item) => item.product.productId === productId
      );
      fetchDataTest();
    }
  },[])

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
      setUser1Total( user1Total + newItem.product.price);
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
                      src={user1Info?.avarta}
                      alt="user1"
                    />
                  </div>
                  <div>
                    <div>
                      <strong> Bên yêu cầu</strong>
                    </div>
                    <div>{user1Info?.fullName}</div>
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
                      src={user2Info?.avarta}
                      alt="user2"
                    />
                  </div>
                  <div>
                    <div>
                      <strong> Bên tiếp nhận</strong>
                    </div>
                    <div>{user2Info?.fullName}</div>
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
                    {user1Products?.length > 0 ? (
                      <>
                        {user1Products.map((product) => (
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
                              src={`${product.imageLink}`}
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
                                  src={`${item.product.imageLink}`}
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
                      {user2Products?.length > 0 ? (
                        <>
                          {user2Products.map((product) => (
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
                                src={`${product.imageLink}`}
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
                          <th className="text-start" scope="col">Sản phẩm</th>
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
                                  src={`${item.product.imageLink}`}
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
