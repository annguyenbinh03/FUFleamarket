import { React, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import SearchButton from "./component/SearchButton";
import AuthContext from "./context/AuthProvider";
import { getCategoryAPI } from "./api/category";

const UserDropdown = (authContainer) => {
  const auth = authContainer.auth;

  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const logout = (e) => {
    e.preventDefault();
    setAuth({});
    localStorage.removeItem("auth");
    const logged = false;
    setAuth({ logged });
    navigate("/");
  };

  // console.log(auth);
  return (
    <span>
      <div className="btn-group user-dropdown">
        {auth?.email ? (
          <>
            <button
              className="btn btn-secondary d-flex align-items-center dropdown-toggle bg-transparent "
              type="button"
              data-bs-toggle="dropdown"
              data-bs-auto-close="true"
              aria-expanded="false"
            >
              <img
                className="userLogo mx-1 img-fluid"
                src={auth.avarta}
                alt=""
              />
              <div className="fs-5 username px-1 hidden-md">
                {auth.fullName}
              </div>
            </button>
          </>
        ) : (
          <>
            <Link
              className="btn btn-secondary d-flex align-items-center bg-transparent"
              style={{ border: "none" }}
              to="/login"
            >
              <img
                className="userLogo mx-1 img-fluid"
                src={`../assets/img/icon/login-google.png`}
                alt=""
              />
              <span className="fs-5 username px-1">
                <div className="loginLink">Đăng nhập</div>
              </span>
            </Link>
          </>
        )}
        <ul style={{ padding: 0 }} className="dropdown-menu">
          {auth.email ? (
            <>
              <div className="ps-3 pe-3 py-2 bg-body-secondary fw-bold">
                Quản lý đơn hàng
              </div>
              <li>
                <div className="d-flex justify-content-between align-items-center">
                  <Link to="/buy-order-request" className="dropdown-item">
                    <img
                      className="ps-1 me-2"
                      width="25px"
                      src={`../assets/img/icon/trade.png`}
                      alt="sofaIcon"
                    />
                    Yêu cầu mua hàng
                  </Link>
                </div>
              </li>
              <li>
                <div className="d-flex justify-content-between align-items-center">
                  <Link to="/trading-order-request" className="dropdown-item">
                    <img
                      className="ps-1 me-2"
                      width="25px"
                      src={`../assets/img/icon/trade-goods.png`}
                      alt="sofaIcon"
                    />
                    Yêu cầu trao đổi
                  </Link>
                </div>
              </li>
              <li>
                <div className="d-flex justify-content-between align-items-center">
                  <Link to="/buy-order" className="dropdown-item">
                    <img
                      className="ps-1 me-2"
                      width="25px"
                      src={`../assets/img/icon/completed-task.png`}
                      alt="sofaIcon"
                    />
                    Đơn mua hàng
                  </Link>
                </div>
              </li>
              <li>
                <div className="d-flex justify-content-between align-items-center">
                  <Link to="/trading-order" className="dropdown-item">
                    <img
                      className="ps-1 me-2"
                      width="25px"
                      src={`../assets/img/icon/checklist.png`}
                      alt="sofaIcon"
                    />
                    Đơn trao đổi
                  </Link>
                </div>
              </li>
              <li>
                <div className="ps-3 pe-4 py-2 bg-body-secondary fw-bold">
                  Dịch vụ trả phí
                </div>
              </li>
              <li>
                <div className="d-flex justify-content-between align-items-center">
                  <Link to="/my-selling-package" className="dropdown-item">
                    <img
                      className="ps-1 me-2"
                      width="25px"
                      src={`../assets/img/icon/vip-card.png`}
                      alt="sofaIcon"
                    />
                    Quản lý gói bán hàng
                  </Link>
                </div>
              </li>
              <li>
                <div className="ps-3 pe-4 py-2 bg-body-secondary fw-bold">
                  Khác
                </div>
              </li>
              <li>
                <div className="d-flex justify-content-between align-items-center">
                  <Link
                    className="dropdown-item"
                    to={`/shopprofile/${auth?.id}`}
                  >
                    <img
                      className="ps-1 me-2"
                      width="25px"
                      src={`../assets/img/icon/social-network.png`}
                      alt="sofaIcon"
                    />
                    Xem trang cá nhân
                  </Link>
                </div>
              </li>
              <li>
                <div className="d-flex justify-content-between align-items-center">
                  <Link className="dropdown-item" to={`/settings`}>
                    <img
                      className="ps-1 me-2"
                      width="25px"
                      src={`../assets/img/icon/user-setting.png`}
                      alt="sofaIcon"
                    />
                    Cài đặt người dùng
                  </Link>
                </div>
              </li>
              <li>
                <div className="d-flex justify-content-between align-items-center">
                  <Link className="dropdown-item" onClick={(e) => logout(e)}>
                    <img
                      className="ps-1 me-2"
                      width="25px"
                      src={`../assets/img/icon/turn-off.png`}
                      alt="sofaIcon"
                    />
                    Đăng xuất
                  </Link>
                </div>
              </li>
            </>
          ) : (
            <></>
          )}
        </ul>
      </div>
    </span>
  );
};

const Header = () => {
  const { auth } = useContext(AuthContext);
  const [categories, setCategories] = useState();
  const fetchCategories = async () => {
    const response = await getCategoryAPI();
    if (response) {
      setCategories(response);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <div>
      <header className="header container-fluid  d-flex flex-row justify-content-between align-items-center px-2 py-1">
        <div className="logo p-2  hidden-md">
          <Link to="/">
            <img
              className="img-fluid"
              src={`../assets/img/logo.png`}
              alt="logo"
            />
          </Link>
        </div>

        {/* Menu danh mục */}
        <div className="dropdown ">
          <button type="button" className="btn dropdown-toggle text-white fs-5">
            <i className="fa fa-list" aria-hidden="true"></i>
            <span> Danh mục </span>
          </button>
          <ul className="dropdown-menu ">
            {categories?.map((category) => (
              <li key={category.categoryId}>
                <Link
                  to={`/search-product/${category.categoryId}`}
                  className="dropdown-item py-2"
                >
                  <img
                    className="me-2"
                    width="28px"
                    src={category?.iconLink}
                    alt={category.name}
                  />
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Nút tìm kiếm */}
        <SearchButton />

        {/* Nút thông báo, tin nhắn, yêu thích */}
        <div className="text-center">
          <button className="col-md-4 me-2 btn fs-5 text-white">
            <Link className="text-white" to="/chat">
              {" "}
              <i className="fa fa-comments-o" aria-hidden="true"></i>{" "}
            </Link>
          </button>
          <button className="col-md-4 ms-1 btn fs-5 text-white">
            <Link className="text-white" to="/wishlist">
              <i className="fa fa-heart" aria-hidden="true"></i>
            </Link>
          </button>
        </div>

        {/* Menu dropdown người dùng */}
        <UserDropdown auth={auth} />

        {/* Nút đăng bài */}
        <button className="btn fs-5 text-white">
          <Link
            to="/my-products"
            className="text-decoration-none"
            style={{ color: "white" }}
          >
            <i className="fa fa-list-alt pe-2" aria-hidden="true"></i>
            <span className="hidden-md">Quản lý tin</span>
          </Link>
        </button>

        {/* Nút đăng sản phẩm */}
        <Link to="/create-product">
          <button className="btn mx-2 text-white fs-5 upPostBtn">
            <i className="fa fa-pencil-square-o" aria-hidden="true"></i>{" "}
            <span className="hidden-md"> Đăng tin </span>
          </button>
        </Link>
      </header>
    </div>
  );
};

export default Header;
