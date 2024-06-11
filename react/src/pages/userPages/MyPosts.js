import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import { getMyProductsAPI } from "../../api/product";
import Header from "../../Header";
import Footer from "../../Footer";
import { Link } from "react-router-dom";

function MyPosts() {
  const [products, setProducts] = useState([]);
  const { auth } = useContext(AuthContext);

  const fetchProduct = async () => {
    try {
      var response = await getMyProductsAPI(auth.accessToken);
      setProducts(response);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div>
           <Header />
      <section className="mypost spad">
        <div className="container bg-white px-2">
          <div className="row">
            <div className="shopview pt-4">
              <div className="d-flex justify-content-center">
                <div
                  className="shop_avartar col-lg-2"
                  style={{
                    backgroundImage: `url(${auth.avarta})`,
                  }}
                ></div>
                <div className="shopname col-lg-10 fw-bold ms-2">
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
                      <img
                        src="https://th.bing.com/th/id/OIP.W0Eid8HDx9_9G0SoUvWI4AHaE7?w=300&h=200&c=7&r=0&o=5&pid=1.7"
                        alt=""
                      />
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
                      <Link to={`/detail/${product.productId}`}>
                        {product.productName}
                      </Link>
                      <div className="price">{product.price}</div>
                      <div className="address">
                        Phường Dĩ An, Thành phố Dĩ An, Bình Dương
                      </div>
                      <div className="created_date">
                        Ngày đăng tin: <span>{product.createdDate}</span>
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
                  quảng cáo blabla
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer/>
    </div>
  );
}

export default MyPosts;
