import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loading from "./component/Loading";
import { ToastContainer } from "react-toastify";
import Register from "./pages/userPages/Register";
import Login from "./pages/userPages/Login";
import RequireAuth from "./component/RequireAuth";
import Unauthorized from "./component/Unauthorized";
import Users from "./component/User";

// Lazy loading components
const Detail = lazy(() => import("./pages/userPages/Detail"));
const Home = lazy(() => import("./pages/userPages/Home"));
const AboutUs = lazy(() => import("./pages/userPages/AboutUs"));
const MyPosts = lazy(() => import("./pages/userPages/MyPosts"));
const PostProduct = lazy(() => import("./pages/userPages/PostProduct"));
const CreateOrder = lazy(() => import("./pages/userPages/CreateOrder"));
const BuyOrder = lazy(() => import("./pages/userPages/BuyOrder"));
const SellOrder = lazy(() => import("./pages/userPages/SellOrder"));
const AdminProcessRequest = lazy(() => import("./pages/adminPages/AdminProcessRequest"));
const SearchProduct = lazy(()=> import("./pages/userPages/SearchProduct"));



const ROLES = {
  'User': 1,
  'Moderator': 2,
  'Admin': 3
};


function App() {
  return (
      <Suspense fallback={<Loading />}>
        {/* <Header /> */}
        <Routes>
          {/* public routes  */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/detail/:productId" element={<Detail />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/search-product" element={<SearchProduct />} />
            <Route path="/search-product/:categoryIdParam" element={<SearchProduct />}/>
            <Route path="/admin" element={<AdminProcessRequest />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            {/* protected */}
            <Route element={<RequireAuth allowedRoles={[ROLES.Moderator,ROLES.Admin,ROLES.User]} />}>
              <Route path="/sell-order" element={<SellOrder />} />
              <Route path="/my-posts" element={<MyPosts />} />
              <Route path="/upload-product" element={<PostProduct />} />
              <Route path="/create-order/:productId" element={<CreateOrder />} />
            </Route>
            <Route element={<RequireAuth allowedRoles={[ROLES.Moderator, ROLES.Admin,ROLES.User]} />}>
              <Route path="/buy-order" element={<BuyOrder />} />
            </Route>
            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />} >
              <Route path="/users" element={<Users />} />
            </Route>
        </Routes>
        <ToastContainer />
      </Suspense>
  );
}

export default App;
