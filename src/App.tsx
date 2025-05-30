import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Footer from './components/Footer/Footer';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Header />
        <main className={styles.main} style={{ marginTop: '120px' }}>
          <Routes>
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </HelmetProvider>
  );
}

export default App;
