import { React, useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import MyPostButton from "./component/MyPostButton";
import UploadProductButton from "./component/UploadProductButton";
import SearchButton from "./component/SearchButton";
import AuthContext from "./context/AuthProvider";

const UserDropdown = (auth) => {
  console.log(auth?.accessToken);
  console.log(auth?.accessToken ? true : false);
  return (
    <span>
      <div className="btn-group user-dropdown">
        <button
          className="btn btn-secondary dropdown-toggle bg-transparent"
          type="button"
          data-bs-toggle="dropdown"
          data-bs-auto-close="true"
          aria-expanded="false"
        >
          {!auth ? (
            <>
              <img
                className="userLogo mx-1 img-fluid"
                src="https://cdn.chotot.com/uac2/27021569"
                alt=""
              />
              <span className="fs-5 username">{auth.email}</span>
            </>
          ) : (
            <>
              <img
                className="userLogo mx-1 img-fluid"
                src="https://lh3.googleusercontent.com/a/ACg8ocIV43KaoeO09BZ0VJu16ByZhLijy8X_oW3I8jnQmEqNoYUt6-Y=s288-c-no"
                alt=""
              />
              <span className="fs-5 username">Đăng nhập</span>
            </>
          )}
        </button>
        <ul style={{ padding: 0 }} className="dropdown-menu">
          {!auth ? (
            <>
              <li>
                <div className="d-flex justify-content-between align-items-center ps-3">
                  <Link to="/buy-order" className="dropdown-item">
                    Đơn mua
                  </Link>
                </div>
              </li>
              <li>
                <div className="d-flex justify-content-between align-items-center ps-3">
                  <Link to="/sell-order" className="dropdown-item">
                    Đơn bán
                  </Link>
                </div>
              </li>
              <li>
                <div className="ps-3 pe-4 py-2 bg-body-secondary fw-bold">
                  Khác
                </div>
              </li>
              <li>
                <div className="d-flex justify-content-between align-items-center ps-3">
                  <Link className="dropdown-item" to="#">
                    Cài đặt tài khoản
                  </Link>
                </div>
              </li>
              <li>
                <div className="d-flex justify-content-between align-items-center ps-3">
                  <Link className="dropdown-item" href="#">
                    Trợ giúp
                  </Link>
                </div>
              </li>
              <li>
                <div className="d-flex justify-content-between align-items-center ps-3">
                  <Link className="dropdown-item" href="#">
                    Đóng góp ý kiến
                  </Link>
                </div>
              </li>
              <li>
                <div className="d-flex justify-content-between align-items-center ps-3">
                  <Link className="dropdown-item" href="#">
                    Đăng xuất
                  </Link>
                </div>
              </li>
            </>
          ) : (
            <>
              <li>
                <div className="d-flex justify-content-between align-items-center ps-3">
                  <Link className="dropdown-item" to="/login">
                    Đăng nhập
                  </Link>
                </div>
              </li>
              <li>
                <div className="d-flex justify-content-between align-items-center ps-3">
                  <a className="dropdown-item" href="#">
                    Đăng ký
                  </a>
                </div>
              </li>
              <li>
                <div className="d-flex justify-content-between align-items-center ps-3">
                  <Link to="/buy-order" className="dropdown-item">
                    Đơn mua
                  </Link>
                </div>
              </li>
              <li>
                <div className="d-flex justify-content-between align-items-center ps-3">
                  <Link to="/sell-order" className="dropdown-item">
                    Đơn bán
                  </Link>
                </div>
              </li>
            </>
          )}
        </ul>
      </div>
    </span>
  );
};

const Header = () => {
  const { auth } = useContext(AuthContext);

  return (
    <div>
      <header className="header container-fluid  d-flex flex-row justify-content-between align-items-center px-2 py-1">
        <div className="logo p-2">
          <Link to="/">
            <img className="img-fluid" src="assets/img/logo.png" alt="logo" />
          </Link>
        </div>

        {/* Menu danh mục */}
        <div className="btn-group dropdown ">
          <button
            type="button"
            className="btn dropdown-toggle text-white fs-5"
            id="autoDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-list" aria-hidden="true"></i>
            <span> Danh mục </span>
          </button>
          <ul className="dropdown-menu ">
            <li>
              <Link to="/search-product/1" className="dropdown-item py-2">
                <i className="fa fa-desktop me-2" aria-hidden="true"></i> Đồ
                điện tử
              </Link>
            </li>
            <li>
              <Link to="/search-product/2" className="dropdown-item py-2">
                <i className="fa fa-book me-2" aria-hidden="true"></i> Đồ dùng
                học tập
              </Link>
            </li>
            <li>
              <Link to="/search-product/3" className="dropdown-item py-2">
                <img
                  width="20px"
                  src="assets/img/icon/fridge.png"
                  alt="frideIcon"
                />
                Điện lạnh
              </Link>
            </li>
            <li>
              <Link to="/search-product/4" className="dropdown-item py-2">
                <img
                  width="20px"
                  src="assets/img/icon/sofa.png"
                  alt="sofaIcon"
                />
                Đồ gia dụng, nội thất
              </Link>
            </li>
            <li>
              <Link to="/search-product/5" className="dropdown-item py-2">
                <i className="fa fa-cutlery me-2" aria-hidden="true"></i> Đồ ăn,
                thực phẩm
              </Link>
            </li>
            <li>
              <Link to="/fashion" className="dropdown-item py-2">
                <img
                  width="20px"
                  src="assets/img/icon/woman-clothes.png"
                  alt="sofaIcon"
                />
                Thời trang
              </Link>
            </li>
            <li>
              <Link to="/search-product/6" className="dropdown-item py-2">
                <img
                  width="20px"
                  src="assets/img/icon/console.png"
                  alt="sofaIcon"
                />
                Giải trí, thể thao, sở thích
              </Link>
            </li>
          </ul>
        </div>

        {/* Nút tìm kiếm */}
        <SearchButton />

        {/* Nút thông báo, tin nhắn, yêu thích */}
        <div className="">
          <button className="btn fs-5 text-white">
            <i className="fa fa-bell" aria-hidden="true"></i>
          </button>
          <button className="btn fs-5 text-white">
            <i className="fa fa-comments-o" aria-hidden="true"></i>
          </button>
          <button className="btn fs-5 text-white">
            <i className="fa fa-heart" aria-hidden="true"></i>
          </button>
        </div>

        {/* Menu dropdown người dùng */}
        <UserDropdown auth={auth} />

        {/* Nút đăng bài */}
        <MyPostButton />

        {/* Nút đăng sản phẩm */}
        <UploadProductButton />
      </header>
    </div>
  );
};

export default Header;
