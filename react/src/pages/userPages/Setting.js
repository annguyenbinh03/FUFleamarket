import React, { useContext, useEffect, useRef, useState } from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import AuthContext from "../../context/AuthProvider";
import { editUserProfileAPI, getUserSettings } from "../../api/user";
import { imageDb } from "../../FirebaseImage/Config";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { toast } from "react-toastify";

const Setting = () => {
  const { auth } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [address, setAddress] = useState("");
  const [acceptedTradingPercent, setAcceptedTradingPercent] = useState(0);
  const [fetchAvarta, setAvarta] = useState("");
  const [img, setImg] = useState("");
  const inputRef = useRef(null);

  const fetchShopInfo = async () => {
    try {
      const response = await getUserSettings(auth.accessToken);
      if (response) {
        setUserInfo(response);
        setFullName(response.fullName ?? "");
        setPhoneNumber(response.phoneNumber ?? "");
        setIntroduction(response.introduction ?? "");
        setAddress(response.address ?? "");
        setAcceptedTradingPercent(response.acceptedTradingPercent ?? "");
        setAvarta(response.avarta);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
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

  const showSuccessToast = (message, closeTime) => {
    toast.success(message, {
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

  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleUploadImagesClick = async () => {
    if (img !== null) {
      const imgRef = ref(imageDb, `userAvatars/${v4()}`);
      const value = await uploadBytes(imgRef, img);
      const url = await getDownloadURL(value.ref);
      return url;
    } else {
      alert("Ảnh đại diện sản phẩm phải được đăng tải");
      return "";
    }
  };

  const handleImageChange = async (event) => {
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

  const checkValidation = () => {
    var check = true;
    if (fullName !== null) {
      if (fullName.length < 1 || fullName.length > 30) {
        showErrorToast("Tên phải bé hơn 30 kí tự");
        check = false;
      }
    } else {
      if (fullName === null) {
        showErrorToast("Tên không được trống");
        check = false;
      }
    }
    if (phoneNumber !== null) {
      if (phoneNumber.length > 20) {
        showErrorToast("Số điện thoại không được quá 20 kí tự");
        check = false;
      }
    }
    if (address !== null) {
      if (address.length > 255) {
        showErrorToast("Địa chỉ không được quá 255 kí tự");
        check = false;
      }
    }
    if (introduction !== null) {
      if (introduction.length > 200) {
        showErrorToast("Giới thiệu không đươc quá 255 kí tự");
        check = false;
      }
    }
    if (acceptedTradingPercent !== null) {
      if (acceptedTradingPercent < 1 || acceptedTradingPercent > 100) {
        showErrorToast(
          "Mức chênh lệch trao đổi không được bé hơn 1% hoặc lớn hơn 100%"
        );
        check = false;
      }
    } else {
      showErrorToast("Mức chênh lệch trao đổi không được trống");
      check = false;
    }
    return check;
  };

  const handleSumbmitSave = async (e) => {
    e.preventDefault();
    if (!checkValidation()) {
      return;
    }
    var avarta = fetchAvarta;
    if (img !== "") {
      avarta = await handleUploadImagesClick();
    }
    if (avarta !== "") {
      const user = {
        fullName,
        phoneNumber,
        introduction,
        avarta,
        address,
        acceptedTradingPercent,
      };
      const response = await editUserProfileAPI(auth.accessToken, user);
      if (response) {
        showSuccessToast("Cập nhật thông tin thành công!");
        setAvarta(avarta);
        auth.fullName = fullName;
        auth.avarta = avarta;
        fetchShopInfo();
      } else {
        showErrorToast("Cập nhật thông tin thất bại!");
      }
    } else {
      showErrorToast("Cập nhật thông tin thất bại, không tìm thấy ảnh!");
    }
  };

  useEffect(() => {
    fetchShopInfo();
  }, []);

  return (
    <div>
      <Header />
      <section className="settings spad">
        <div style={{ minHeight: "700px" }} className="container py-4 d-flex">
          <div
            className="col-lg-4 mx-1 bg-white p-3"
            style={{ fontSize: "1.1em" }}
          >
            <div className="d-flex justify-content-center">
              <img
                className="w-75 rounded"
                src={img ? URL.createObjectURL(img) : fetchAvarta}
                alt="avarta"
              />
            </div>
            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-primary"
                onClick={() => handleImageClick()}
              >
                Thay đổi ảnh đại diện
              </button>
              <input
                type="file"
                ref={inputRef}
                onChange={(e) => handleImageChange(e)}
                style={{ display: "none" }}
                alt="click here to upload image"
                accept=".jpg, .png"
              />
            </div>

            <div className="fs-5 fw-bold mt-3 mb-3 text-center">
              {userInfo?.fullName}
            </div>

            <div className="mb-1">
              <div className="text-body-secondary text-center">
                <i
                  className="fa fa-calendar-check-o"
                  style={{ minWidth: "20px" }}
                  aria-hidden="true"
                ></i>{" "}
                Đã tham gia FUFM vào{" "}
              </div>
            </div>
            <div className="text-center">
              {" "}
              {removeTimeFromISOString(userInfo?.createdDate)}
            </div>
          </div>

          <div className="col-lg-8 mx-1 bg-white p-3 rounded px-4">
            <div className="row">
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Email
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={userInfo?.email}
                  aria-describedby="basic-addon1"
                  disabled
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Tên
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={fullName}
                  placeholder="Username"
                  aria-describedby="basic-addon1"
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Số điện thoại
                </span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Hãy cập nhật số điện thoại để liên lạc với người mua hoặc bán"
                  aria-describedby="basic-addon1"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Địa chỉ
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Hãy cập nhật số địa chỉ để liên lạc với người mua hoặc bán"
                  aria-describedby="basic-addon1"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">Giới thiệu</span>
                <textarea
                  className="form-control"
                  aria-label="With textarea"
                  placeholder="Giới thiệu bản thân"
                  rows="5"
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                ></textarea>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                  Mức chênh lệch trao đổi cho phép (%)
                </span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Username"
                  aria-describedby="basic-addon1"
                  value={acceptedTradingPercent}
                  onChange={(e) => setAcceptedTradingPercent(e.target.value)}
                />
              </div>
            </div>
            <div className="row">
              <div className="mt-3 d-flex justify-content-end">
                <button
                  className="btn btn-warning me-4"
                  onClick={(e) => handleSumbmitSave(e)}
                >
                  Thay đổi hồ sơ
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Setting;
