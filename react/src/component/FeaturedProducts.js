import React, { useState, useEffect } from "react";
import { Link as LinkRouter } from "react-router-dom";
import { getProductAPI } from "../api/product";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setProducts(await getProductAPI());
  };

  return (
    <div className="row featured__filter">
      {products?.map((product) => (
        <div className="col-lg-2 col-md-4 col-sm-6" key={product.productId}>
          <div className="featured__item">
            <div
              className="featured__item__pic set-bg"
              style={{
                backgroundImage: `url(${product?.productImages?.imageLink || "https://i.pinimg.com/originals/d9/b8/3a/d9b83aa1a08be3e46ebb47254db8cf75.jpg"})`,
              }}
            >
              <ul className="featured__item__pic__hover">
                <li>
                  <LinkRouter to={`/detail/${product.productId}`}>
                    <i className="fa fa-heart"></i>
                  </LinkRouter>
                </li>
                <li>
                  <LinkRouter to={`/detail/${product.productId}`}>
                    <i className="fa fa-shopping-cart"></i>
                  </LinkRouter>
                </li>
              </ul>
            </div>
            <div className="featured__item__text">
              <h6>
                <LinkRouter to={`/detail/${product.productId}`}>
                  {product.productName}
                </LinkRouter>
              </h6>
              <h5>${product.price.toFixed(2)}</h5>
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
                  <span>15 giờ trước</span>
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

export default FeaturedProducts;
