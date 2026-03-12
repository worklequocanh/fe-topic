import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import { useCart } from '../context/CartContext';
import $ from 'jquery';
import './layout.css';

export default function Layout() {
  const { toast } = useCart();
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // jQuery: scroll to top button
  useEffect(() => {
    const scrollBtn = $('<button id="scroll-to-top" aria-label="Lên đầu trang">↑</button>');

    if ($('#scroll-to-top').length === 0) {
      $('body').append(scrollBtn);
    }

    $(document).on('click', '#scroll-to-top', function () {
      $('html, body').animate({ scrollTop: 0 }, 500);
    });

    return () => {
      $(document).off('click', '#scroll-to-top');
    };
  }, []);

  return (
    <div className="layout">
      <Header />
      <main className="layout-main">
        <Outlet />
      </main>
      <Footer />

      {/* Toast notification */}
      <div className={`toast ${toast.show ? 'show' : ''}`}>
        {toast.message}
      </div>
    </div>
  );
}
