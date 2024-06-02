import React from "react";

function MyPosts() {
    return (
        <div>
            <section className="mypost spad">
                <div className="container bg-white px-2">
                    <div className="row">
                        <div className="shopview pt-4">
                            <div className="d-flex justify-content-center">
                                <div
                                    className="shop_avartar col-lg-2"
                                    style={{
                                        backgroundImage: `url(https://cdn.chotot.com/G-1Z5ZbUlOQ2uJVjMhxxCver9aggaeYCn5ViRzXSzJY/preset:uac/plain/5880693cc1e7c23bec7c83355df078f1-731e14cfed11748e400f5a652062afa74f966b5d.jpg)`,
                                    }}
                                ></div>
                                <div className="shopname col-lg-10 fw-bold ms-2">
                                    Shop của best yasuo viet nam
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
                    <div className="product_container p-4">
                        <div className="row">
                            {/* Product Item */}
                            <div className="col-8 col-md-8">
                                <div className="row">
                                    <div className="col-lg-3 w-25 product_image">
                                        <img
                                            src="https://th.bing.com/th/id/OIP.W0Eid8HDx9_9G0SoUvWI4AHaE7?w=300&h=200&c=7&r=0&o=5&pid=1.7"
                                            alt=""
                                        />
                                    </div>
                                    <div className="col-lg-8">
                                        <a href="" className="name">
                                            Chuột logitech M221
                                        </a>
                                        <div className="price">100.000đ</div>
                                        <div className="address">
                                            Phường Dĩ An, Thành phố Dĩ An, Bình Dương
                                        </div>
                                        <div className="created_date">
                                            Ngày đăng tin: <span>17/05/24</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Post Buttons with Hover Effect */}
                                <div className="post_button mt-3 text-end">
                                    <button className="btn">
                                        <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
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

                            {/* Advertisement */}
                            <div className="col-4 col-md-4 d-inline-block">
                                quảng cáo blabla
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default MyPosts;