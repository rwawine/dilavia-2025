import { Route, createRoutesFromElements, createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import styles from './App.module.css';
import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Delivery from './pages/Delivery/Delivery';
import Fabric from './pages/Fabric/Fabric';
import Contacts from './pages/Contacts/Contacts';
import NotFound from './pages/NotFound/NotFound';
import Favorite from './pages/Favorite/Favorite';
import Cart from './pages/Cart/Cart';
import Catalog from './pages/Catalog/Catalog';
import FabricDetail from './pages/Fabric/FabricDetail';
import FabricMaterial from './pages/Fabric/FabricMaterial';
import FabricSlug from './pages/Fabric/FabricSlug';
import Review from './pages/Review/Review';
import Footer from './components/Footer/Footer';

// Создаем Layout компонент для общего содержимого
const Layout = () => {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

// Создаем маршруты с флагом будущих функций
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/delivery" element={<Delivery />} />
      <Route path="/fabric" element={<Fabric />} />
      <Route path="/fabric/:materialName" element={<FabricMaterial />} />
      <Route path="/fabric/:materialName/:collectionName" element={<FabricDetail />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/favorite" element={<Favorite />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/catalog/:category" element={<Catalog />} />
      <Route path="/catalog/:category/:subcategory" element={<Catalog />} />
      <Route path="/product/:slug" element={<FabricSlug />} />
      <Route path="/reviews" element={<Review />} />
      <Route path="/review" element={<Review />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  ),
  {
    future: {
      v7_relativeSplatPath: true
    }
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
