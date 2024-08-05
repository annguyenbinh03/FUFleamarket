import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import Header from "../../Header";
import Footer from "../../Footer";
import { toast } from "react-toastify";
import { getMyTradingOrderAPI, user1CompleteTradingRequest, user1RejectTradingRequest } from "../../api/tradingOrder";

const TradingOrder = () => {
  const [orders, setOrder] = useState([]);
  const { auth } = useContext(AuthContext);
  const [tab, setTab] = useState(1);
  const [sortBy, setSortBy] = useState("date");

  const fetchOrder = async () => {
    try {
      var response = await getMyTradingOrderAPI(auth.accessToken, tab, sortBy);
      setOrder(response);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };
  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await user1CompleteTradingRequest(auth.accessToken, orderId);
      fetchOrder();
      showSuccessToast("Đã xác nhận trao đổi!");
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      await user1RejectTradingRequest(auth.accessToken, orderId);
      fetchOrder();
      showSuccessToast("Đã từ chối yêu cầu mua hàng");
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  function removeTimeFromISOString(isoString) {
    if (isoString) {
      const index = isoString.indexOf("T");
      if (index !== -1) {
        var string = isoString.slice(0, index);
        string += " ";
        string += isoString.slice(index+1, index+6);
        return string;
      }
    }
    return isoString;
  }

  useEffect(() => {
    fetchOrder();
  }, [tab, sortBy]);

  return (
    <div>
      <Header />
      <section className="trading-order spad">
        <div className="container bg-white px-1 py-3">
          <div className="product_container px-4 py-2">
            <h3 className="mb-4 pb-2 fw-bold">Đơn trao đổi của tôi</h3>
            <div className="row mb-3">
              <div className="border-top border-1">
                <div className="d-flex justify-content-start align-items-center">
                  <div className="tab col-md-6 d-flex justify-content-center">
                    <button
                      className={`btn btn-outline-secondary mx-2 my-1 ${
                        tab === 1 && "selected"
                      } `}
                      role="tab"
                      aria-selected="false"
                      aria-disabled="false"
                      tabIndex="-1"
                      onClick={() => setTab(1)}
                    >
                      <span className="name">Tất cả</span>
                    </button>

                    <button
                      className={`btn btn-outline-secondary mx-2 my-1 ${
                        tab === 2 && "selected"
                      } `}
                      role="tab"
                      aria-selected="false"
                      aria-disabled="false"
                      tabIndex="-1"
                      onClick={() => setTab(2)}
                    >
                      <span>Đang chờ duyệt</span>
                    </button>
                    <button
                      className={`btn btn-outline-secondary mx-2 my-1 ${
                        tab === 3 && "selected"
                      } `}
                      role="tab"
                      aria-selected="false"
                      aria-disabled="false"
                      tabIndex="-1"
                      onClick={() => setTab(3)}
                    >
                      <span>Đang trao đổi</span>
                    </button>
                    <button
                      className={`btn btn-outline-secondary mx-2 my-1 ${
                        tab === 4 && "selected"
                      } `}
                      role="tab"
                      aria-selected="false"
                      aria-disabled="false"
                      tabIndex="-1"
                      onClick={() => setTab(4)}
                    >
                      <span>Đã hoàn thành</span>
                    </button>
                    <button
                      className={`btn btn-outline-secondary mx-2 my-1 ${
                        tab === 5 && "selected"
                      } `}
                      role="tab"
                      aria-selected="false"
                      aria-disabled="false"
                      tabIndex="-1"
                      onClick={() => setTab(5)}
                    >
                      <span>Đã từ chối</span>
                    </button>
                  </div>
                  <div className="col-md-6 d-flex justify-content-center">
                    <div className="col-md-6">
                      <div className="input-group">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="form-select rounded"
                        >
                          <option value="date">Đơn mới nhất</option>
                          <option value="oldDate">Đơn cũ nhất</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {orders || orders?.length > 0 ? (
                <div className="row ps-4 mt-4">
                  {orders?.map((order) => (
                    <div
                      key={order.tradingOrderId}
                      className="row mb-3 p-2 order"
                    >
                      <div className="col-md-10 pt-3">
                        <div className="row border-bottom pb-2 border-1">
                          <div className="col-md-6">
                            <div>
                              <span className="me-2 text-secondary">
                                Bên yêu cầu:
                              </span>
                              <img
                                className="me-2"
                                width="30px"
                                src={order.user1?.avarta}
                                style={{ borderRadius: "20px" }}
                                alt="buyer avatar"
                              />
                              {order.user1?.fullName}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div>
                              <span className="me-2 text-secondary">
                                Bên tiếp nhận
                              </span>
                              <img
                                className="me-2"
                                width="30px"
                                src={order.user2?.avarta}
                                style={{ borderRadius: "20px" }}
                                alt="buyer avatar"
                              />
                              {order.user2?.fullName}
                            </div>
                          </div>
                        </div>
                        <div className="row mt-3">
                          <div className="col-md-6">
                            {order?.user1TradingOrderDetails?.map((product) => (
                              <div
                                className="mb-3 d-flex align-items-center product-container"
                                key={product.tradingOrderDetailId}
                              >
                                <div className="img-container">
                                  <img
                                    className="product-image"
                                    src={product.product?.imageLink}
                                    alt="product"
                                  />
                                </div>

                                <div className="ms-1 product-name">
                                  {product.product?.productName}
                                </div>
                                <div className="ms-1 d-inline text-primary">
                                  x {product.quantity}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="col-md-6">
                            {order?.user2TradingOrderDetails?.map((product) => (
                              <div
                                className="mb-3 d-flex align-items-center product-container"
                                key={product.tradingOrderDetailId}
                              >
                                <div className="img-container">
                                  <img
                                    className="product-image"
                                    src={product.product?.imageLink}
                                    alt="product"
                                  />
                                </div>

                                <div className="ms-2 product-name">
                                  {product.product?.productName}
                                </div>
                                <div className="ms-1 d-inline text-primary">
                                  x {product.quantity}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-2 pt-3">
                        <div className="row  pb-2 d-flex justify-content-center">
                          <div className="px-2 d-flex justify-content-center">
                            {order?.status === 0 ? (
                              <span class="badge text-bg-secondary py-2">
                                Đang chờ duyệt
                              </span>
                            ) : order?.status === 1 ? (
                              <span class="badge text-bg-info py-2">
                                Đang trao đổi
                              </span>
                            ) : order?.status === 2 ? (
                              <span class="badge text-bg-danger py-2">
                                Đã từ chối trao đổi
                              </span>
                            ) : order?.status === 3 ? (
                              <span class="badge text-bg-primary py-2">
                                Đã hoàn thành trao đổi
                              </span>
                            ) : (
                              <span class="badge text-bg-danger py-2">
                                Đã bị admin ẩn
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="row">
                          {order?.status === 1 ? (
                            <div className="d-flex flex-column  align-items-center mt-4">
                              <div className="d-flex justify-content-center">
                                <button
                                  className="btn btn-danger mb-3"
                                  onClick={() =>
                                    handleRejectOrder(order?.tradingOrderId)
                                  }
                                >
                                  Từ chối giao dịch
                                </button>
                              </div>
                              <div className="d-flex justify-content-center">
                                <button
                                  className="btn btn-success mt-2"
                                  onClick={() =>
                                    handleCompleteOrder(order?.tradingOrderId)
                                  }
                                >
                                  Hoàn tất giao dịch
                                </button>
                              </div>
                            </div>
                          ) :  (
                            <></>
                          )}
                        </div>
                      </div>
                      <div className="col-md-12 border-top border-1 pt-2 note">
                        <span className="text-secondary">Ghi chú:{" "}</span>
                        {order?.note}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="not-found-text fs-3">
                  Bạn vẫn chưa tạo yêu cầu trao đổi nào
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default TradingOrder;
