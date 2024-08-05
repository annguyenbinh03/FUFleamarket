import { React, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import { addProductToWishlistAPI } from "../api/wishlist";
import { toast } from "react-toastify";

function ProductList({ products }) {
  const { auth } = useContext(AuthContext);
  const formatPrice = (value) => {
    if(value){
      return value.toLocaleString("vi-VN");
    }
    return value
  };

  const showErrorToast = (message, closeTime) => {
    toast.error(message, {
      position: "bottom-right",
      autoClose: closeTime,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const showSuccessToast = (message, closeTime) => {
    toast.success(message, {
      position: "bottom-right",
      autoClose: closeTime,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const addToWishlist = async (productId) =>{
    var WishlistDto = {
      "userId" : auth.Id ,
      "productId" : productId 
    }
    const response = await addProductToWishlistAPI(WishlistDto, auth.accessToken);
    if(response){
        showSuccessToast("Thêm sản phẩm vào wishlist thành công");
    }else{
        showErrorToast("Sản phẩm đã tồn tại trong Wishlist");
    }
  }

  return (
    <div className="row product-component">
      {products?.map((product) => (
        <div className="col-lg-2 col-md-4 col-sm-6" key={product.productId}>
          <div className="product">
            <div
              className="product-picture set-bg"
              style={{
                backgroundImage: `url(${
                  product?.productImages ||
                  "https://i.pinimg.com/originals/d9/b8/3a/d9b83aa1a08be3e46ebb47254db8cf75.jpg"
                })`,
              }}
            >
              <ul className="product-picture-hover">
                {auth && auth?.accessToken && auth.Id !== product.seller &&(
                  <li>
                    <Link onClick={() => addToWishlist(product.productId)}>
                      <i className="fa fa-heart"></i>
                    </Link>
                  </li>
                )}

                <li>
                  <Link to={`/detail/${product.productId}`}>
                    <i className="fa fa-search"></i>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="product-text">
              <h6>
                <Link
                  className="product-text-name"
                  to={`/detail/${product.productId}`}
                >
                  {product.productName}
                </Link>
              </h6>
              <h5>{formatPrice(product.price)} đ</h5>
              <div className="product-text-footer">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div>
                      <img
                        height="16"
                        width="16"
                        className="rounded-3"
                        src={product.seller.avarta}
                        alt="shopicon"
                      />
                    </div>
                    <div>
                      <span className="ms-1">{product.createdDate}</span>
                    </div>
                  </div>
                  <div>
                    <span>
                      {product.dealType ? (
                        <span className="badge rounded-pill text-bg-info text-white">
                          <i
                            className="fa fa-exchange py-1 mx-2"
                            aria-hidden="true"
                          ></i>
                        </span>
                      ) : (
                        <span className="badge rounded-pill text-bg-primary text-white">
                          <i
                            className="fa fa-credit-card py-1 mx-2"
                            aria-hidden="true"
                          ></i>
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
