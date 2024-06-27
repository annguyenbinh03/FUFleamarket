import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import { getMyProductsAPI } from "../../api/product";
import Header from "../../Header";
import Footer from "../../Footer";
import { Link } from "react-router-dom";
import { getMyPackageAPI } from "../../api/packages";

function MyPosts() {
  const [products, setProducts] = useState([]);
  const { auth } = useContext(AuthContext);
  const [sellingPackages, setSellingPackages] = useState([]);

  const fetchProduct = async () => {
    try {
      var response = await getMyProductsAPI(auth.accessToken);
      setProducts(response);
    } catch (error) {
      console.error("Error fetching product:", error);
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

  useEffect(() => {
    fetchProduct();
    fetchMyPackage();
  }, []);

  const formatPrice = (value) => {
    if(value){
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
                  <Link  to={ auth?.id ?  `/shopprofile/${auth?.id}` : "/"}  className="btn btn btn-dark">
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

                {(sellingPackages?.[0]?.promotion.productQuantityLimit &&
                  sellingPackages?.[0]?.promotion.productQuantityLimit === products?.length) ||
                (!sellingPackages?.[0]?.promotion.productQuantityLimit &&
                  3 === products?.length) ? (
                  <div className="my-auto fw-bold me-3 fs-5 text-danger">
                    Số lượng bài đăng:{" "}
                    {Array.isArray(products) ? products.length : 0}/
                    {sellingPackages
                      ? sellingPackages?.[0]?.promotion.productQuantityLimit
                      : 3}
                  </div>
                ) : (
                  <div className="my-auto fw-bold me-3 fs-5 ">
                    Số lượng bài đăng:{" "}
                    {Array.isArray(products) ? products.length : 0}/
                    {sellingPackages
                      ? sellingPackages?.[0]?.promotion.productQuantityLimit
                      : 3}
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
            <div className="postnav mt-3">
              <div className="d-flex flex-wrap justify-content-center">
                <button
                  className="btn btn-outline-secondary mx-2 my-1 selected"
                  role="tab"
                  aria-selected="false"
                  aria-disabled="false"
                  tabIndex="-1"
                >
                  <span className="name">ĐANG HIỂN THỊ (1)</span>
                </button>

                <button
                  className="btn btn-outline-secondary mx-2 my-1"
                  role="tab"
                  aria-selected="false"
                  aria-disabled="false"
                  tabIndex="-1"
                >
                  <span>HẾT HẠN (0)</span>
                </button>
                <button
                  className="btn btn-outline-secondary mx-2 my-1"
                  role="tab"
                  aria-selected="false"
                  aria-disabled="false"
                  tabIndex="-1"
                >
                  <span>BỊ TỪ CHỐI (0)</span>
                </button>
                <button
                  className="btn btn-outline-secondary mx-2 my-1"
                  role="tab"
                  aria-selected="false"
                  aria-disabled="false"
                  tabIndex="-1"
                >
                  <span>CẦN THANH TOÁN (0)</span>
                </button>
                <button
                  className="btn btn-outline-secondary mx-2 my-1"
                  role="tab"
                  aria-selected="false"
                  aria-disabled="false"
                  tabIndex="-1"
                >
                  <span>CHỜ DUYỆT (0)</span>
                </button>
                <button
                  className="btn btn-outline-secondary mx-2 my-1"
                  role="tab"
                  aria-selected="false"
                  aria-disabled="false"
                  tabIndex="-1"
                >
                  <span>ĐÃ ẨN (0)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container bg-white px-5 mt-3 py-3">
          {products?.map((product) => (
            <div className="product_container py-3">
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
                      <div className="address">
                        Phường Dĩ An, Thành phố Dĩ An, Bình Dương
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
                      <button className="btn">
                        <i className="fa fa-share" aria-hidden="true"></i>
                        Chia sẻ
                      </button>
                    </div>
                  </div>
                </div>

                {/* Advertisement */}
                <div className="col-4 col-md-4 d-inline-block">
                  {product.description}
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

export default MyPosts;
