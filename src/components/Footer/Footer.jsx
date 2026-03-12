import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Send, MapPin, Phone, Mail } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      {/* Main footer */}
      <div className="container footer-main">
        <div className="footer-grid">
          {/* About column */}
          <div>
            <div className="footer-brand">
              <div className="footer-brand-icon">
                <span>A</span>
              </div>
              <span className="footer-brand-name">ArtisanVN</span>
            </div>
            <p className="footer-desc">
              Nơi hội tụ tinh hoa nghệ thuật thủ công Việt Nam. Mỗi sản phẩm là một câu chuyện, 
              một tâm huyết của nghệ nhân truyền thống.
            </p>
            <div className="footer-socials">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Youtube, label: 'Youtube' },
              ].map(({ icon: SocialIcon, label }) => {
                const IconComponent = SocialIcon;
                return (
                  <a
                    key={label}
                    href="#"
                    className="footer-social-link"
                    aria-label={label}
                  >
                    <IconComponent size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="footer-title">Liên Kết Nhanh</h3>
            <ul className="footer-links">
              {[
                { label: 'Trang Chủ', path: '/' },
                { label: 'Sản Phẩm', path: '/products' },
                { label: 'Về Chúng Tôi', path: '/about' },
                { label: 'Liên Hệ', path: '/contact' },
              ].map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="footer-link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="footer-title">Liên Hệ</h3>
            <ul className="footer-contact">
              <li className="footer-contact-item">
                <MapPin size={16} className="footer-contact-icon" />
                123 Nguyễn Huệ, Quận 1, TP.HCM
              </li>
              <li className="footer-contact-item">
                <Phone size={16} className="footer-contact-icon" />
                0123 456 789
              </li>
              <li className="footer-contact-item">
                <Mail size={16} className="footer-contact-icon" />
                info@artisanvn.com
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="footer-title">Nhận Tin Mới</h3>
            <p className="footer-newsletter-text">
              Đăng ký để nhận thông tin về sản phẩm mới và ưu đãi đặc biệt.
            </p>
            <form className="footer-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email của bạn"
                className="footer-input"
              />
              <button
                type="submit"
                className="footer-submit"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© 2026 ArtisanVN. All rights reserved.</p>
          <p>Đồ án cuối kỳ - Chuyên đề Frontend</p>
        </div>
      </div>
    </footer>
  );
}
