import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Send, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/80">
      {/* Main footer */}
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-terracotta rounded-full flex items-center justify-center">
                <span className="text-white font-heading text-lg font-bold">A</span>
              </div>
              <span className="font-heading text-xl font-bold text-white">ArtisanVN</span>
            </div>
            <p className="text-sm leading-relaxed text-white/60 mb-4">
              Nơi hội tụ tinh hoa nghệ thuật thủ công Việt Nam. Mỗi sản phẩm là một câu chuyện, 
              một tâm huyết của nghệ nhân truyền thống.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Instagram, label: 'Instagram' },
                { icon: Youtube, label: 'Youtube' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-terracotta transition-colors"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-4">Liên Kết Nhanh</h3>
            <ul className="space-y-2">
              {[
                { label: 'Trang Chủ', path: '/' },
                { label: 'Sản Phẩm', path: '/products' },
                { label: 'Về Chúng Tôi', path: '/about' },
                { label: 'Liên Hệ', path: '/contact' },
              ].map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/60 hover:text-terracotta transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-4">Liên Hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin size={16} className="flex-shrink-0 mt-0.5 text-terracotta" />
                123 Nguyễn Huệ, Quận 1, TP.HCM
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone size={16} className="flex-shrink-0 text-terracotta" />
                0123 456 789
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail size={16} className="flex-shrink-0 text-terracotta" />
                info@artisanvn.com
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-heading text-lg font-semibold text-white mb-4">Nhận Tin Mới</h3>
            <p className="text-sm text-white/60 mb-4">
              Đăng ký để nhận thông tin về sản phẩm mới và ưu đãi đặc biệt.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email của bạn"
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-terracotta transition-colors"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-terracotta text-white rounded-md text-sm font-medium hover:bg-terracotta-dark transition-colors"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/40">
          <p>© 2026 ArtisanVN. All rights reserved.</p>
          <p>Đồ án cuối kỳ - Chuyên đề Frontend</p>
        </div>
      </div>
    </footer>
  );
}
