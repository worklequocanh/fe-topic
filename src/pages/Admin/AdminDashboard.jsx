import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  Users, 
  MessageSquare, 
  DollarSign,
  ArrowUpRight,
  Clock,
  ChevronRight,
  AlertCircle,
  Plus,
  Layout
} from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    unreadMessages: 0,
    growth: 12.5 // Mock growth percentage
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentMessages, setRecentMessages] = useState([]);

  const statusMap = {
    pending: { label: 'Chờ xác nhận', color: '#f39c12' },
    confirmed: { label: 'Đã xác nhận', color: '#3498db' },
    shipping: { label: 'Đang giao', color: '#9b59b6' },
    completed: { label: 'Đã hoàn thành', color: '#2ecc71' },
    cancelled: { label: 'Đã hủy', color: '#e74c3c' }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [ordersSnap, productsSnap, messagesSnap, artistsSnap] = await Promise.all([
        getDocs(collection(db, 'orders')),
        getDocs(collection(db, 'products')),
        getDocs(collection(db, 'contacts')),
        getDocs(collection(db, 'artists'))
      ]);

      // Calculate Revenue (Only for confirmed, shipping, or completed orders)
      let revenue = 0;
      const ordersList = ordersSnap.docs.map(doc => {
        const data = doc.data();
        const amount = Number(data.totalAmount) || 0;
        if (['confirmed', 'shipping', 'completed'].includes(data.status)) {
          revenue += amount;
        }
        return { id: doc.id, ...data, totalAmount: amount };
      });

      // Get recent orders (sorted and limited)
      const recentOrdersList = ordersList
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
        .slice(0, 5);

      // Get unread messages
      const messagesList = messagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const unreadCount = messagesList.filter(m => m.status !== 'read').length;
      const recentMsgs = messagesList.slice(0, 4);

      setStats({
        totalRevenue: revenue,
        totalOrders: ordersSnap.size,
        totalProducts: productsSnap.size,
        unreadMessages: unreadCount,
        totalArtists: artistsSnap.size,
        growth: 15.8
      });

      setRecentOrders(recentOrdersList);
      setRecentMessages(recentMsgs);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    const val = Number(amount) || 0;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  if (loading) return <div className="loading-state">Đang tổng hợp dữ liệu...</div>;

  return (
    <div className="admin-dashboard">
      {/* Welcome Section */}
      <div className="dashboard-welcome">
        <div className="welcome-text">
          <h2>Chào buổi tối, Admin 👋</h2>
          <p>Đây là những gì đang diễn ra với ArtisanVN hôm nay.</p>
        </div>
        <div className="dashboard-date">
          <Clock size={16} /> {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-cards-grid">
        <div className="stat-card-modern">
          <div className="stat-card-icon revenue">
            <DollarSign size={24} />
          </div>
          <div className="stat-card-info">
            <p className="stat-label">Tổng doanh thu</p>
            <h3 className="stat-value">{formatCurrency(stats.totalRevenue)}</h3>
            <span className="stat-growth positive">
              <TrendingUp size={14} /> +{stats.growth}% <small>tháng này</small>
            </span>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-card-icon orders">
            <ShoppingCart size={24} />
          </div>
          <div className="stat-card-info">
            <p className="stat-label">Tổng đơn hàng</p>
            <h3 className="stat-value">{stats.totalOrders}</h3>
            <span className="stat-growth positive">
              <TrendingUp size={14} /> +8.2% <small>so với tuần trước</small>
            </span>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-card-icon products">
            <Package size={24} />
          </div>
          <div className="stat-card-info">
            <p className="stat-label">Sản phẩm hiện có</p>
            <h3 className="stat-value">{stats.totalProducts}</h3>
            <p className="stat-subtext">Trong 4 danh mục chính</p>
          </div>
        </div>

        <div className="stat-card-modern">
          <div className="stat-card-icon messages">
            <MessageSquare size={24} />
          </div>
          <div className="stat-card-info">
            <p className="stat-label">Tin nhắn chờ</p>
            <h3 className="stat-value">{stats.unreadMessages}</h3>
            <span className={`stat-growth ${stats.unreadMessages > 0 ? 'warning' : 'neutral'}`}>
              <AlertCircle size={14} /> {stats.unreadMessages > 0 ? 'Cần phản hồi' : 'Đã xử lý xong'}
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        {/* Recent Orders Section */}
        <div className="admin-card dashboard-table-card">
          <div className="card-header-flex">
            <h3>Đơn hàng gần đây</h3>
            <button className="btn-text">Xem tất cả <ChevronRight size={14}/></button>
          </div>
          <div className="table-responsive-mini">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Giá trị</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td><span className="id-badge">#{order.id.substring(0, 6)}</span></td>
                    <td>{order.customer?.name || order.customerInfo?.name || 'Khách vãng lai'}</td>
                    <td>{formatCurrency(order.totalAmount)}</td>
                    <td>
                      <span 
                        className="status-badge-modern"
                        style={{ 
                          backgroundColor: (statusMap[order.status]?.color || '#95a5a6') + '15',
                          color: statusMap[order.status]?.color || '#95a5a6'
                        }}
                      >
                        {statusMap[order.status]?.label || 'Chờ xử lý'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="4" className="text-center py-4">Chưa có đơn hàng nào</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Messages & Actions */}
        <div className="dashboard-side-column">
          <div className="admin-card">
            <div className="card-header-flex">
              <h3>Tin nhắn mới nhất</h3>
            </div>
            <div className="mini-msg-list">
              {recentMessages.length > 0 ? recentMessages.map(msg => (
                <div key={msg.id} className="mini-msg-item">
                  <div className="msg-avatar-initial">
                    {msg.name?.charAt(0) || 'U'}
                  </div>
                  <div className="msg-content-preview">
                    <p className="msg-sender">{msg.name}</p>
                    <p className="msg-snippet">{msg.message?.substring(0, 40)}...</p>
                  </div>
                  {msg.status !== 'read' && <div className="unread-dot"></div>}
                </div>
              )) : (
                <p className="text-center py-4 text-gray">Không có tin nhắn mới</p>
              )}
            </div>
          </div>

          <div className="admin-card quick-links-card">
            <h3>Truy cập nhanh</h3>
            <div className="quick-links-grid">
              <button className="quick-link-btn" onClick={() => navigate('/admin/products')}>
                <Plus size={18} /> <span>Thêm sản phẩm</span>
              </button>
              <button className="quick-link-btn" onClick={() => navigate('/admin/artisans')}>
                <Users size={18} /> <span>Thêm nghệ nhân</span>
              </button>
              <button className="quick-link-btn" onClick={() => navigate('/admin/cms')}>
                <Layout size={18} /> <span>Sửa trang chủ</span>
              </button>
              <button className="quick-link-btn" onClick={() => navigate('/admin/settings')}>
                <ArrowUpRight size={18} /> <span>Cấu hình SEO</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
