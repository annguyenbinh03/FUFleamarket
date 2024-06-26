import React from "react";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <div>
            <footer className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="footer__about">                          
                                <ul>
                                    <li>Địa chỉ: Lô E2a-7, Đường D1, Khu Công nghệ cao, P.Long Thạnh Mỹ, Tp. Thủ Đức, TP.HCM.</li>
                                    <li>Phone: (028) 7300 5588</li>
                                    <li>Email: daihoc.hcm@fpt.edu.vn</li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-sm-6">
                            <div className="footer__widget">
                                <h6>Useful Links</h6>
                                <ul>
                                    <li>
                                        <Link to={'/aboutUs'}>
                                            About Us
                                        </Link>
                                    </li>
                                    <li><Link href="#">Secure Shopping</Link></li>
                                    <li><Link href="#">Privacy Policy</Link></li>
                                    <li><Link href="#">Our Sitemap</Link></li>
                                </ul>
                                <ul>
                                    <li><Link href="#">Who We Are</Link></li>
                                    <li><Link href="#">Our Services</Link></li>
                                    <li><Link href="#">Projects</Link></li>
                                    <li><Link href="#">Contact</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4">
                            <div className="footer__widget">
                                <h6>Follow Us Now</h6>
                                <div className="footer__about__logo">
                                    <a href="./index.html"><img className="w-50" src="assets/img/logo.png" alt="" /></a>
                                </div>
                                <div className="footer__widget__social mt-4">
                                    <a href="https://www.facebook.com/people/S%E1%BB%A9c-S%E1%BB%91ng-Xanh/100093187681220/" rel="noreferrer"><i className="fa fa-facebook"></i></a>
                                    <a href="#" rel="noreferrer"><i className="fa fa-instagram"></i></a>
                                    <a href="#" rel="noreferrer"><i className="fa fa-twitter"></i></a>
                                    <a href="#" rel="noreferrer"><i className="fa fa-pinterest"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="footer__copyright">
                                <div className="footer__copyright__text">
                                    <p>
                                        Copyright ©
                                        <script>document.write(new Date().getFullYear());</script> GPMXH: Chưa có giấy phép do Bộ Thông tin và Truyền thông cấp
                                    </p>

                                </div>
                                <div className="footer__copyright__payment"><img src="assets/img/payment-item.png" alt="" /></div>
                            </div>
                        </div>
                    </div>
                    <div className="row">

                    </div>
                </div>
            </footer>


        </div>
    )
}

export default Footer