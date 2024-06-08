// src/component/ProductList.js

import React from "react";
import { Link } from "react-router-dom";

function ProductList({ products }) {
  return (
    <div className="row featured__filter">
      {products?.map((product) => (
        <div className="col-lg-2 col-md-4 col-sm-6" key={product.productId}>
          <div className="featured__item">
            <div
              className="featured__item__pic set-bg"
              style={{
                backgroundImage: `url(${product.imageUrl || 'https://th.bing.com/th?id=OIF.2m25a1%2fuZzRYolfaFpysYw&rs=1&pid=ImgDetMain'})`,
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
                    <i className="fa fa-shopping-cart"></i>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="featured__item__text">
              <h6>
                <Link to={`/detail/${product.productId}`}>{product.productName}</Link>
              </h6>
              <h5>${product.price.toFixed(2)}</h5>
              <div className="featured__item__text__footer d-flex justify-content-between">
                <div className="d-flex align-items-center">
                  <img
                    height="16"
                    width="16"
                    src="https://static.chotot.com/storage/chotot-icons/svg/user.svg"
                    alt="shopicon"
                    className="me-2"
                  />
                  <span>{new Date(product.createdAt).toLocaleString()}</span>
                </div>
                <div> - </div>
                <div>
                  <span>{product.address}</span>
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
