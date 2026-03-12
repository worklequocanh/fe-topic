import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Search, ShoppingBag, Menu, X, Heart } from 'lucide-react';
import $ from 'jquery';

import './Header.css';

const navLinks = [
  { path: '/', label: 'Trang Chủ' },
  { path: '/products', label: 'Sản Phẩm' },
  { path: '/about', label: 'Về Chúng Tôi' },
  { path: '/contact', label: 'Liên Hệ' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();

  // Location change will cause component to re-render, 
  // we can rely on React Router NavLink clicking to handle menu closing directly
  // which is already implemented.

  useEffect(() => {
    // jQuery sticky header
    $(window).on('scroll', function () {
      if ($(window).scrollTop() > 80) {
        setIsScrolled(true);
        $('#scroll-to-top').addClass('visible');
      } else {
        setIsScrolled(false);
        $('#scroll-to-top').removeClass('visible');
      }
    });

    return () => $(window).off('scroll');
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    // jQuery animation for mobile menu
    if (!isMenuOpen) {
      $('#mobile-menu').slideDown(300);
    } else {
      $('#mobile-menu').slideUp(300);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className={`header ${isScrolled ? 'is-scrolled' : ''}`}>
      {/* Top bar */}
      <div className="header-topbar">
        <span>
          <Heart size={12} className="icon-heart" fill="currentColor" />
          Miễn phí vận chuyển cho đơn hàng từ 2.000.000đ | Hotline: 0123 456 789
        </span>
      </div>

      <div className="container">
        <div className="header-main">
          {/* Mobile menu button */}
          <button
            onClick={handleMenuToggle}
            className="header-menu-btn"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="header-logo-link">
            <div className="header-logo-icon">
              <span>A</span>
            </div>
            <div className="header-logo-text">
              <h1 className="text-gradient">
                ArtisanVN
              </h1>
              <p>Nghệ thuật thủ công</p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="header-nav">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
                end={link.path === '/'}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="header-actions">
            <div className="header-search-desktop">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="header-search-btn"
                aria-label="Search"
              >
                <Search size={22} />
              </button>

              <form
                onSubmit={handleSearch}
                className={`header-search-form ${searchOpen ? 'is-open' : ''}`}
              >
                <div className="header-search-input-wrapper">
                  <Search size={16} className="header-search-icon-inside" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>

            <Link to="/cart" className="header-cart-btn" aria-label="Cart">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="header-cart-badge">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="header-search-mobile">
          <form onSubmit={handleSearch} className="header-search-mobile-form">
            <Search size={18} className="header-search-icon-inside" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="header-search-mobile-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div 
        id="mobile-menu"
        className="header-mobile-menu"
        style={{ display: isMenuOpen ? 'block' : 'none' }}
      >
        <nav className="header-mobile-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => {
                setIsMenuOpen(false);
                $('#mobile-menu').slideUp(300);
              }}
              className={({ isActive }) => `header-mobile-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
