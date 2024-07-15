import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import { getCountProductAndLimit, getMyProductsAPI } from "../../api/product";
import Header from "../../Header";
import Footer from "../../Footer";
import { Link } from "react-router-dom";
import { getMyPackageAPI } from "../../api/packages";
import { toast } from "react-toastify";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const { auth } = useContext(AuthContext);
  const [sellingPackages, setSellingPackages] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [tab, setTab] = useState(1);
  const [countProductAndLimit, setCountProductAndLimit] = useState();

  const fetchProduct = async () => {
    try {
      var response = await getMyProductsAPI(auth.accessToken, tab, sortBy);
      setProducts(response);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };
  const fetchCountProductAndLimit = async () => {
    try {
      var response = await getCountProductAndLimit(auth.accessToken);
      setCountProductAndLimit(response);
    } catch (error) {
      console.error("Error fetching fetchCountProductAndLimit:", error);
    }
  };
  const fetchMyPackage = async () => {
    try {
      var response = await getMyPackageAPI(auth.accessToken);
      setSellingPackages(response);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
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

  useEffect(()=>{
    fetchProduct();
  }, [tab,sortBy])


  useEffect(() => {
    fetchProduct();
    fetchMyPackage();
    fetchCountProductAndLimit();
  }, []);

  const formatPrice = (value) => {
    if (value) {
      return value.toLocaleString("vi-VN");
    }
    return value;
  };

  function removeTimeFromISOString(isoString) {
    const index = isoString.indexOf("T");
    if (index !== -1) {
      return isoString.slice(0, index);
    }
    return isoString;
  }

  const copyToClipboard = (text) =>{
    showSuccessToast('Đã sao chép đường dẫn sản phẩm vào clipboard!');
    navigator.clipboard.writeText(text);
  }

  return (
    <div>
      <Header />
      <section className="mypost spad">
        <div className="container bg-white px-2">
          <div className="row">
            <div className="shopview pt-4 d-flex justify-content-between">
              <div className="d-flex justify-content-start ps-4 w-50">
                <div
                  className="shop_avartar col-lg-2"
                  style={{
                    backgroundImage: `url(${auth.avarta})`,
                  }}
                ></div>
                <div className="shopname col-md-8 col-lg-6 fw-bold ms-2">
                  {auth.fullName}
                  <div className="product__details__rating">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star-half-o"></i>
                    <span>(18 reviews)</span>
                  </div>
                </div>
                <div className="col-md-2 col-lg-4 my-auto">
                  <Link
                    to={auth?.id ? `/shopprofile/${auth?.id}` : "/"}
                    className="btn btn btn-dark"
                  >
                    <span>Xem trang</span>
                  </Link>
                </div>
              </div>
              <div className="div pe-4 d-flex justify-content-end w-50">
                {sellingPackages?.[0]?.productQuantity ? (
                  <div>
                    <img
                      src={require(`../../assets/img/selling-package/${sellingPackages?.[0]?.promotionId}.png`)}
                      class="pe-2"
                      alt="..."
                      width={"60px"}
                    />
                  </div>
                ) : (
                  <div></div>
                )}

                {countProductAndLimit?.currentProductQuantity ===
                countProductAndLimit?.productQuantityLimit ? (
                  <div className="my-auto fw-bold me-3 fs-5 text-danger">
                    Số lượng bài đăng:{" "} {countProductAndLimit?.currentProductQuantity}/{countProductAndLimit?.productQuantityLimit}
                  </div>
                ) : (
                  <div className="my-auto fw-bold me-3 fs-5 ">
                    Số lượng bài đăng:{" "} {countProductAndLimit?.currentProductQuantity}/{countProductAndLimit?.productQuantityLimit}
                  </div>
                )}

                <Link
                  to="/my-selling-package"
                  className="btn btn-warning rounded my-2"
                >
                  Quản lý gói bán hàng
                </Link>
              </div>
            </div>
            <div className="postnav mt-3 py-1">
              <div className="col-md-8 d-flex justify-content-center">
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
                  <span>Đang đăng bán</span>
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
                  <span>Đang trao đổi</span>
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
                  <span>Đã ẩn</span>
                </button>
                <button
                  className={`btn btn-outline-secondary mx-2 my-1 ${
                    tab === 6 && "selected"
                  } `}
                  role="tab"
                  aria-selected="false"
                  aria-disabled="false"
                  tabIndex="-1"
                  onClick={() => setTab(6)}
                >
                  <span>Bị admin ẩn</span>
                </button>
              </div>
              <div className="input-group">
                <div className="input-group-text bg-transparent border-0">
                  {" "}
                  Ưu tiên xem{" "}
                </div>
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
          </div>
        </div>
        <div className="container bg-white px-5 py-3">
          {products?.map((product) => (
            <div key={product.productId} className="product_container py-3">
              <div className="row mb-2 p-3 order">
                <div className="col-8 col-md-8">
                  <div className="row">
                    <div className="col-lg-3 w-25 product_image">
                      <img src={product?.imageLink} alt="" />
                      {product.status === 0 ? (
                        <div className="btn btn-state btn-secondary mt-3">
                          Đang chờ duyệt
                        </div>
                      ) : product.status === 1 ? (
                        <div className="btn btn-state btn-success mt-3">
                          Đã được duyệt
                        </div>
                      ) : (
                        <div className="btn btn-state btn-danger mt-3">
                          Từ chối duyệt
                        </div>
                      )}
                    </div>

                    <div className="col-lg-8">
                      <Link
                        className="fw-bold fs-5"
                        style={{ textDecoration: "none" }}
                        to={`/detail/${product.productId}`}
                      >
                        {product.productName}
                      </Link>
                      <div className="price">
                        {formatPrice(product.price)} đ
                      </div>
                      <div className="created_date">
                        Ngày đăng tin:{" "}
                        <span>
                          {removeTimeFromISOString(product.createdDate)}
                        </span>
                      </div>
                      <div className="created_date">
                        Tình trạng sản phẩm:{" "}
                        <span>{product.isNew === true ? "Mới" : "Cũ"}</span>
                      </div>
                      <div className="created_date">
                        {product.storedQuantity > 10 ? (
                          <>
                            <span className="badge text-bg-success">
                              Số lượng sản phẩm: {product.storedQuantity}
                            </span>
                          </>
                        ) : (
                          <>
                            {product.storedQuantity > 2 ? (
                              <>
                                <span className="badge text-bg-warning">
                                  Số lượng sản phẩm: {product.storedQuantity}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="badge text-bg-danger">
                                  Số lượng sản phẩm: {product.storedQuantity}
                                </span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-1 ">
                    <div className="post_button mt-3 text-end">
                      <button className="btn">
                        <i
                          className="fa fa-pencil-square-o"
                          aria-hidden="true"
                        ></i>
                        Sửa tin
                      </button>
                      <button className="btn">
                        <i className="fa fa-eye-slash" aria-hidden="true"></i>
                        Ẩn tin
                      </button>
                      <button className="btn" onClick={()=> copyToClipboard(`https://fufleamarket.azurewebsites.net/detail/${product.productId}`)}>
                        <i className="fa fa-share" aria-hidden="true"></i>
                        Chia sẻ
                      </button>
                    </div>
                  </div>
                </div>

                {/* Advertisement */}
                <div className="col-4  col-md-4 d-inline-block">
                  <div className="text-center fs-5 mb-3">
                    {product?.dealType ? (
                      <span className="badge rounded-pill text-bg-info text-white py-1">
                        <i
                          className="fa fa-exchange py-1 me-2"
                          aria-hidden="true"
                        ></i>
                        Trao đổi
                      </span>
                    ) : (
                      <span className="badge rounded-pill text-bg-primary py-1">
                        <i
                          className="fa fa-credit-card py-1 me-2"
                          aria-hidden="true"
                        ></i>
                        Buôn bán
                      </span>
                    )}
                  </div>
                  <div className="product-discription"> {product.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default MyProducts;
