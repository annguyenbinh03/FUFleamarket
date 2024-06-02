// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// function AdminProcessRequest() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     // Gọi API để lấy tất cả sản phẩm
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           "https://localhost:7057/api/product" // Thay thế bằng API của bạn
//         );
//         setProducts(response.data);
//       } catch (error) {
//         console.error("Lỗi khi gọi API:", error);
//       }
//     };

//     fetchData(); // Gọi fetchData ngay khi component được mount
//   }, []);

//   const handleApproveProduct = async (productId) => {
//     try {
//       await axios.put(
//         `https://localhost:7057/api/product/${productId}/approve` // Thay thế bằng API của bạn
//       );
//       // Cập nhật lại danh sách sản phẩm sau khi duyệt
//       const updatedProducts = products.map((product) =>
//         product.productId === productId ? { ...product, status: "Approved" } : product
//       );
//       setProducts(updatedProducts);
//     } catch (error) {
//       console.error("Lỗi khi duyệt sản phẩm:", error);
//     }
//   };

//   const handleRejectProduct = async (productId) => {
//     try {
//       await axios.put(
//         `https://localhost:7057/api/product/${productId}/reject` // Thay thế bằng API của bạn
//       );
//       // Cập nhật lại danh sách sản phẩm sau khi loại bỏ
//       const updatedProducts = products.filter(
//         (product) => product.productId !== productId
//       );
//       setProducts(updatedProducts);
//     } catch (error) {
//       console.error("Lỗi khi loại bỏ sản phẩm:", error);
//     }
//   };

//   return (
//     <div className="container-scroller">
//       <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
//         {/* ... Phần code của navbar ... */}
//       </nav>

//       <div className="container-fluid page-body-wrapper">
//         <nav className="sidebar sidebar-offcanvas" id="sidebar">
//           {/* ... Phần code của sidebar ... */}
//         </nav>

//         <div className="main-panel">
//           <div className="content-wrapper">
//             <div className="page-header">
//               <div className="col-lg-12 grid-margin stretch-card">
//                 <div className="card">
//                   <div className="card-body">
//                     <h4 className="card-title">Sản phẩm đang chờ duyệt</h4>
//                     <p className="card-description">
//                       Danh mục các sản phẩm <code>đang chờ duyệt</code>
//                     </p>
//                     <table className="table text-center table-bordered">
//                       <thead>
//                         <tr>
//                           <th> Người bán </th>
//                           <th> Tên Người Bán </th>
//                           <th> Tên sản phẩm </th>
//                           <th> Tình trạng </th>
//                           <th> Giá </th>
//                           <th> Mô tả </th>
//                           <th> Loại sản phẩm </th>
//                           <th> Xem ảnh </th>
//                           <th> Hành động </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {products.map((product) => (
//                           <tr key={product.productId}>
//                             <td className="py-1">
//                               <img
//                                 src={product.sellerAvatar} // Thay thế bằng URL ảnh của người bán
//                                 alt="image"
//                               />
//                             </td>
//                             <td>{product.sellerName}</td>
//                             <td>{product.productName}</td>
//                             <td>{product.status}</td>
//                             <td>${product.price.toFixed(2)}</td>
//                             <td style={{ maxWidth: "310px" }}>
//                               {product.description}
//                             </td>
//                             <td>{product.category}</td>
//                             <td>
//                               <Link
//                                 to={`/detail/${product.productId}`}
//                                 className="btn btn-sm btn-info"
//                               >
//                                 Xem ảnh
//                               </Link>
//                             </td>
//                             <td>
//                               <button
//                                 className="btn btn-sm btn-info"
//                                 onClick={() => handleApproveProduct(product.productId)}
//                               >
//                                 Duyệt
//                               </button>{" "}
//                               <button
//                                 className="btn btn-sm btn-danger"
//                                 onClick={() => handleRejectProduct(product.productId)}
//                               >
//                                 Loại bỏ
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminProcessRequest;




import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { Link } from "react-router-dom";

function AdminProcessRequest() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Gọi API để lấy tất cả sản phẩm
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7057/api/product" // Thay thế bằng API của bạn
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };

    fetchData(); // Gọi fetchData ngay khi component được mount
  }, []);

  return (
    <div className="container-scroller">
      <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        {/* ... Phần code của navbar ... */}
      </nav>

      <div className="container-fluid page-body-wrapper">
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
          <ul className="nav">
            <li className="nav-item nav-profile">
              <a href="#" className="nav-link">
                <div className="nav-profile-image">
                  <img src="/img/faces/face1.jpg" alt="profile" />
                  <span className="login-status online"></span>
                  {/* <!--change to offline or busy as needed--> */}
                </div>
                <div className="nav-profile-text d-flex flex-column">
                  <span className="font-weight-bold mb-2">David Grey. H</span>
                  <span className="text-secondary text-small">
                    Project Manager
                  </span>
                </div>
                <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
              </a>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-link"> {/* Sử dụng Link */}
                <span className="menu-title">Dashboard</span>
                <i className="mdi mdi-home menu-icon"></i>
              </Link>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                data-bs-toggle="collapse"
                href="#ui-basic"
                aria-expanded="false"
                aria-controls="ui-basic"
              >
                <span className="menu-title">Basic UI Elements</span>
                <i className="menu-arrow"></i>
                <i className="mdi mdi-crosshairs-gps menu-icon"></i>
              </a>
              <div className="collapse" id="ui-basic">
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    {" "}
                    <a className="nav-link" href="../../pages/ui-features/buttons.html">
                      Buttons
                    </a>
                  </li>
                  <li className="nav-item">
                    {" "}
                    <a className="nav-link" href="../../pages/ui-features/typography.html">
                      Typography
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="../../pages/icons/mdi.html">
                <span className="menu-title">Icons</span>
                <i className="mdi mdi-contacts menu-icon"></i>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="../../pages/forms/basic_elements.html">
                <span className="menu-title">Forms</span>
                <i className="mdi mdi-format-list-bulleted menu-icon"></i>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="../../pages/charts/chartjs.html">
                <span className="menu-title">Charts</span>
                <i className="mdi mdi-chart-bar menu-icon"></i>
              </a>
            </li>
            <li className="nav-item active">
              <a className="nav-link" href="../../pages/tables/basic-table.html">
                <span className="menu-title">Sản phẩm</span>
                <i className="mdi mdi-table-large menu-icon"></i>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                data-bs-toggle="collapse"
                href="#general-pages"
                aria-expanded="false"
                aria-controls="general-pages"
              >
                <span className="menu-title">Sample Pages</span>
                <i className="menu-arrow"></i>
                <i className="mdi mdi-medical-bag menu-icon"></i>
              </a>
              <div className="collapse" id="general-pages">
                <ul className="nav flex-column sub-menu">
                  <li className="nav-item">
                    {" "}
                    <a className="nav-link" href="../../pages/samples/blank-page.html">
                      Blank Page{" "}
                    </a>
                  </li>
                  <li className="nav-item">
                    {" "}
                    <a className="nav-link" href="../../pages/samples/login.html">
                      Login{" "}
                    </a>
                  </li>
                  <li className="nav-item">
                    {" "}
                    <a className="nav-link" href="../../pages/samples/register.html">
                      Register{" "}
                    </a>
                  </li>
                  <li className="nav-item">
                    {" "}
                    <a className="nav-link" href="../../pages/samples/error-404.html">
                      404{" "}
                    </a>
                  </li>
                  <li className="nav-item">
                    {" "}
                    <a className="nav-link" href="../../pages/samples/error-500.html">
                      500{" "}
                    </a>
                  </li>
                </ul>
              </div>
            </li>
            <li className="nav-item sidebar-actions">
              <span className="nav-link">
                <div className="border-bottom">
                  <h6 className="font-weight-normal mb-3">Projects</h6>
                </div>
                <button className="btn btn-block btn-lg btn-gradient-primary mt-4">
                  + Add a project
                </button>
                <div className="mt-4">
                  <div className="border-bottom">
                    <p className="text-secondary">Categories</p>
                  </div>
                  <ul className="gradient-bullet-list mt-4">
                    <li>Free</li>
                    <li>Pro</li>
                  </ul>
                </div>
              </span>
            </li>
          </ul>
        </nav>

        <div className="main-panel">
          <div className="content-wrapper">
            <div className="page-header">
              <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Sản phẩm đang chờ duyệt</h4>
                    <p className="card-description">
                      Danh mục các sản phẩm <code>đang chờ duyệt</code>
                    </p>
                    <table className="table text-center table-bordered">
                      <thead>
                        <tr>
                          <th> Người bán </th>
                          <th> Tên Người Bán </th>
                          <th> Tên sản phẩm </th>
                          <th> Tình trạng </th>
                          <th> Giá </th>
                          <th> Mô tả </th>
                          <th> Loại sản phẩm </th>
                          <th> Xem ảnh </th>
                          <th> Hành động </th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.productId}>
                            <td className="py-1">
                              <img
                                src="https://cafefcdn.com/thumb_w/650/2020/photo1592538340216-1592538340336-crop-15925383563291317007294.jpg" 
                                // {product.sellerAvatar} // Thay thế bằng URL ảnh của người bán
                                alt="image"
                                style={{ width: '30%' }} // Thêm style cho width
                              />
                            </td>
                            <td>{product.sellerName}</td>
                            <td>{product.productName}</td>
                            <td>{product.status}</td>
                            <td>${product.price.toFixed(2)}</td>
                            <td style={{ maxWidth: "310px" }}>
                              {product.description}
                            </td>
                            <td>{product.category}</td>
                            <td>
                              <Link
                                to={`/detail/${product.productId}`}
                                className="btn btn-sm btn-info"
                              >
                                Xem ảnh
                              </Link>
                            </td>
                            <td>
                              {/* <button
                                className="btn btn-sm btn-info"
                                onClick={() => handleApproveProduct(product.productId)}
                              >
                                Duyệt
                              </button>{" "}
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleRejectProduct(product.productId)}
                              >
                                Loại bỏ
                              </button> */}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProcessRequest;