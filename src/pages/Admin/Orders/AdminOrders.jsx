import { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, query, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { 
  Search, 
  Eye, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Filter,
  Calendar,
  User,
  Phone,
  MapPin,
  Package,
  X
} from 'lucide-react';
import './AdminOrders.css';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const statusMap = {
    pending: { label: 'Chờ xác nhận', color: '#f39c12', icon: Clock },
    confirmed: { label: 'Đã xác nhận', color: '#3498db', icon: CheckCircle },
    shipping: { label: 'Đang giao', color: '#9b59b6', icon: Truck },
    completed: { label: 'Đã hoàn thành', color: '#2ecc71', icon: CheckCircle },
    cancelled: { label: 'Đã hủy', color: '#e74c3c', icon: XCircle }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('customerInfo.createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedOrders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái: " + error.message);
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerInfo.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
  };

  return (
    <div className="admin-orders">
      <div className="admin-page-header">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Tìm theo mã đơn, khách hàng, SĐT..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={18} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            {Object.entries(statusMap).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="admin-card no-padding overflow-hidden">
        {loading && orders.length === 0 ? (
          <div className="loading-state">Đang tải danh sách đơn hàng...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td className="font-mono text-sm">{order.id}</td>
                  <td>
                    <div>
                      <p className="font-semibold">{order.customerInfo.name}</p>
                      <p className="text-xs text-gray">{order.customerInfo.phone}</p>
                    </div>
                  </td>
                  <td>{formatDate(order.customerInfo.createdAt)}</td>
                  <td>{order.totalAmount?.toLocaleString()}đ</td>
                  <td>
                    <select 
                      className="order-status-select"
                      style={{ 
                        color: statusMap[order.status]?.color,
                        borderColor: statusMap[order.status]?.color + '40'
                      }}
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    >
                      {Object.entries(statusMap).map(([key, value]) => (
                        <option key={key} value={key}>{value.label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => handleViewDetails(order)} title="Xem chi tiết">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="admin-modal-overlay">
          <div className="admin-modal order-detail-modal">
            <div className="modal-header">
              <h3>Chi tiết đơn hàng: {selectedOrder.id}</h3>
              <button className="close-btn" onClick={() => setShowDetailModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-content">
              <div className="order-detail-grid">
                {/* Left: Info */}
                <div className="order-info-section">
                  <div className="info-group">
                    <h4><User size={16} /> Thông tin khách hàng</h4>
                    <p><strong>Họ tên:</strong> {selectedOrder.customerInfo.name}</p>
                    <p><strong>Số điện thoại:</strong> {selectedOrder.customerInfo.phone}</p>
                    <p><strong>Email:</strong> {selectedOrder.customerInfo.email}</p>
                    <p><strong>Địa chỉ:</strong> {selectedOrder.customerInfo.address}</p>
                  </div>

                  <div className="info-group">
                    <h4><Truck size={16} /> Trạng thái vận chuyển</h4>
                    <div className="status-selector-grid">
                      {Object.entries(statusMap).map(([key, value]) => (
                        <button
                          key={key}
                          className={`status-btn ${selectedOrder.status === key ? 'active' : ''}`}
                          style={{ '--status-color': value.color }}
                          onClick={() => updateOrderStatus(selectedOrder.id, key)}
                        >
                          {value.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Items */}
                <div className="order-items-section">
                  <h4><Package size={16} /> Danh sách sản phẩm</h4>
                  <div className="order-items-list">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <span>{item.name} x {item.quantity}</span>
                        <span>{(item.price * item.quantity).toLocaleString()}đ</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Tạm tính:</span>
                      <span>{(selectedOrder.totalAmount - (selectedOrder.shippingFee || 0)).toLocaleString()}đ</span>
                    </div>
                    <div className="summary-row">
                      <span>Phí vận chuyển:</span>
                      <span>{selectedOrder.shippingFee?.toLocaleString()}đ</span>
                    </div>
                    <div className="summary-row total">
                      <span>Tổng cộng:</span>
                      <span>{selectedOrder.totalAmount?.toLocaleString()}đ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
