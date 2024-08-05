import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../../Footer";
import Header from "../../Header";
import { editUserProfileAPI, getShopProfileAPI } from "../../api/user";
import { Link as LinkRouter } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import { imageDb } from "../../FirebaseImage/Config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { toast } from "react-toastify";

function ShopProfile() {
  const { userId } = useParams();

  const { auth } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState();
  const [products, setProducts] = useState();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [img, setImg] = useState("");
  const inputRef = useRef(null);

  const fetchShopInfo = async () => {
    try {
      const response = await getShopProfileAPI(userId);
      setProducts(response.products);
      setUserInfo(response.user);
      setFullName(response.user?.fullName ?? "");
      setPhoneNumber(response.user?.phoneNumber ?? "");
      setDescription(response.user?.introduction ?? "");
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchShopInfo();
    }
  }, [userId]);

  const formatPrice = (value) => {
    return value.toLocaleString("vi-VN");
  };

  function removeTimeFromISOString(isoString) {
    if (isoString) {
      const index = isoString.indexOf("T");
      if (index !== -1) {
        var string = isoString.slice(0, index);
        string += " ";
        string += isoString.slice(index + 1, index + 6);
        return string;
      }
    }
    return isoString;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    var urlImg;
    if (img !== null) {
      urlImg = await handleUploadImagesClick();
    } else {
      urlImg = userInfo?.avarta;
    }
    if (urlImg !== "") {
      var avarta = urlImg;
      var introduction = description;
      const user = { fullName, phoneNumber, introduction, avarta };
      const response = await editUserProfileAPI(auth.accessToken, user);
      if (response) {
        toast.success("Cập nhật thông tin thành công!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        fetchShopInfo();
      } else {
        toast.error("Cập nhật thông tin thất bại!", {
          position: "bottom-right",
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } else {
      toast.error("Cập nhật thông tin thất bại, không tìm thấy ảnh!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
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
    if (event.target.files[0]) {
      setImg(event.target.files[0]);
    }
  };

  return (
    <div>
      <Header />
      <section className="shopProfile spad">
        <div className="container py-4 d-flex">
          <div
            className="col-lg-4 mx-1 bg-white p-3"
            style={{ fontSize: "1.1em" }}
          >
            <div className="text-center">
              <img
                className="img-fluid w-75 rounded-5 p-1"
                src={
                  userInfo?.avarta ||
                  "https://i.pinimg.com/originals/d9/b8/3a/d9b83aa1a08be3e46ebb47254db8cf75.jpg"
                }
                alt="shop avarta"
              />
            </div>
            <div className="fs-5 fw-bold mt-3">{userInfo?.fullName}</div>
            {/* {auth.logged && userId === auth?.id?.toString() ? (
              <button className="btn text-white fw-bold btn-secondary disabled my-2 w-100">
                <i className="fa fa-comments-o" aria-hidden="true"></i> Chat
                ngay
              </button>
            ) : (
              <button className="btn text-white fw-bold btn-danger my-2 w-100">
                <i className="fa fa-comments-o" aria-hidden="true"></i> Chat
                ngay
              </button>
            )} */}

            <div className="mb-2">
              <span className="text-body-secondary">
                <i
                  className="fa fa-info-circle"
                  style={{ minWidth: "20px" }}
                  aria-hidden="true"
                ></i>{" "}
                Giới thiệu:{" "}
              </span>
              {userInfo?.introduction || " "}
            </div>
            <div className="mb-1">
              <span className="text-body-secondary">
                <i
                  className="fa fa-calendar-check-o "
                  style={{ minWidth: "20px" }}
                  aria-hidden="true"
                ></i>{" "}
                Đã tham gia:{" "}
              </span>
              {removeTimeFromISOString(userInfo?.createdDate) || " "}
            </div>
            {/* <div className="mb-1">
              <span className="text-body-secondary">
                <i
                  className="fa fa-phone-square"
                  style={{ minWidth: "20px" }}
                  aria-hidden="true"
                ></i>{" "}
                Số điện thoại:{" "}
              </span>
              {userInfo?.phoneNumber || "Người dùng này chưa cài số điện thoại"}
            </div>
            <div className="mb-1">
              <span className="text-body-secondary">
                <i
                  className="fa fa-map-marker"
                  style={{ minWidth: "20px" }}
                  aria-hidden="true"
                ></i>{" "}
                Địa chỉ:
              </span>{" "}
              {userInfo?.addresses?.[0]?.specificAddress ||
                "Người dùng này chưa cài địa chỉ"}
            </div> */}
            {auth.logged && userId === auth?.id?.toString() ? (
              <div className="d-flex justify-content-center w-100">
                <button
                  type="button"
                  className="btn btn-primary px-4 mt-4 w-75"
                  data-bs-toggle="modal"
                  data-bs-target="#editProfile"
                >
                  Chỉnh sửa thông tin
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="col-lg-8 mx-1 bg-white p-3 rounded">
            <div className="text-center text-danger fs-5 fw-bold border-bottom border-danger bg-opacity-10  border-3 mb-2">
              Đang bán
            </div>
            <div className="row">
              {products?.map((product) => (
                <div
                  className="col-lg-3 col-md-4 col-sm-6 px-0"
                  key={product.productId}
                >
                  <div className="product">
                    <div
                      className="product-picture set-bg"
                      style={{
                        backgroundImage: `url(${
                          product?.imageLink ||
                          "https://i.pinimg.com/originals/d9/b8/3a/d9b83aa1a08be3e46ebb47254db8cf75.jpg"
                        })`,
                      }}
                    >
                      <ul className="product-picture-hover">
                        <li>
                          <LinkRouter to={`/detail/${product.productId}`}>
                            <i className="fa fa-heart"></i>
                          </LinkRouter>
                        </li>
                        <li>
                          <LinkRouter to={`/detail/${product.productId}`}>
                            <i className="fa fa-search"></i>
                          </LinkRouter>
                        </li>
                      </ul>
                    </div>
                    <div className="product-text">
                      <h6>
                        <LinkRouter
                          className="product-text-name"
                          to={`/detail/${product.productId}`}
                        >
                          {product.productName}
                        </LinkRouter>
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
                              <span className="ms-1">
                                {product.createDate}
                              </span>
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
          </div>
        </div>
      </section>
      <div
        className="modal fade"
        id="editProfile"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">
                {" "}
                <i
                  className="fa fa-pencil-square-o me-2"
                  aria-hidden="true"
                ></i>{" "}
                Chỉnh sửa thông tin
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="row d-flex justify-content-center">
                <div className="col-md-4">
                  <div className="file-uploader d-flex justify-content-center align-items-center flex-column">
                    <div className="uploader-header w-100">
                      <h2 className="uploader-title">Tải ảnh lên</h2>
                      <h4 className="file-completed-status"> </h4>
                    </div>
                    <ul className="file-list"></ul>
                    <div className="file-upload-box j w-75">
                      <div className="p-3">
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
                              src={
                                userInfo?.avarta ??
                                require("../../assets/img/upload-product/photo.png")
                              }
                              alt="uploadimage"
                            />
                          )}
                          <input
                            type="file"
                            ref={inputRef}
                            onChange={(e) => handleImageChange(e)}
                            style={{ display: "none" }}
                            alt="click here to upload image"
                            accept="image/*"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-8 p-3">
                  <div className="input-group input-group-lg mb-3">
                    <span
                      className="input-group-text"
                      style={{ minWidth: "150px" }}
                    >
                      Họ và tên
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`${fullName ? "" : "Nhập vào tên"}`}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="input-group input-group-lg mb-3 ">
                    <span
                      className="input-group-text"
                      style={{ minWidth: "150px" }}
                    >
                      Email
                    </span>
                    <input
                      type="text"
                      className="form-control readonly Disabled "
                      placeholder={`${userInfo?.email ?? ""}`}
                      disabled
                    />
                  </div>
                  <div className="input-group input-group-lg mb-3 ">
                    <span
                      className="input-group-text"
                      style={{ minWidth: "150px" }}
                    >
                      Số điện thoại
                    </span>
                    <input
                      type="text"
                      className="form-control disable"
                      placeholder={`${phoneNumber ? "" : "Thêm số điện thoại"}`}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  <div className="input-group input-group-lg mb-3 ">
                    <span
                      className="input-group-text"
                      style={{ minWidth: "150px" }}
                    >
                      Giới thiệu
                    </span>
                    <textarea
                      type="text"
                      className="form-control"
                      placeholder={`${description ? "" : "Thêm giới thiệu"}`}
                      rows="5"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn btn-primary px-4"
                data-bs-dismiss="modal"
                onClick={(e) => handleSubmit(e)}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ShopProfile;
