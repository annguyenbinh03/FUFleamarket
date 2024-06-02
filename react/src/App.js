import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Loading from './component/Loading'; 
import Detail from './pages/Detail';
import Home from './pages/Home';
import { Suspense } from 'react'; 
import AboutUs from './pages/AboutUs';
import Header from './Header';
import Footer from './Footer';
import MyPosts from './pages/MyPosts';
import PostProduct from './pages/PostProduct';
import CreateOrder from './pages/CreateOrder';
import BuyOrder from './pages/BuyOrder';
import SellOrder from './pages/SellOrder';
import SearchProduct from './pages/SearchProduct'; 
import AdminProcessRequest from './pages/AdminProcessRequest';

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}> 
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail/:productId" element={<Detail />} />
          <Route path="/my_posts" element={<MyPosts />} />
          <Route path="/upload-product" element={<PostProduct/>} />
          <Route path="/create-order" element={<CreateOrder />} />
          <Route path="/buy-order" element={<BuyOrder />} />
          <Route path="/sell-order" element={<SellOrder />} />
          <Route path="/search-product" element={<SearchProduct />} />
          <Route path="/admin-process-request" element={<AdminProcessRequest />} />
          <Route path="/aboutUs" element={<AboutUs />} />
        </Routes>
        <Footer />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;