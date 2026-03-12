import { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Search, Package, Calendar, User, Phone, MapPin, Truck, ChevronRight, AlertCircle, Clock, ArrowLeft } from 'lucide-react';
import './TrackOrder.css';

export default function TrackOrder() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialId = queryParams.get('id') || '';

  const [searchInput, setSearchInput] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [orderList, setOrderList] = useState([]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('vi-VN');
  };

  const getStatusInfo = (status) => {
    const statuses = {
      'pending': { label: 'Đang chờ xử lý', color: '#f39c12', icon: Clock },
      'confirmed': { label: 'Đã xác nhận', color: '#3498db', icon: Package },
      'shipping': { label: 'Đang giao hàng', color: '#9b59b6', icon: Truck },
      'completed': { label: 'Đã hoàn thành', color: '#2ecc71', icon: Truck },
      'cancelled': { label: 'Đã hủy', color: '#e74c3c', icon: AlertCircle }
    };
    return statuses[status] || { label: status, color: '#95a5a6', icon: Package };
  };

  const handleSearch = useCallback(async (e, forceInput = null) => {
    if (e) e.preventDefault();
    const input = forceInput || searchInput.trim();
    if (!input) return;

    setLoading(true);
    setError(null);
    setOrderDetail(null);
    setOrderList([]);

    try {
      // Logic: 
      // 1. Check if it looks like a phone number after removing spaces/dots/dashes
      const cleanInput = input.replace(/[\s.-]/g, '');
      const isPhone = /^[0-9]{10,11}$/.test(cleanInput);

      console.log("Searching for:", cleanInput, "isPhone:", isPhone);

      if (isPhone) {
        // Search by phone
        const q = query(collection(db, 'orders'), where('customerInfo.phone', '==', cleanInput));
        const querySnapshot = await getDocs(q);
        const results = [];
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });
        
        console.log("Phone results found:", results.length);

        if (results.length === 0) {
          setError('Không tìm thấy đơn hàng nào gắn với số điện thoại này.');
        } else if (results.length === 1) {
          setOrderDetail(results[0]);
        } else {
          setOrderList(results.sort((a, b) => {
            const timeA = a.createdAt?.seconds || 0;
            const timeB = b.createdAt?.seconds || 0;
            return timeB - timeA;
          }));
        }
      } else {
        // Search by ID
        console.log("Searching by ID:", cleanInput);
        const docRef = doc(db, 'orders', cleanInput);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Order found by ID!");
          setOrderDetail({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("Order NOT found by ID");
          setError('Không tìm thấy đơn hàng với mã số này. Vui lòng kiểm tra lại!');
        }
      }
    } catch (err) {
      console.error("Search error:", err);
      setError('Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  }, [searchInput]);

  // Auto search if ID is in URL
  useEffect(() => {
    if (initialId) {
      handleSearch(null, initialId);
    }
  }, [initialId, handleSearch]);

  return (
    <div className="track-order-page">
      <div className="cart-page-header">
        <div className="container">
          <h1 className="cart-page-title">Tra Cứu Đơn Hàng</h1>
          <p className="cart-page-subtitle">Kiểm tra trạng thái đơn hàng của bạn nhanh chóng</p>
        </div>
      </div>

      <div className="container section-padding">
        <div className="track-search-wrap">
          <form onSubmit={handleSearch} className="track-search-box">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              placeholder="Nhập Mã đơn hàng HOẶC Số điện thoại..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Đang tìm...' : 'Tra cứu'}
            </button>
          </form>
          <p className="track-tip">Mã số đơn hàng được gửi cho bạn sau khi đặt hàng thành công.</p>
        </div>

        {error && (
          <div className="track-error">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        {/* Results: List of orders */}
        {orderList.length > 0 && (
          <div className="track-results-list">
            <h3 className="results-title">Tìm thấy {orderList.length} đơn hàng liên quan</h3>
            <div className="orders-grid">
              {orderList.map(order => {
                const status = getStatusInfo(order.status);
                return (
                  <div key={order.id} className="order-item-card" onClick={() => setOrderDetail(order)}>
                    <div className="order-item-header">
                      <span className="order-id">#{order.id.substring(0, 8)}...</span>
                      <span className="order-date">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="order-item-body">
                      <p className="order-cust">Người nhận: <strong>{order.customerInfo.name}</strong></p>
                      <p className="order-total">Số tiền: <strong>{formatPrice(order.totalAmount)}</strong></p>
                    </div>
                    <div className="order-item-footer">
                      <span className="order-status-badge" style={{ backgroundColor: status.color + '15', color: status.color }}>
                        <status.icon size={14} /> {status.label}
                      </span>
                      <span className="view-detail">Chi tiết <ChevronRight size={14} /></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Results: Single order detail */}
        {orderDetail && (
          <div className="track-detail-card">
            <div className="detail-header">
               <div className="header-left">
                  <h3 className="detail-title">Chi Tiết Đơn Hàng</h3>
                  <span className="detail-id">#{orderDetail.id}</span>
               </div>
               <div className="header-right">
                  <span className="detail-status" style={{ backgroundColor: getStatusInfo(orderDetail.status).color }}>
                    {getStatusInfo(orderDetail.status).label}
                  </span>
               </div>
            </div>

            <div className="detail-body">
              <div className="detail-section">
                <h4 className="section-title">Thông tin giao hàng</h4>
                <div className="info-list">
                  <div className="info-item"><User size={16} /> <span>{orderDetail.customerInfo.name}</span></div>
                  <div className="info-item"><Phone size={16} /> <span>{orderDetail.customerInfo.phone}</span></div>
                  <div className="info-item"><MapPin size={16} /> <span>{orderDetail.customerInfo.address}</span></div>
                  <div className="info-item"><Calendar size={16} /> <span>Đã đặt: {formatDate(orderDetail.createdAt)}</span></div>
                </div>
              </div>

              <div className="detail-section">
                <h4 className="section-title">Danh sách sản phẩm</h4>
                <div className="detail-items">
                  {orderDetail.items.map((item, idx) => (
                    <div key={idx} className="detail-product-item">
                      <img src={item.image} alt={item.name} className="item-img" />
                      <div className="item-info">
                        <Link to={`/products/${item.slug}`} className="item-name">{item.name}</Link>
                        <span className="item-qty">Số lượng: {item.quantity}</span>
                      </div>
                      <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-summary">
                <div className="summary-row">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(orderDetail.totalAmount - (orderDetail.shippingFee || 0))}</span>
                </div>
                <div className="summary-row">
                  <span>Phí vận chuyển:</span>
                  <span>{orderDetail.shippingFee === 0 ? 'Miễn phí' : formatPrice(orderDetail.shippingFee)}</span>
                </div>
                <div className="summary-total">
                  <span>Tổng tiền:</span>
                  <span className="total-val">{formatPrice(orderDetail.totalAmount)}</span>
                </div>
              </div>
            </div>
            
            <div className="detail-footer">
               <button className="btn-outline" onClick={() => {
                 setOrderDetail(null);
                 if (orderList.length === 1) setOrderList([]);
               }}>
                 <ArrowLeft size={16} /> Quay lại tìm kiếm
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
