import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductByProductIdAPI } from "../../api/product";
import AuthContext from "../../context/AuthProvider";
import { getUserProfileAPI } from "../../api/user";
import { createOrderAPI } from "../../api/order";
import Header from "../../Header";
import Footer from "../../Footer";

function CreateOrder() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [buyerAddress, setBuyerAddress] = useState(null);
  const [buyer, setBuyer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //upload
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [paymentMethod, setpaymentMethod] = useState("");
  const [receiverAddress, setAddress] = useState("");
  const [note, setNote] = useState("");

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      var response = await getProductByProductIdAPI(productId);
      setProduct(response.product);
      setBuyerAddress(response.address);
      response = await getUserProfileAPI(auth.accessToken);
      setBuyer(response.profile);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (product === null) {
      fetchProduct();
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderDate = "2024-06-06T06:16:18.408Z" ;
    const order = { price, quantity, paymentMethod,receiverAddress,note, productId,orderDate };
    const response = await createOrderAPI(order, auth.accessToken);
    console.log(response);
   // navigate('/', { replace: true });
  };

  return (
    <div>
         <Header />
      <section className="create-order spad">
        <div className="container bg-white py-4">
          <div className="row p-3">
            <div className="fs-3 fw-bold">Thông tin đơn hàng</div>
          </div>
          <div className="row">
            <div className="col-lg-6 col-md-6 p-3">
              <div className="seller_buyer_wrapper rounded p-3 d-flex">
                <div className="fs-2 text-info px-2">
                  <i className="fa fa-dot-circle-o" aria-hidden="true" />
                </div>
                <div className="ps-2">
                  <div>
                    {" "}
                    <strong> Người mua</strong>
                  </div>
                  <div>
                    Từ: {buyer?.fullName} | {buyer?.phoneNumber}
                  </div>
                  <div>{buyer?.addresses[0]?.specificAddress}</div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 p-3">
              <div className="seller_buyer_wrapper rounded p-3 d-flex">
                <div className="fs-2 text-danger px-2">
                  <i className="fa fa-map-marker" aria-hidden="true" />
                </div>
                <div className="ps-2">
                  <div>
                    <strong>Người bán</strong>
                  </div>

                  {isLoading ? (
                    <div>Đang tải thông tin người bán...</div>
                  ) : (
                    <>
                      {product?.seller?.fullName ? (
                        <>
                          <div>
                            Đến: {product.seller.fullName} |{" "}
                            {product.seller.phoneNumber}
                          </div>
                          <div>{buyerAddress || "Address Not Found"}</div>
                        </>
                      ) : (
                        <div>Không tìm thấy thông tin người bán</div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row px-5 pt-3">
            <div className="col-lg-4 col-md-4 product_infor">
              <div
                id="carouselExampleIndicators"
                className="carousel slide w-90"
                data-bs-ride="carousel"
              >
                <div className="carousel-indicators">
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to={0}
                    className="active"
                    aria-current="true"
                    aria-label="Slide 1"
                  />
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to={1}
                    aria-label="Slide 2"
                  />
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to={2}
                    aria-label="Slide 3"
                  />
                  <button
                    type="button"
                    data-bs-target="#carouselExampleIndicators"
                    data-bs-slide-to={3}
                    aria-label="Slide 4"
                  />
                </div>
                <div className="carousel-inner">
                  <div className="carousel-item active">
                    <img
                      src="https://th.bing.com/th?id=OIF.2m25a1%2fuZzRYolfaFpysYw&rs=1&pid=ImgDetMain"
                      className="d-block w-100"
                      alt="..."
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src="https://th.bing.com/th?id=OIF.2m25a1%2fuZzRYolfaFpysYw&rs=1&pid=ImgDetMain"
                      className="d-block w-100"
                      alt="..."
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src="https://th.bing.com/th?id=OIF.2m25a1%2fuZzRYolfaFpysYw&rs=1&pid=ImgDetMain"
                      className="d-block w-100"
                      alt="..."
                    />
                  </div>
                  <div className="carousel-item">
                    <img
                      src="https://th.bing.com/th?id=OIF.2m25a1%2fuZzRYolfaFpysYw&rs=1&pid=ImgDetMain"
                      className="d-block w-100"
                      alt="..."
                    />
                  </div>
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  />
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  />
                  <span className="visually-hidden">Next</span>
                </button>
              </div>

              {product ? (
                <>
                  <div className="product_name">{product.productName}</div>
                  <div>
                    <p className="price_wistlist_left">$ {product.price}</p>
                  </div>
                  <div>
                    <p className="">{product.description}</p>
                  </div>
                  <div>
                    {product.isNew ? (
                      <p>Tình trạng mới</p>
                    ) : (
                      <p>Tình trạng đã qua sử dụng</p>
                    )}
                  </div>
                </>
              ) : (
                <div>Đang tải thông tin sản phẩm...</div>
              )}
            </div>
            <div className="col-lg-8 col-md-8">
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="300.000đ"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <label className="ms-2">Giá (vnd)</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="number"
                    className="form-control"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                  <label className="ms-2">Số lượng</label>
                </div>
                <div className="form-floating mb-3">
                  <select
                    className="form-select"
                    defaultValue="Thanh toán trực tiếp"
                    required
                    value={paymentMethod}
                    onChange={(e) => setpaymentMethod(e.target.value)}
                  >
                    <option value="Thanh toán trực tiếp">
                      Thanh toán trực tiếp
                    </option>
                    <option value="Chuyển khoản">Chuyển khoản</option>
                  </select>
                  <label>Phương thức thanh toán</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={receiverAddress}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <label className="ms-2">Địa điểm giao dịch</label>
                </div>
                <div className="form-floating mb-3">
                  <textarea
                    className="form-control"
                    style={{ height: 200 }}
                    defaultValue={""}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <label className="ms-3">Ghi chú</label>
                </div>
                <div className="container text-end px-5 pt-3">
                  <button type="submit" className="btn btn-warning">
                    Tạo hóa đơn
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}

export default CreateOrder;
