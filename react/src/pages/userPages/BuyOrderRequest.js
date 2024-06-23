import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import {
  acceptBuyRequestOrdersAPI,
  denyBuyRequestOrdersAPI,
  getMySellOrdersRequestAPI,
  getSellOrdersAPI,
} from "../../api/order";
import Header from "../../Header";
import Footer from "../../Footer";

function BuyOrderRequest() {
  const [orders, setOrder] = useState([]);
  const { auth } = useContext(AuthContext);

  const fetchOrder = async () => {
    try {
      var response = await getMySellOrdersRequestAPI(auth.accessToken);
      setOrder(response);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };
  useEffect(() => {
    fetchOrder();
  }, []);

  const handleAcceptOrder = async (productId) => {
    try {
      await acceptBuyRequestOrdersAPI(auth.accessToken, productId);
      fetchOrder();
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  const handleDenyOrder = async (productId) => {
    try {
      await denyBuyRequestOrdersAPI(auth.accessToken, productId);
      fetchOrder();
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  const formatPrice = (value) => {
    return value.toLocaleString('vi-VN');
  };

  function removeTimeFromISOString(isoString) {
    const index = isoString.indexOf("T");
    if (index !== -1) {
      return isoString.slice(0, index);
    }
    return isoString;
  }



  return (
    <div>
      <Header />
      <section className="buy_order spad">
        <div className="container bg-white px-1 py-3">
          <div className="product_container px-4 py-2">
            <h3 className="mb-4 pb-2 fw-bold">Yêu cầu mua hàng</h3>
            {orders?.length !== 0 ? (
              <div className="d-flex justify-content-center">
                <div className="col-lg-3">
                  <div className="fs-4">Bộ lọc</div>
                  <select
                    class="form-select form-select-lg mb-3"
                    aria-label="Large select example"
                  >
                    <option selected>Mới nhất</option>
                    <option value="1">Giá cao nhất</option>
                    <option value="2">Rating cao nhất</option>
                  </select>
                  <div className="fs-4">Theo sản phẩm</div>
                  <select
                    class="form-select form-select-lg mb-3"
                    aria-label="Large select example"
                  >
                    <option selected>Tất cả</option>
                    <option value="1">Sản phẩm A</option>
                    <option value="2">Sản phẩm B</option>
                    <option value="3">Sản phẩm C</option>

                  </select>
                </div>
                <div className="col-lg-9 ps-4">
                  {orders?.map((order) => (
                    <div
                      key={order.order?.orderId}
                      className="row mb-3 p-2 order"
                    >
                      <div className="col-12 border-bottom ps-2 py-2">
                        <span className="fs-5">
                          <img style={{borderRadius:"20px"}} src={order.buyer.avarta} width={"30px"}/> {" "}
                          {order.buyer.name}
                        </span>
                      </div>
                      <div className="col-9 col-md-9 pt-3">
                        <div className="row">
                          <div className="col-lg-3 w-25 product_image">
                            <img src={order.product.imageLink} alt="" />
                            {/* //order.productImage */}
                          </div>
                          <div className="col-lg-9">
                            <a href="" className="name">
                              {order.product?.productName}
                            </a>
                            <div className="price text-secondary">
                              {formatPrice(order.product?.productPrice)} đ
                            </div>
                            <div className="address">
                              {order.order?.receiverAddress}
                            </div>
                            <div className="">
                              {order.order?.status === 0 ? (
                                <div className="d-flex justify-content-center mt-2">
                                  <button
                                    className="btn btn-info mx-3"
                                    onClick={() =>
                                      handleAcceptOrder(order.order?.orderId)
                                    }
                                  >
                                    Xác nhận đơn hàng
                                  </button>
                                  <button
                                    className="btn btn-danger mx-3 "
                                    onClick={() =>
                                      handleDenyOrder(order.order?.orderId)
                                    }
                                  >
                                    Hủy đơn hàng
                                  </button>
                                </div>
                              ) : order.order?.status === 1 ? (
                                <div className="d-flex justify-content-center mt-2">
                                  <button className="btn btn-success mx-3">
                                    Đã xác nhận đơn hàng
                                  </button>
                                </div>
                              ) : (
                                <div className="d-flex justify-content-center mt-2">
                                  <button className="btn btn-danger mx-3">
                                    Đã hủy đơn hàng
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-3 col-md-3 pt-3 order_info">
                        <div>
                          Số lượng: <span>{order.order?.quantity}</span>
                        </div>
                        <div className="fw-bold">
                          Giá mong muốn: <span className="text-danger fw-bold">{ formatPrice(order.order?.price)} đ</span>
                        </div>
                        <div>
                          Phương thức thanh toán:{" "}
                          <span>{order.order?.paymentMethod}</span>
                        </div>
                        <div>
                          Ngày giao dịch: <div>{ removeTimeFromISOString( order.order?.orderDate)}</div>
                        </div>
                        <div className="d-flex justify-content-center mt-2">
                          <button className="btn btn-warning">
                            Xem Feedback
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="not-found-text fs-3">
                Bạn vẫn chưa có đơn bán nào
              </div>
            )}
            ;
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default BuyOrderRequest;
