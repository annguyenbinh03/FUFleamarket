import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import {
  acceptBuyRequestOrdersAPI,
  denyBuyRequestOrdersAPI,
  getMySellOrdersRequestAPI,
  rejectBuyRequestOrdersAPI,
} from "../../api/order";
import Header from "../../Header";
import Footer from "../../Footer";
import { getSellingProductForSlectOrderAPI } from "../../api/product";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function BuyOrderRequest() {
  const { productId } = useParams();
  const [orders, setOrder] = useState([]);
  const { auth } = useContext(AuthContext);
  const [sortBy, setSortBy] = useState("date");
  const [sortProductId, setSortProductId] = useState(productId ? productId : null);
  const [sellingProducts, setSellingPorudct] = useState([]);
  const [tab, setTab] = useState(1);

  const fetchOrder = async () => {
    try {
      var response = await getMySellOrdersRequestAPI(
        auth.accessToken,
        sortBy,
        sortProductId,
        tab
      );
      setOrder(response);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };
  const fetchSellingProduct = async () => {
    try {
      var response = await getSellingProductForSlectOrderAPI(auth.accessToken);
      setSellingPorudct(response);
      showChoosingProduct();
    } catch (error) {
      console.error("Error fetching SellingProduct:", error);
    }
  };


  useEffect(() => {
    fetchOrder();
    fetchSellingProduct();
  }, [ tab, sortBy, sortProductId]);



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

  const handleAcceptOrder = async (
    productId,
    orderQuantity,
    storageQuantity
  ) => {
    if (orderQuantity > storageQuantity) {
      showErrorToast("Không đủ số lượng trong kho để bán!");
    } else {
      try {
        await acceptBuyRequestOrdersAPI(auth.accessToken, productId);
        fetchOrder();
        showSuccessToast("Đã xác nhận bắt đầu trao đổi!");
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    }
  };

  const handleDenyOrder = async (productId) => {
    try {
      await denyBuyRequestOrdersAPI(auth.accessToken, productId);
      fetchOrder();
      showSuccessToast("Đã từ chối yêu cầu mua hàng");
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  const handleRejectOrder = async (productId) => {
    try {
      await rejectBuyRequestOrdersAPI(auth.accessToken, productId);
      fetchOrder();
      showSuccessToast("Đã từ chối yêu cầu mua hàng");
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  const formatPrice = (value) => {
    if(value) {
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
  const showChoosingProduct = () => {
    if (sortProductId !== null) {
      const filteredProduct = sellingProducts.find(
        (product) => (parseInt(product.productId)) === parseInt(sortProductId)
      ); 
      console.log(sortProductId + " " +  filteredProduct)
      return filteredProduct ? (
        <>
          <img
            style={{ maxWidth: "30px", maxHeight: "24px" }}
            src={`${filteredProduct.imageLink}`}
            alt="product"
          />
          {"   "}
          {filteredProduct.productName} {"   "}
        </>
      ) : (
        "Không tìm thấy sản phẩm"
      );
    } else {
      return "Tất cả sản phẩm";
    }
  };

  return (
    <div>
      <Header />
      <section className="buy_order spad">
        <div className="container bg-white px-1 py-3">
          <div className="product_container px-4 py-2">
            <h3 className="mb-4 pb-2 fw-bold">Yêu cầu mua hàng</h3>
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
                  <div className="col-md-6 d-flex">
                    <div className="col-md-5">
                      <div className="input-group">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="form-select rounded"
                        >
                          <option value="date">Sản phẩm mới nhất</option>
                          <option value="oldDate">Sản phẩm cũ nhất</option>
                          <option value="price">Giá cao nhất</option>
                          <option value="lowPrice">Giá thấp nhất</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-7">
                      <div className="input-group px-2 ">
                        <div className="dropdown w-100">
                          <button
                            className="btn btn-secondary dropdown-toggle bg-white text-black w-100 text-left"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            id="inputGroupSelect01"
                          >
                            {showChoosingProduct()}
                          </button>
                          <ul className="dropdown-menu" style={{ width: "100%" }}>
                            {sellingProducts?.length > 0 ? (
                              <>
                                <li
                                  className="dropdown-item text-center"
                                  onClick={() => setSortProductId(null)}
                                >
                                  <i
                                    className="fa fa-list-alt"
                                    aria-hidden="true"
                                  ></i>{" "}
                                  Tất cả sản phẩm
                                </li>
                                {sellingProducts.map((product) => (
                                  <li
                                    className="dropdown-item"
                                    value="1"
                                    key={product.productId}
                                    onClick={() =>
                                      setSortProductId(product.productId)
                                    }
                                  >
                                    <span className="badge text-bg-primary">
                                      {" "}
                                      {product.waitingOrderNumber}
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
                                <li className="text-center" value="">
                                  Tất cả sản phẩm
                                </li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {orders || orders?.length > 0 ? (
                <div className="row ps-4 mt-4">
                  {orders?.map((order) => (
                    <div
                      key={order.order?.orderId}
                      className="row mb-3 p-2 order"
                    >
                      <div className="col-12 border-bottom ps-2 py-2 d-flex">
                        <span className="fs-5">
                          <img
                            style={{ borderRadius: "20px" }}
                            src={order.buyer.avarta}
                            width={"30px"}
                            alt="buyer avarta"
                          />{" "}
                          {order.buyer.fullName}
                        </span>
                        <div className="ms-2">
                          {order.order?.status === 0 ? (
                            <span className="badge text-bg-secondary py-2">
                              Đang chờ duyệt
                            </span>
                          ) : order.order?.status === 1 ? (
                            <span className="badge text-bg-info py-2">
                              Đang trao đổi
                            </span>
                          ) : order.order?.status === 2 ? (
                            <span className="badge text-bg-danger py-2">
                              Đã từ chối giao dịch
                            </span>
                          ) : order.order?.status === 3 ? (
                            <span className="badge text-bg-primary py-2">
                              Đã hoàn thành giao dịch
                            </span>
                          ) : (
                            <span className="badge text-bg-danger py-2">
                              Đã bị admin ẩn
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-9 pt-3">
                        <div className="row">
                          <div className="col-lg-3 w-25 product_image">
                            <img src={order.product.imageLink} alt="" />
                            {/* //order.productImage */}
                          </div>
                          <div className="col-lg-9">
                            <Link href="" className="product-name">
                              {order.product?.productName}
                            </Link>
                            <div >
                            Giá người mua mong muốn: <span className="price">{ formatPrice(order.order?.price) } đ</span>
                            <span className="text-secondary"> ( { formatPrice(order.product?.price) } đ )</span>
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
                                      handleAcceptOrder(
                                        order.order?.orderId,
                                        order.order?.quantity,
                                        order.product?.storedQuantity
                                      )
                                    }
                                  >
                                    Bắt đầu trao đổi
                                  </button>
                                  <button
                                    className="btn btn-danger mx-3 "
                                    onClick={() =>
                                      handleDenyOrder(order.order?.orderId)
                                    }
                                  >
                                    Từ chối giao dịch
                                  </button>
                                </div>
                              ) : order.order?.status === 1 ? (
                                <div className="d-flex justify-content-center mt-2">
                                  <button
                                    className="btn btn-danger mx-3 "
                                    onClick={() =>
                                      handleRejectOrder(order.order?.orderId)
                                    }
                                  >
                                    Từ chối giao dịch
                                  </button>
                                </div>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-3 col-md-3 pt-3 order_info">
                        <div>
                          Số lượng muốn mua:{" "}
                          <span>{order.order?.quantity}</span>{" "}
                          {order.product?.storedQuantity >
                          order.order?.quantity ? (
                            <span className="badge text-bg-success">
                              kho: {order.product?.storedQuantity}
                            </span>
                          ) : (
                            <span className="badge text-bg-danger">
                              kho: {order.product?.storedQuantity}
                            </span>
                          )}
                        </div>
                        <div>
                          Phương thức thanh toán:{" "}
                          <span>{order.order?.paymentMethod}</span>
                        </div>
                        <div>
                          Ngày tạo đơn:{" "}
                          {removeTimeFromISOString(order.order?.createdDate)}
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
                  Bạn vẫn chưa có yêu cầu mua hàng nào
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default BuyOrderRequest;
