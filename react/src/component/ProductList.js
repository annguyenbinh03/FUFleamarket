// src/component/ProductList.js

import React from "react";
import { Link } from "react-router-dom";

function ProductList({ products }) {
  const formatPrice = (value) => {
    return value.toLocaleString("vi-VN");
  };

  return (
    <div className="row featured__filter">
      {products?.map((product) => (
        <div className="col-lg-2 col-md-4 col-sm-6" key={product.productId}>
          <div className="featured__item">
            <div
              className="featured__item__pic set-bg"
              style={{
                backgroundImage: `url(${
                  product?.productImages ||
                  "https://i.pinimg.com/originals/d9/b8/3a/d9b83aa1a08be3e46ebb47254db8cf75.jpg"
                })`,
              }}
            >
              <ul className="featured__item__pic__hover">
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
            <div className="featured__item__text">
              <h6>
                <Link
                  className="featured__item_product_name"
                  to={`/detail/${product.productId}`}
                >
                  {product.productName}
                </Link>
              </h6>
              <h5>{formatPrice(product.price)} vnd</h5>
              <div className="featured__item__text__footer">
                <div>
                  <img
                    height="16"
                    width="16"
                    src="https://static.chotot.com/storage/chotot-icons/svg/user.svg"
                    alt="shopicon"
                  />
                </div>
                <div>
                  <span>{product.createdDate}</span>
                </div>
                <div>   -  </div>
                <div>
                  <span>Tp Hồ Chí Minh</span>
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
