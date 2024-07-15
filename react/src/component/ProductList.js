import React from "react";
import { Link } from "react-router-dom";

function ProductList({ products }) {

  const formatPrice = (value) => {
    return value.toLocaleString("vi-VN");
  };

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
                <li>
                  <Link to={`/detail/${product.productId}`}>
                    <i className="fa fa-heart"></i>
                  </Link>
                </li>
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
              <h5>{formatPrice(product.price)} vnd</h5>
              <div className="product-text-footer">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <div>
                      <img
                        height="16"
                        width="16"
                        src="https://static.chotot.com/storage/chotot-icons/svg/user.svg"
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
                      <span class="badge rounded-pill text-bg-info text-white">
                        <i
                          class="fa fa-exchange py-1 mx-2"
                          aria-hidden="true"
                        ></i>
                      </span>
                    ) : (
                      <span class="badge rounded-pill text-bg-primary text-white">
                        <i
                          class="fa fa-credit-card py-1 mx-2"
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
