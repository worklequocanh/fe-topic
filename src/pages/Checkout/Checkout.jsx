import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle, ArrowLeft, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import './Checkout.css';

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    note: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const shippingFee = cartTotal >= 2000000 ? 0 : 50000;
  const grandTotal = cartTotal + shippingFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    
    setLoading(true);
    try {
      const orderData = {
        customerInfo: {
          ...formData,
          phone: formData.phone.replace(/[\s.-]/g, ''),
          createdAt: new Date().toISOString()
        },
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          slug: item.slug
        })),
        totalAmount: grandTotal,
        shippingFee,
        status: 'pending',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setOrderId(docRef.id);
      clearCart();
    } catch (error) {
      console.error("Error adding order: ", error);
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  if (orderId) {
    return (
      <div className="checkout-success-wrap">
        <div className="container">
          <div className="checkout-success-card">
            <CheckCircle size={64} className="success-icon" />
            <h2 className="success-title">Đặt Hàng Thành Công!</h2>
            <p className="success-desc">
              Cảm ơn bạn đã tin tưởng ArtisanVN. Đơn hàng của bạn đã được tiếp nhận.
            </p>
            <div className="order-number-box">
              <span className="order-number-label">Mã đơn hàng của bạn:</span>
              <span className="order-number-value">{orderId}</span>
            </div>
            <p className="order-note-info">
              Hãy lưu lại mã này để tra cứu trạng thái đơn hàng tại mục "Tra cứu đơn hàng".
            </p>
            <div className="success-actions">
              <Link to="/products" className="btn-primary">Tiếp tục mua sắm</Link>
              <Link to={`/track-order?id=${orderId}`} className="btn-outline">Theo dõi đơn hàng</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container section-padding">
        <div className="cart-empty">
          <h2>Giỏ hàng của bạn đang trống</h2>
          <Link to="/products" className="btn-primary">Quay lại cửa hàng</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="cart-page-header">
        <div className="container">
          <h1 className="cart-page-title">Thanh Toán</h1>
          <div className="checkout-steps">
            <span className="step active">1. Giỏ hàng</span>
            <span className="step-sep">/</span>
            <span className="step active">2. Thông tin & Thanh toán</span>
            <span className="step-sep">/</span>
            <span className="step">3. Hoàn tất</span>
          </div>
        </div>
      </div>

      <div className="container section-padding">
        <Link to="/cart" className="back-to-cart">
          <ArrowLeft size={16} /> Quay lại giỏ hàng
        </Link>
        
        <form onSubmit={handleSubmit} className="checkout-layout">
          {/* Form info */}
          <div className="checkout-form-col">
            <div className="checkout-section">
              <h3 className="checkout-section-title">Thông tin giao hàng</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Họ và tên *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Nhập họ và tên"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Nhập số điện thoại"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Email (không bắt buộc)</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Nhập email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Địa chỉ nhận hàng *</label>
                  <textarea
                    name="address"
                    required
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    value={formData.address}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="form-group full-width">
                  <label>Ghi chú đơn hàng</label>
                  <textarea
                    name="note"
                    placeholder="Lưu ý cho người bán hoặc shipper..."
                    value={formData.note}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="checkout-section">
              <h3 className="checkout-section-title">Phương thức thanh toán</h3>
              <div className="payment-methods">
                <label className="payment-method selected">
                  <input type="radio" name="payment" defaultChecked />
                  <div className="payment-info">
                    <span className="payment-name">Thanh toán khi nhận hàng (COD)</span>
                    <span className="payment-desc">Thanh toán bằng tiền mặt khi giao hàng tận nơi.</span>
                  </div>
                  <CreditCard className="payment-icon" />
                </label>
                <div className="payment-method disabled">
                  <input type="radio" name="payment" disabled />
                  <div className="payment-info">
                    <span className="payment-name">Chuyển khoản ngân hàng (Sắp ra mắt)</span>
                    <span className="payment-desc">Thanh toán qua QR code hoặc số tài khoản.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="checkout-summary-col">
            <div className="checkout-summary-box">
              <h3 className="summary-title">Đơn hàng của bạn</h3>
              
              <div className="summary-items">
                {cartItems.map(item => (
                  <div key={item.id} className="summary-item">
                    <div className="summary-item-img-wrap">
                      <img src={item.image} alt={item.name} />
                      <span className="summary-item-qty">{item.quantity}</span>
                    </div>
                    <div className="summary-item-info">
                      <span className="summary-item-name">{item.name}</span>
                      <span className="summary-item-price">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Phí vận chuyển:</span>
                  <span>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
                </div>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Tổng cộng:</span>
                <span className="total-amount">{formatPrice(grandTotal)}</span>
              </div>

              <button 
                type="submit" 
                className="btn-primary checkout-submit-btn"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Xác Nhận Đặt Hàng'}
              </button>

              <div className="checkout-guarantees">
                <div className="guarantee">
                  <ShieldCheck size={14} /> Chính sách bảo mật thông tin
                </div>
                <div className="guarantee">
                  <Truck size={14} /> Giao hàng từ 2-5 ngày làm việc
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
