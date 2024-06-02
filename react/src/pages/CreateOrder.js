import React from "react";

function CreateOrder() {
    return (

        <div>
            <section className="create-order spad">
                <div className="container bg-white py-4">
                    <div className="row p-3">
                        <div className="fs-3 fw-bold">Thông tin đơn hàng</div>

                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 p-3">
                            <div className="seller_buyer_wrapper rounded p-3 d-flex">
                                <div className="fs-2 text-info px-2">
                                    <i className="fa fa-dot-circle-o" aria-hidden="true"></i>
                                </div>
                                <div className="ps-2">
                                    <div> <strong> Người mua</strong></div>
                                    <div>Từ: Ho Minh Quyen (k17 HCM) | 0375995822</div>
                                    <div> Đường số 11</div>
                                    <div>Phường Dĩ An, Thành phố Dĩ An, Bình Dương</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 p-3">
                            <div className="seller_buyer_wrapper rounded p-3 d-flex">
                                <div className="fs-2 text-danger px-2">
                                    <i className="fa fa-map-marker" aria-hidden="true"></i>
                                </div>
                                <div className="ps-2">
                                    <div><strong>Người bán</strong></div>
                                    <div>Đến: Ho Minh Quyen (k17 HCM) | 0375995822</div>
                                    <div>Đường số 11</div>
                                    <div>Phường Dĩ An, Thành phố Dĩ An, Bình Dương</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row px-5 pt-3">
                        <div className="col-lg-4 col-md-4 product_infor">
                            <div id="carouselExampleIndicators" className="carousel slide w-90" data-bs-ride="carousel">
                                <div className="carousel-indicators">
                                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0"
                                        className="active" aria-current="true" aria-label="Slide 1"></button>
                                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
                                        aria-label="Slide 2"></button>
                                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
                                        aria-label="Slide 3"></button>
                                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3"
                                        aria-label="Slide 4"></button>
                                </div>
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        <img src="https://th.bing.com/th/id/OIF.zxdhEgiLX7uO1Tc3l6UcgA?w=194&h=194&c=7&r=0&o=5&dpr=1.3&pid=1.7" className="d-block w-100" alt="..." />
                                    </div>
                                    <div className="carousel-item">
                                        <img src="https://th.bing.com/th?id=OIF.YOX%2fyPD3eexAF9I%2bHKyk4Q&w=194&h=194&c=7&r=0&o=5&dpr=1.3&pid=1.7" className="d-block w-100" alt="..." />
                                    </div>
                                    <div className="carousel-item">
                                        <img src="https://th.bing.com/th/id/OIP.RQKhbyYbiAqiJTMSjvrUnQHaHa?pid=ImgDet&w=184&h=184&c=7&dpr=1.7" className="d-block w-100" alt="..." />
                                    </div>
                                    <div className="carousel-item">
                                        <img src="https://th.bing.com/th/id/OIP.D4yxIa9tIFztoAqT7qNP9AHaHa?pid=ImgDet&w=184&h=184&c=7&dpr=1.3" className="d-block w-100" alt="..." />
                                    </div>
                                </div>
                                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
                                    data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
                                    data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                            <div className="product_name">
                                Tee Zara Man Size S
                            </div>
                            <div>
                                <p className="price_wistlist_left">500.000 Đ</p>
                            </div>
                        </div>
                        <div className="col-lg-8 col-md-8">
                            <div className="form-floating mb-3">
                                <input type="number" className="form-control" placeholder="300.000đ" />
                                <label className="ms-2">Giá (vnd)</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input type="number" className="form-control" placeholder="2" />
                                <label className="ms-2">Số lượng</label>
                            </div>
                            <div className="form-floating mb-3">
                                <select className="form-select">
                                    <option value="1" selected>Thanh toán trực tiếp</option>
                                    <option value="2">Chuyển khoản</option>
                                </select>
                                <label >Phương thức thanh toán</label>
                            </div>
                            <div className="form-floating mb-3">
                                <textarea className="form-control" style={ { height: ' 200px ' } }></textarea>
                                <label className="ms-3">Ghi chú</label>
                            </div>
                            <div className="container text-end px-5 pt-3">
                                <button className="btn btn-warning">Tạo hóa đơn</button>
                            </div>
                        </div>

                    </div>

                </div>
            </section>


        </div >
    );
}

export default CreateOrder;