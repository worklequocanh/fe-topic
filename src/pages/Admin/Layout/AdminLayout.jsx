import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAdmin } from '../../../context/AdminContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Tag, 
  Users, 
  MessageSquare, 
  Settings, 
  LogOut,
  Home,
  ChevronRight,
  Layout
} from 'lucide-react';
import './AdminLayout.css';

export default function AdminLayout() {
  const { isAdmin, logout } = useAdmin();
  const location = useLocation();

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
    { path: '/admin/products', icon: Package, label: 'Sản phẩm' },
    { path: '/admin/categories', icon: Layout, label: 'Danh mục' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Đơn hàng' },
    { path: '/admin/promotions', icon: Tag, label: 'Khuyến mãi' },
    { path: '/admin/artisans', icon: Users, label: 'Nghệ nhân' },
    { path: '/admin/messages', icon: MessageSquare, label: 'Tin nhắn' },
    { path: '/admin/cms', icon: Layout, label: 'Trang chủ' },
    { path: '/admin/settings', icon: Settings, label: 'Cấu hình' },
  ];

  const getPageTitle = () => {
    const item = menuItems.find(i => location.pathname.startsWith(i.path));
    return item ? item.label : 'Admin Dashboard';
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <span>Artisan</span>VN
          </Link>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} className="active-arrow" />}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button onClick={logout} className="logout-btn">
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <h1 className="page-title">{getPageTitle()}</h1>
          </div>
          <div className="header-right">
            <Link to="/" className="view-site-btn">
              <Home size={18} />
              <span>Xem website</span>
            </Link>
          </div>
        </header>

        <div className="admin-content-scroll">
          <div className="admin-content">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
