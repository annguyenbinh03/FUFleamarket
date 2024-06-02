import React from "react";

function PostProduct() {
    return (
        <div>
            <section className="upload-product spad">
                <div className="container bg-white py-4 d-flex">
                    <div className="col-lg-4 com-md-4">
                        <div className="d-flex flex-column px-3">
                            <h5>Hình ảnh về sản phẩm </h5>
                            <span>
                                Xem thêm về
                                <a href="?">Quy định đăng tin của FUFM</a>
                            </span>
                            <div className="file-uploader mt-3 ">
                                <div className="uploader-header">
                                    <h2 className="uploader-title">Tải ảnh lên</h2>
                                    <h4 className="file-completed-status"> </h4>
                                </div>
                                <ul className="file-list"></ul>
                                <div className="file-upload-box">
                                    <h2 className="box-title">
                                        <span className="file-instruction">Drag files here or</span>
                                        <span className="file-browse-button">browse</span>
                                    </h2>
                                    <input className="file-browse-input" type="file" multiple hidden />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-8 com-md-8 px-5">
                        <div className="py-2 fw-bold">Danh mục tin đăng </div>
                        <select required className="form-select select">
                            <option value="0">Đồ điện tử</option>
                            <option value="0">Đồ dùng học tập</option>
                            <option value="0">Điện lạnh</option>
                            <option value="0">Đồ gia dụng, nội thất</option>
                            <option value="0">Đồ ăn, thực phẩm</option>
                            <option value="0">Thời trang</option>
                            <option value="0">Giải trí, thể thao, sở thích</option>
                        </select>
                        <div className="pt-4 pb-1 fw-bold">Thông tin chi tiết</div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Tình trạng sản phẩm </span>
                            <select required className="form-select select">
                                <option value="0" selected>Mới</option>
                                <option value="0">Cũ</option>
                            </select>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Tên sản phẩm</span>
                            <input required type="text" className="form-control" placeholder="Tên sản phẩm" />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Giá bán</span>
                            <input required type="text" className="form-control" placeholder="Giá (vnd)" />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text">Mô tả chi tiết</span>
                            <textarea required className="form-control text_mota"
                                placeholder="- Xuất xứ, tình trạng chiếc điện thoại
- Thời gian sử dụng
- Bảo hành nếu có
- Sửa chữa, nâng cấp, phụ kiện đi kèm
- Chấp nhận thanh toán/ vận chuyển qua Chợ Tốt
- Chính sách bảo hành, bảo trì, đổi trả hàng hóa/sản phẩm
- Địa chỉ giao nhận, đổi trả hàng hóa/sản phẩm" rows="10"></textarea>
                        </div>
                        <div className="container d-flex justify-content-between px-5 pt-3">
                            <button className="btn btn-warning">Xem trước</button>
                            <button className="btn btn-warning">Đăng tin</button>
                        </div>
                    </div>

                </div>
            </section>








        </div>
    );
}

export default PostProduct;