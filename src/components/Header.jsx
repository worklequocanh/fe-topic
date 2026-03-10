import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Search, ShoppingBag, Menu, X, Heart } from 'lucide-react';
import $ from 'jquery';

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
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
    setSearchOpen(false);
  }, [location]);

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-md'
          : 'bg-cream'
      }`}
    >
      {/* Top bar */}
      <div className="hidden md:block bg-charcoal text-white text-center py-1.5 text-xs tracking-wider">
        <span className="inline-flex items-center gap-1.5">
          <Heart size={12} className="text-terracotta" fill="currentColor" />
          Miễn phí vận chuyển cho đơn hàng từ 2.000.000đ | Hotline: 0123 456 789
        </span>
      </div>

      <div className="container-custom">
        <div className="flex items-center justify-between py-3 md:py-4">
          {/* Mobile menu button */}
          <button
            onClick={handleMenuToggle}
            className="lg:hidden p-2 text-charcoal hover:text-terracotta transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-terracotta rounded-full flex items-center justify-center">
              <span className="text-white font-heading text-lg md:text-xl font-bold">A</span>
            </div>
            <div>
              <h1 className="font-heading text-xl md:text-2xl font-bold text-charcoal tracking-tight">
                ArtisanVN
              </h1>
              <p className="hidden sm:block text-[10px] text-taupe tracking-widest uppercase -mt-0.5">
                Nghệ thuật thủ công
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium tracking-wide uppercase transition-colors relative pb-1 ${
                    isActive
                      ? 'text-terracotta after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-terracotta'
                      : 'text-charcoal hover:text-terracotta'
                  }`
                }
                end={link.path === '/'}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-charcoal hover:text-terracotta transition-colors"
              aria-label="Tìm kiếm"
            >
              <Search size={20} />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-charcoal hover:text-terracotta transition-colors"
              aria-label="Giỏ hàng"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-terracotta text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search bar dropdown */}
        {searchOpen && (
          <div className="pb-4 animate-slide-down">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe/60" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-10 pr-4 py-2 border border-sand rounded-md bg-white text-charcoal placeholder:text-taupe/60 focus:outline-none focus:border-terracotta transition-colors"
                  autoFocus
                />
              </div>
              <button type="submit" className="btn-primary !py-2 !px-4">
                Tìm
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile navigation */}
      <div
        id="mobile-menu"
        className="lg:hidden bg-white border-t border-sand"
        style={{ display: isMenuOpen ? 'block' : 'none' }}
      >
        <nav className="container-custom py-4 flex flex-col gap-3">
          {navLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide uppercase py-2 border-b border-warm-beige transition-colors ${
                  isActive ? 'text-terracotta' : 'text-charcoal hover:text-terracotta'
                }`
              }
              onClick={() => {
                setIsMenuOpen(false);
                $('#mobile-menu').slideUp(300);
              }}
              end={link.path === '/'}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
