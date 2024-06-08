import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import {
  acceptBuyRequestOrdersAPI,
  denyBuyRequestOrdersAPI,
  getSellOrdersAPI,
} from "../../api/order";
import Header from "../../Header";
import Footer from "../../Footer";

function SellOrder() {
  const [orders, setOrder] = useState([]);
  const { auth } = useContext(AuthContext);

  const fetchOrder = async () => {
    try {
      var response = await getSellOrdersAPI(auth.accessToken);
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

  return (
    <div>
      <Header />
      <section className="buy_order spad">
        <div className="container bg-white px-5 py-3">
          <div className="product_container px-4 py-2">
            <h3 className="mb-4 pb-2 fw-bold">Đơn bán của tôi</h3>
            {orders?.length !== 0 ? (
              <div>
                {orders?.map((order) => (
                  <div
                    key={order.order?.orderId}
                    className="row mb-3 p-2 order"
                  >
                    <div className="col-12 border-bottom ps-2 py-2">
                      <span className="fs-5">
                        <i className="fa fa-home" aria-hidden="true"></i> Nơi
                        bán
                      </span>
                    </div>
                    <div className="col-8 col-md-8 pt-3">
                      <div className="row">
                        <div className="col-lg-3 w-25 product_image">
                          <img
                            src={`https://duhocminhkhang.com/wp-content/uploads/2020/01/T%E1%BB%95ng-h%E1%BB%A3p-h%C3%ACnh-%E1%BA%A3nh-g%C3%A1i-xinh-%C4%91eo-m%E1%BA%AFt-k%C3%ADnh-c%E1%BB%B1c-cute-10-1.jpg`}
                            alt=""
                          />
                          {/* //order.productImage */}
                        </div>
                        <div className="col-lg-8">
                          <a href="" className="name">
                            {order.product?.productName}
                          </a>
                          <div className="price">
                            {order.product?.productPrice}
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
                    <div className="col-4 col-md-4 pt-3 order_info">
                      <div>
                        Số lượng: <span>{order.order?.quantity}</span>
                      </div>
                      <div>
                        Giá: <span>{order.order?.price}</span>
                      </div>
                      <div>
                        Phương thức thanh toán:{" "}
                        <span>{order.order?.paymentMethod}</span>
                      </div>
                      <div>
                        Ngày giao dịch: <span>{order.order?.orderDate}</span>
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

export default SellOrder;
