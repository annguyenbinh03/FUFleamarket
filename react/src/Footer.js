import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div>
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-5 col-sm-6">
              <div className="footer-about">
                <ul>
                  <li>
                    Địa chỉ: Lô E2a-7, Đường D1, Khu Công nghệ cao, P.Long Thạnh
                    Mỹ, Tp. Thủ Đức, TP.HCM.
                  </li>
                  <li>Phone: 086 839 0406</li>
                  <li>Email: annbse170470@fpt.edu.vn</li>
                </ul>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="footer-widget">
                <h6>Về chúng tôi</h6>
                <ul>
                  <li>
                    <Link to="/aboutUs">Giới thiệu</Link>
                  </li>
                </ul>
                <ul>
                  <li>
                    <Link tp="#">Câu hỏi thường gặp</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-md-4">
              <div className="footer-widget">
                <h6>Follow Us Now</h6>
                <div className="footer-widget-social mt-4">
                  <a
                    href="https://www.facebook.com/profile.php?id=61562800665471"
                    rel="noreferrer"
                  >
                    <i className="fa fa-facebook"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="footer-copyright">
                <div className="footer-copyright-text">
                  <p>
                    Copyright ©
                    <script>document.write(new Date().getFullYear());</script>{" "}
                    GPMXH: Chưa có giấy phép do Bộ Thông tin và Truyền thông cấp
                  </p>
                </div>
                <div className="footer-copyright-payment">
                  <img className="h-100" src="assets/img/logo-vnpay.png" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="row"></div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
