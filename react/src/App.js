import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Loading from './component/Loading'; 
import Header from './Header';
import Footer from './Footer';

// Lazy loading components
const Detail = lazy(() => import('./pages/Detail'));
const Home = lazy(() => import('./pages/Home'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const MyPosts = lazy(() => import('./pages/MyPosts'));
const PostProduct = lazy(() => import('./pages/PostProduct'));
const CreateOrder = lazy(() => import('./pages/CreateOrder'));
const BuyOrder = lazy(() => import('./pages/BuyOrder'));
const SellOrder = lazy(() => import('./pages/SellOrder'));
// const SearchProduct = lazy(() => import('./pages/SearchProduct'));
const AdminProcessRequest = lazy(() => import('./pages/AdminProcessRequest'));

const SearchProduct = lazy(() => new Promise(resolve => {
  setTimeout(() => resolve(import('./pages/SearchProduct')), 300);
}));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail/:productId" element={<Detail />} />
          <Route path="/create-order/:productId" element={<CreateOrder />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/upload-product" element={<PostProduct />} />
          <Route path="/buy-order" element={<BuyOrder />} />
          <Route path="/sell-order" element={<SellOrder />} />
          <Route path="/search-product" element={<SearchProduct />} />
          <Route path="/search-product/:categoryIdParam" element={<SearchProduct />} />
          <Route path="/admin/:adminParam" element={<AdminProcessRequest />} />
          <Route path="/aboutUs" element={<AboutUs />} />
        </Routes>
        <Footer />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
