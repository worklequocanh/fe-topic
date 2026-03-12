import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Checkout from './pages/Checkout/Checkout';
import TrackOrder from './pages/TrackOrder/TrackOrder';

import { Navigate } from 'react-router-dom';
import { AdminProvider } from './context/AdminContext';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminLayout from './pages/Admin/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminArtisans from './pages/Admin/AdminArtisans';
import AdminMessages from './pages/Admin/AdminMessages';
import AdminCategories from './pages/Admin/AdminCategories';
import AdminHomeCMS from './pages/Admin/AdminHomeCMS';
import AdminSettings from './pages/Admin/AdminSettings';

export default function App() {
  return (
    <AdminProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:slug" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="track-order" element={<TrackOrder />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="artisans" element={<AdminArtisans />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="cms" element={<AdminHomeCMS />} />
          <Route path="settings" element={<AdminSettings />} />
          {/* Placeholder cho các module quản lý khác */}
          <Route path="*" element={<div className="admin-card">Module này đang được phát triển...</div>} />
        </Route>
      </Routes>
    </AdminProvider>
  );
}
