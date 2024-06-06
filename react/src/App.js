import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loading from "./component/Loading";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import Register from "./pages/Register";
import Login from "./pages/Login";
import RequireAuth from "./component/RequireAuth";
import Unauthorized from "./component/Unauthorized";
import Users from "./component/User";

// Lazy loading components
const Detail = lazy(() => import("./pages/Detail"));
const Home = lazy(() => import("./pages/Home"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const MyPosts = lazy(() => import("./pages/MyPosts"));
const PostProduct = lazy(() => import("./pages/PostProduct"));
const CreateOrder = lazy(() => import("./pages/CreateOrder"));
const BuyOrder = lazy(() => import("./pages/BuyOrder"));
const SellOrder = lazy(() => import("./pages/SellOrder"));
const AdminProcessRequest = lazy(() => import("./pages/AdminProcessRequest"));

const SearchProduct = lazy(
  () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(import("./pages/SearchProduct")), 300);
    })
);

const ROLES = {
  'User': 0,
  'Moderator': 1,
  'Admin': 2
};


function App() {
  return (
      <Suspense fallback={<Loading />}>
        <Header />
        <Routes>
          {/* public routes  */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/detail/:productId" element={<Detail />} />
           

            <Route path="/search-product" element={<SearchProduct />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route
              path="/search-product/:categoryIdParam"
              element={<SearchProduct />}
            />
            <Route path="/admin/:adminParam" element={<AdminProcessRequest />} />
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
        <Footer/>
        <ToastContainer />
      </Suspense>
  );
}

export default App;
