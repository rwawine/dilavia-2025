import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import Bed from './pages/Catalog/Bed/Bed';
import Sofa from './pages/Catalog/Sofa/Sofa';
import Chair from './pages/Catalog/Chair/Chair';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Header />
        <main className={styles.main} style={{ marginTop: '120px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/fabric" element={<Fabric />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/favorite" element={<Favorite />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/bed" element={<Bed />} />
            <Route path="/sofa" element={<Sofa />} />
            <Route path="/chair" element={<Chair />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
