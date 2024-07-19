import { React, useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../context/AuthProvider";
import { getCountProductAndLimit, createProductAPI } from "../../api/product";
import Header from "../../Header";
import Footer from "../../Footer";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { imageDb } from "../../FirebaseImage/Config";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";

function CreateProduct() {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [countProductAndLimit, setCountProductAndLimit] = useState();
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(1);
  const [storedQuantity, setStoredQuantity] = useState(1);
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [dealType, setDealType] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [img, setImg] = useState("");
  const inputRef = useRef(null);

  const fetchCountProductInfo = async () => {
    try {
      var response = await getCountProductAndLimit(auth.accessToken);
      setCountProductAndLimit(response);
      if (response.currentProductQuantity === response.productQuantityLimit) {
        showErrorToast(
          "Số lượng sản phẩm bạn được đăng đã đạt mức tối đa, hãy mua các gói bán hàng để tiếp tục đăng tải sản phẩm!",
          10000
        );
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    fetchCountProductInfo();
  }, []);

  const checkValidation = () => {
    var check = true;
    if (productName !== null) {
      if (productName.length < 5 || productName.length > 100) {
        showErrorToast("Tên sản phẩm phải lớn hơn 5 và bé hơn 100 kí tự");
        check = false;
      }
    } else {
      showErrorToast("Tên sản phẩm không được trống");
      check = false;
    }
    if (price === null || price < 1) {
      showErrorToast("Giá sản phẩm phải lớn hơn 0");
      check = false;
    }
    if (storedQuantity === null || storedQuantity < 1) {
      showErrorToast("Số lượng sản phẩm trong kho phải lớn hơn 0");
      check = false;
    }
    if (description && description.length > 3000) {
      showErrorToast(
        `Miêu tả sản phẩm không được quá 3000 kí tự(${description.length})`
      );
      check = false;
    }
    return check;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      countProductAndLimit.currentProductQuantity ===
      countProductAndLimit.productQuantityLimit
    ) {
      showErrorToast(
        "Số lượng sản phẩm bạn được đăng đã đạt mức tối đa, hãy mua các gói bán hàng để tiếp tục đăng tải sản phẩm!",
        10000
      );
    }
    if (!checkValidation()) {
      return; //stop
    }
    var urlImg = await handleUploadImagesClick();
    if (urlImg !== "") {
      var imageLink = urlImg;
      const product = {
        productName,
        price,
        description,
        categoryId,
        isNew,
        dealType,
        imageLink,
        storedQuantity,
      };
      const response = await createProductAPI(product, auth.accessToken);
      if (response) {
        showInforToast("Tạo sản phẩm hoàn tất, đang chờ xét duyệt!", 5000);
        navigate("my-products", { replace: true });
      } else {
        showErrorToast("Xảy ra lỗi trong quá trình tạo sản phẩm!", 7000);
      }
    } else {
      showErrorToast("Đăng sản phẩm thất bại, không tìm thấy ảnh!", 5000);
    }
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

  const showInforToast = (message, closeTime) => {
    toast.info(message, {
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

  const handleUploadImagesClick = async () => {
    if (img !== null) {
      const imgRef = ref(imageDb, `productImages/${v4()}`);
      const value = await uploadBytes(imgRef, img);
      const url = await getDownloadURL(value.ref);
      return url;
    } else {
      alert("Ảnh đại diện sản phẩm phải được đăng tải");
      return "";
    }
  };

  const handleImageClick = () => {
    inputRef.current.click();
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      const validImagesType = ["image/png", "image/jpeg"];
      const limitFileSize = 10 * 1024 * 1024;
      if (validImagesType.includes(fileType)) {
        if (file.size < limitFileSize) {
          setImg(file);
        } else {
          showErrorToast("Dung lượng ảnh phải bé hơn 10Mb.");
        }
      } else {
        showErrorToast("Chỉ có thể đăng ảnh thuộc dạng jpg/png.");
      }
    }
  };

  const formatPrice = (value) => {
    if (value) {
      return value.toLocaleString("vi-VN");
    }
  };

  return (
    <div>
      <Header />
      <section className="upload-product spad">
        <div className="container bg-white py-4 d-flex">
          <div className="col-lg-4 com-md-4">
            <div className="d-flex flex-column px-3">
              <h5>Hình ảnh về sản phẩm </h5>
              <p className="fst-italic text-secondary pb-0 mb-0">
                Chỉ đăng ảnh thuộc dạng jpg/png.
              </p>
              <p className="fst-italic text-secondary pb-0 mb-0">
                Dung lượng ảnh phải bé hơn 10Mb.
              </p>
              <div className="file-uploader mt-4 ">
                <div className="uploader-header">
                  <h2 className="uploader-title">Tải ảnh lên</h2>
                  <h4 className="file-completed-status"> </h4>
                </div>
                <ul className="file-list"></ul>
                <div className="file-upload-box">
                  <div className="App p-3">
                    <div onClick={handleImageClick}>
                      {img ? (
                        <img
                          className="img-fluid"
                          src={URL.createObjectURL(img)}
                          alt="uploadimage"
                        />
                      ) : (
                        <img
                          className="img-fluid"
                          src={require("../../assets/img/upload-product/photo.png")}
                          alt="uploadimage"
                        />
                      )}
                      <input
                        type="file"
                        ref={inputRef}
                        onChange={(e) => handleImageChange(e)}
                        style={{ display: "none" }}
                        alt="click here to upload image"
                        accept=".jpg, .png"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8 com-md-8 px-5">
            <form onSubmit={handleSubmit}>
              <div className="py-2 fw-bold">Danh mục tin đăng </div>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="form-select select"
              >
                <option value="1">Đồ điện tử</option>
                <option value="2">Đồ dùng học tập</option>
                <option value="3">Điện lạnh</option>
                <option value="4">Đồ gia dụng, nội thất</option>
                <option value="5">Đồ ăn, thực phẩm</option>
                <option value="6">Thời trang</option>
                <option value="7">Giải trí, thể thao, sở thích</option>
              </select>
              <div className="pt-4 pb-1 fw-bold">Thông tin chi tiết</div>

              <div className="row">
                <div className="col-md">
                  <div className="input-group mb-3">
                    <span className="input-group-text">
                      Tình trạng sản phẩm{" "}
                    </span>
                    <select
                      required
                      value={isNew}
                      onChange={(e) => setIsNew(e.target.value)}
                      className="form-select select"
                    >
                      <option value="True">Mới</option>
                      <option value="False">Cũ</option>
                    </select>
                  </div>
                </div>
                <div className="col-md">
                  <div className="input-group mb-3">
                    <span className="input-group-text">Loại giao dịch </span>
                    <select
                      required
                      value={dealType}
                      onChange={(e) => setDealType(e.target.value)}
                      className="form-select select"
                    >
                      <option value="false">Buôn bán</option>
                      <option value="true">Trao đổi</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text">Tên sản phẩm *</span>
                <input
                  required
                  type="text"
                  className="form-control"
                  placeholder="Tên sản phẩm"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">Giá mong muốn *</span>
                <input
                  required
                  type="number"
                  className="form-control"
                  placeholder="Giá (vnd)"
                  value={formatPrice(price)}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">Số lượng sản phẩm *</span>
                <input
                  required
                  type="number"
                  className="form-control"
                  placeholder="Số lượng sản phẩm"
                  value={storedQuantity}
                  min="1"
                  onChange={(e) => setStoredQuantity(e.target.value)}
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text">Mô tả chi tiết</span>
                <textarea
                  className="form-control text_mota"
                  placeholder=" - Xuất xứ, tình trạng chiếc điện thoại
                - Thời gian sử dụng
                - Bảo hành nếu có
                - Sửa chữa, nâng cấp, phụ kiện đi kèm
                - Chấp nhận thanh toán/ vận chuyển qua Chợ Tốt
                - Chính sách bảo hành, bảo trì, đổi trả hàng hóa/sản phẩm
                - Địa chỉ giao nhận, đổi trả hàng hóa/sản phẩm"
                  rows="10"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="container d-flex justify-content-end px-5 pt-3">
                <button type="submit" className="btn btn-warning">
                  Đăng tin
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default CreateProduct;
