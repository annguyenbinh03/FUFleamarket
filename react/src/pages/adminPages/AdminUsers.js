import { useContext, useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AuthContext from "../../context/AuthProvider";
import { getAllUserAPI } from "../../api/user";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const { auth } = useContext(AuthContext);
  
    const fetchData = async () => {
      try {
        const usersData = await getAllUserAPI(auth.accessToken);
        setUsers(usersData);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      }
    };
  
    useEffect(() => {
        fetchData();
      }, []);

    return ( 
        <div className="admin_page">
        <nav className="navbar">
          <AdminHeader />
        </nav>
        <div className="admin_main container-fluid d-flex justify-content-center p-0 pt-3 mt-5">
          <nav className="w-13 p-0 bg-white">
            <div className="col-lg-12 ">
              <AdminSidebar />
            </div>
          </nav>
          <div className="main-content w-87 pt-3 px-4">
            <h4 className="card-title">Người dùng</h4>
            <p className="">
              Danh mục tất cả người dùng{" "}
            </p>
            <table className="product-table table text-center table-bordered mb-4">
              <thead className="bg-secondary">
                <tr>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Giới thiệu</th>
                  <th>Vai trò</th>
                  <th>Ngày tạo tài khoản</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
              {users?.map((user) => (
                <tr key={user.userId}>
                  <td>
                    <div className="td-seller-content"> 
                      <img
                      className="rounded-3 me-2"
                        src={user?.avarta}
                        style={{ maxWidth: "30px" }} alt="user"
                      />
                   <span> {user.fullName}</span>        
                    </div>
                  </td>
                  <td>
                  {user.email}
                  </td>
                  <td>
                  {user.phoneNumber}
                  </td>
                  <td>
                  {user.introduction}
                  </td>
                  <td>
                  {user.roleId === 1 ? 
                 <span class="badge text-bg-success">Người dùng</span>  :
                   (user.roleId === 2 ? 
                    <span class="badge text-bg-warning">Moderator</span>
                     : 
                     <span class="badge text-bg-danger">Admin</span>             
                   )}
                  </td>
                  <td>
                  {user.createdDate}
                  </td>
                  <td>
                    {user.isDeleted === false ? (
                      <div>
                        <button
                          className="btn btn-danger mx-2"
                        //   onClick={() =>
                        //     handleApproveProduct(product.productId)
                        //   }
                        >
                          Ban
                        </button>
                      </div>
                    ) :  (
                        <button
                        className="btn btn-success mx-2"
                      //   onClick={() => handleRejectProduct(product.productId)}
                      >
                        Unban
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
     );
}

export default AdminUsers;