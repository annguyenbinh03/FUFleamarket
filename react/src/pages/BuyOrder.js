import React from "react";

function BuyOrder() {
  // Khai báo mảng orders bên ngoài hàm return
  const orders = [
    {
      shopName: "Shop Yasuo",
      productName: "Chuột logitech M221",
      productImage:
        "https://cdn.chotot.com/KaeCJ37UZYOEULAGMmXXysx58XK2HN0NuGRDe19ghmc/preset:listing/plain/04ce7661b608efb996c24464a494c5b7-2878763638223117842.jpg",
      productPrice: "100.000đ",
      productQuantity: 2,
      productAddress: "Phường Dĩ An, Thành phố Dĩ An, Bình Dương",
      payment: "Tiền mặt",
      date: "30/5/2024",
    },
    {
        shopName: "Shop Yasuo",
        productName: "Chuột logitech M221",
        productImage:
          "https://cdn.chotot.com/KaeCJ37UZYOEULAGMmXXysx58XK2HN0NuGRDe19ghmc/preset:listing/plain/04ce7661b608efb996c24464a494c5b7-2878763638223117842.jpg",
        productPrice: "100.000đ",
        productQuantity: 2,
        productAddress: "Phường Dĩ An, Thành phố Dĩ An, Bình Dương",
        payment: "Tiền mặt",
        date: "30/5/2024",
      },
      {
        shopName: "Shop Yasuo",
        productName: "Chuột logitech M221",
        productImage:
          "https://cdn.chotot.com/KaeCJ37UZYOEULAGMmXXysx58XK2HN0NuGRDe19ghmc/preset:listing/plain/04ce7661b608efb996c24464a494c5b7-2878763638223117842.jpg",
        productPrice: "100.000đ",
        productQuantity: 2,
        productAddress: "Phường Dĩ An, Thành phố Dĩ An, Bình Dương",
        payment: "Tiền mặt",
        date: "30/5/2024",
      },
  ];

  return (
    <div>
      <section className="buy_order spad">
        <div className="container bg-white px-5 py-3">
          <div className="product_container px-4 py-2">
            <h3 className="mb-3 fw-bold">Đơn mua của tôi</h3>

            {orders.map((order, index) => (
              <div key={index} className="row mb-5">
                <div className="col-12 border-bottom  pb-1">
                  <span className="fs-5">
                    <i className="fa fa-home" aria-hidden="true"></i>{" "}
                    {order.shopName}
                  </span>
                </div>
                <div className="col-8 col-md-8 pt-3">
                  <div className="row">
                    <div className="col-lg-3 w-25 product_image">
                      <img src={order.productImage} alt="" />
                    </div>
                    <div className="col-lg-8">
                      <a href="" className="name">
                        {order.productName}
                      </a>
                      <div className="price">{order.productPrice}</div>
                      <div className="address">{order.productAddress}</div>
                    </div>
                  </div>
                </div>
                <div className="col-4 col-md-4 pt-3 order_info">
                  <div>Số lượng: <span>{order.productQuantity}</span></div>
                  <div>Giá: <span>{order.productPrice}</span></div>
                  <div>
                    Phương thức thanh toán:{" "}
                    <span>{order.payment}</span>
                  </div>
                  <div>
                    Ngày giao dịch: <span>{order.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default BuyOrder;