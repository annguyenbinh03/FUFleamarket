import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import { completeOrdersByBuyerAPI, getBuyOrdersAPI, rejectBuyRequestOrdersByBuyerAPI } from "../../api/order";
import Header from "../../Header";
import Footer from "../../Footer";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function BuyOrder() {
  const [orders, setOrder] = useState([]);
  const { auth } = useContext(AuthContext);
  const [tab, setTab] = useState(1);
  const [sortBy, setSortBy] = useState("date");

  const fetchOrder = async () => {
    try {
      var response = await getBuyOrdersAPI(auth.accessToken, tab, sortBy);
      setOrder(response);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };
  useEffect(() => {
    fetchOrder();
  }, [tab, sortBy]);

  const showErrorToast = (message) =>{
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
  }
  const showSuccessToast = (message) =>{
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
  }
  const changTab = (tabId) => {
    setTab(tabId);
  };

  const formatPrice = (value) => {
    if (value) {
      return value.toLocaleString("vi-VN");
    }
    return value;
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

  const handleRejectOrder = async (productId) => {
    try {
      await rejectBuyRequestOrdersByBuyerAPI(auth.accessToken, productId);
      fetchOrder();
      showSuccessToast("Đã từ chối yêu cầu mua hàng");
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  const handleCompleteOrder = async (productId) => {
    try {
      await completeOrdersByBuyerAPI(auth.accessToken, productId);
      fetchOrder();
      showSuccessToast("Đã hoàn thành đơn hàng!");
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  return (
    <div>
      <Header />
      <section className="buy_order spad">
        <div className="container bg-white px-1 py-3">
          <div className="product_container px-4 py-2">
            <h3 className="mb-4 pb-2 fw-bold">Đơn mua của tôi</h3>
            <div className="border-top border-1">
              <div className="d-flex justify-content-start align-items-center">
                <div className="tab col-md-7 d-flex justify-content-center">
                  <button
                    className={`btn btn-outline-secondary mx-2 my-1 ${
                      tab === 1 && "selected"
                    } `}
                    role="tab"
                    aria-selected="false"
                    aria-disabled="false"
                    tabIndex="-1"
                    onClick={() => changTab(1)}
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
                    onClick={() => changTab(2)}
                  >
                    <span>Đang chờ người bán duyệt</span>
                  </button>
                  <button
                    className={`btn btn-outline-secondary mx-2 my-1 ${
                      tab === 3 && "selected"
                    } `}
                    role="tab"
                    aria-selected="false"
                    aria-disabled="false"
                    tabIndex="-1"
                    onClick={() => changTab(3)}
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
                    onClick={() => changTab(4)}
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
                    onClick={() => changTab(5)}
                  >
                    <span>Đã bị từ chối</span>
                  </button>
                </div>
                <div className="col-md-5 d-flex justify-content-center">
                  <div className="col-md-7">
                    <div className="input-group">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="form-select rounded"
                      >
                        <option value="date">Đơn mua mới nhất</option>
                        <option value="oldDate">Đơn mua cũ nhất</option>
                        <option value="price">Giá cao nhất</option>
                        <option value="lowPrice">Giá thấp nhất</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {orders && orders?.length !== 0 ? (
              <div>
                {orders?.map((order) => (
                  <div
                    key={order.order.orderId}
                    className="row mb-3 mt-4 order"
                  >
                    <div className="col-12 border-bottom ps-2 py-2 d-flex">
                      <span className="fs-5">
                        <img
                          style={{ borderRadius: "20px" }}
                          src={order.order.seller.avarta}
                          width={"30px"}
                          alt="seller avarta"
                        />{" "}
                        {order.order.seller.fullName}
                      </span>
                      <div className="ms-2">
                        {order.order?.status === 0 ? (
                          <span class="badge text-bg-secondary py-2">
                            Đang chờ người bán duyệt
                          </span>
                        ) : order.order?.status === 1 ? (
                          <span class="badge text-bg-info py-2">
                            Đang trao đổi
                          </span>
                        ) : order.order?.status === 2 ? (
                          <span class="badge text-bg-danger py-2">
                            Đã từ chối giao dịch
                          </span>
                        ) : order.order?.status === 3 ? (
                          <span class="badge text-bg-primary py-2">
                            Đã hoàn thành giao dịch
                          </span>
                        ) : (
                          <span class="badge text-bg-danger py-2">
                            Đã bị admin ẩn
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-md-9 pt-3 p-1">
                      <div className="row">
                        <div className="col-lg-3 w-25 product_image">
                          <img src={order.product.imageLink} alt="" />
                          {/* //order.productImage */}
                        </div>
                        <div className="col-lg-9">
                          <Link href="" className="product-name">
                            {order.product?.productName}
                          </Link>
                          <div>
                            Giá người mua mong muốn:{" "}
                            <span className="price">
                              {formatPrice(order.order?.price)} đ
                            </span>
                            <span className="text-secondary">
                              {" "}
                              ( {formatPrice(order.product?.productPrice)} đ )
                            </span>
                          </div>
                          <div className="address">
                            {order.order?.receiverAddress}
                          </div>
                          <div className=" mt-2">
                            {order.order?.status === 1 ? (
                              <div className="d-flex justify-content-around"> 
                                <div className="d-flex justify-content-center">
                                  <button className="btn btn-danger mx-3"
                                   onClick={() =>
                                    handleRejectOrder(order.order?.orderId)
                                  }>
                                    Từ chối giao dịch
                                  </button>
                                </div>
                                <div className="d-flex justify-content-center">
                                  <button className="btn btn-success mx-3"
                                  onClick={() =>
                                    handleCompleteOrder(order.order?.orderId)}
                                  >
                                    Hoàn tất giao dịch
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3 pt-3 order_info">
                      <div>
                        Số lượng: <span>{order.order?.quantity}</span>
                      </div>
                      <div>
                        Phương thức thanh toán:{" "}
                        <span>{order.order?.paymentMethod}</span>
                      </div>
                      <div>
                        Ngày tạo đơn:{" "}
                        <span>
                          {removeTimeFromISOString(order.order?.createdDate)}
                        </span>
                      </div>
                      <div className="note">
                        Ghi chú: <span>{order.order?.note || ""}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="not-found-text fs-3">
                Bạn vẫn chưa tạo đơn mua nào
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default BuyOrder;
