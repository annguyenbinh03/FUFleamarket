import { React, useContext, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import Header from "../../Header";
import Footer from "../../Footer";
import { deleteFavouriteProduct, getMyWishlist } from "../../api/wishlist";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const WishList = () => {
  const { auth } = useContext(AuthContext);
  const [products, setProducts] = useState();

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
  const fetchWishlist = async () => {
    const response = await getMyWishlist(auth.accessToken);
    if (response) {
      setProducts(response);
    } else {
    }
  };

  useState(() => {
    fetchWishlist();
  }, []);

  const formatPrice = (value) => {
    if (value) {
      return value.toLocaleString("vi-VN");
    }
    return value;
  };
  const removeFavouriteProduct = async (productId) => {
    try {
      await deleteFavouriteProduct(auth.accessToken, productId);
      showSuccessToast("Xóa sản phẩm khỏi wishlist thành công");
      fetchWishlist();
    } catch (error) {
      if (error.response && error.response.status === 204) {
        showSuccessToast("Xóa sản phẩm khỏi wishlist thành công");
        fetchWishlist();
      } else {
        showErrorToast("Xóa sản phẩm khỏi wishlist thất bại");
      }
    }
  };

  return (
    <div>
      <Header />
      <section className="wishlist spad">
        <div className="container bg-white px-2">
          <div className="row">
            <div className="text-center fs-4 my-4 mb-5 fw-bold">
              Danh sách sản phẩm yêu thích{" "}
              <span className="text-danger">
                {" "}
                <i className="fa fa-heart" aria-hidden="true"></i>
              </span>
            </div>
          </div>
          <div className="row">
            {!products || products?.length === 0 ? (
                 <div className="not-found-text fs-3">
                 Bạn chưa thêm sản phẩm nào vào danh sách yêu thích
               </div>
            ) : (
              <table className="product-table table text-center table-bordered mb-4">
                <thead className="bg-secondary">
                  <tr>
                    <th>Ảnh sản phẩm</th>
                    <th>Tên sản phẩm</th>
                    <th>Tình trạng</th>
                    <th>Giá</th>
                    <th>Mô tả</th>
                    <th>Loại sản phẩm</th>
                    <th>Review</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products?.length > 0 &&
                    products?.map((product) => (
                      <tr key={product.productId}>
                        <td>
                          <div>
                            <img
                              className="rounded-3 me-2"
                              src={product?.imageLink}
                              style={{ maxWidth: "50px", maxHeight: "80px" }}
                              alt="product"
                            />
                          </div>
                        </td>
                        <td>{product.productName}</td>
                        <td>{product.status === 1 ? "Mới" : "Đã sử dụng"}</td>
                        <td>{formatPrice(product.price)}</td>
                        <td>
                          <div className="td-description-content">
                            {product.description}
                          </div>
                        </td>
                        <td>
                          {product.dealType ? (
                            <span className="badge rounded-pill text-bg-info text-white">
                              Trao đổi
                            </span>
                          ) : (
                            <span className="badge rounded-pill text-bg-primary text-white">
                              Mua bán
                            </span>
                          )}
                        </td>
                        <td>
                          <div>
                            <Link to={`/detail/${product.productId}`}>
                              Xem sản phẩm
                            </Link>
                          </div>
                        </td>
                        <td>
                          <div>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                removeFavouriteProduct(product.productId)
                              }
                            >
                              Bỏ yêu thích
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default WishList;
