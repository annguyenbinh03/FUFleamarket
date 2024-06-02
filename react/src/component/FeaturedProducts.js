import React, { useState, useEffect } from 'react';
import { Link as LinkRouter } from 'react-router-dom';

function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://localhost:7057/api/product');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (

        <div className="row featured__filter">
          {products.map(product => (
            <div className="col-lg-2 col-md-4 col-sm-6" key={product.productId}>
              <div className="featured__item">
                <div 
                  className="featured__item__pic set-bg"
                  style={{ backgroundImage:  `url(https://th.bing.com/th?id=OIF.2m25a1%2fuZzRYolfaFpysYw&rs=1&pid=ImgDetMain)` }}
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
                      <span>
                        15 giờ trước
                      </span>
                    </div>
                    <div>   -  </div>
                    <div>
                      <span>
                        Tp Hồ Chí Minh
                      </span>
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