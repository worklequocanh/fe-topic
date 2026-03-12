import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Lock, Truck, RefreshCw } from 'lucide-react';
import './Cart.css';

export default function Cart() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const shippingFee = cartTotal >= 2000000 ? 0 : 50000;
  const grandTotal = cartTotal + shippingFee;

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-wrap">
        <div className="cart-empty">
          <ShoppingBag size={56} className="cart-empty-icon" />
          <h2 className="cart-empty-title">Giỏ hàng trống</h2>
          <p className="cart-empty-desc">Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá các sản phẩm của chúng tôi!</p>
          <Link to="/products" className="btn-primary">
            ← Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="cart-page-header">
        <div className="container">
          <h1 className="cart-page-title">Giỏ Hàng</h1>
          <p className="cart-page-subtitle">{cartItems.length} sản phẩm trong giỏ hàng</p>
        </div>
      </div>

      <div className="container section-padding">
        <div className="cart-layout">
          {/* Cart items */}
          <div className="cart-items-col">
            {/* Table header (desktop) */}
            <div className="cart-table-header">
              <div className="cart-th-product">Sản phẩm</div>
              <div className="cart-th-qty">Số lượng</div>
              <div className="cart-th-price">Giá</div>
              <div className="cart-th-total">Tổng</div>
            </div>

            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                {/* Product info */}
                <div className="cart-item-product">
                  <Link to={`/products/${item.slug}`} className="cart-item-img-link">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                  </Link>
                  <div className="cart-item-info">
                    <Link to={`/products/${item.slug}`} className="cart-item-name">
                      {item.name}
                    </Link>
                    <p className="cart-item-artist">{item.artist}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="cart-item-remove"
                    >
                      <Trash2 size={12} /> Xóa
                    </button>
                  </div>
                </div>

                {/* Quantity */}
                <div className="cart-item-qty-wrap">
                  <span className="cart-item-label-mobile">Số lượng:</span>
                  <div className="cart-qty-control">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="cart-qty-btn"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="cart-qty-num">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="cart-qty-btn"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="cart-item-price-wrap">
                  <span className="cart-item-label-mobile">Đơn giá:</span>
                  <span className="cart-item-price">{formatPrice(item.price)}</span>
                </div>

                {/* Subtotal */}
                <div className="cart-item-subtotal-wrap">
                  <span className="cart-item-label-mobile">Thành tiền:</span>
                  <span className="cart-item-subtotal">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}

            {/* Cart actions */}
            <div className="cart-actions">
              <Link to="/products" className="btn-outline cart-continue-btn">
                <ArrowLeft size={14} /> Tiếp tục mua sắm
              </Link>
              <button onClick={clearCart} className="cart-clear-btn">
                Xóa toàn bộ giỏ hàng
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div className="cart-summary-col">
            <div className="cart-summary-box">
              <h3 className="cart-summary-title">Tóm Tắt Đơn Hàng</h3>

              <div className="cart-summary-rows">
                <div className="cart-summary-row">
                  <span className="cart-summary-label">Tạm tính:</span>
                  <span className="cart-summary-value">{formatPrice(cartTotal)}</span>
                </div>
                <div className="cart-summary-row">
                  <span className="cart-summary-label">Phí vận chuyển:</span>
                  <span className={`cart-summary-value ${shippingFee === 0 ? 'cart-summary-free' : ''}`}>
                    {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p className="cart-shipping-note">
                    Miễn phí vận chuyển cho đơn từ {formatPrice(2000000)}
                  </p>
                )}
              </div>

              <div className="cart-summary-total">
                <span className="cart-summary-total-label">Tổng cộng:</span>
                <span className="cart-summary-total-amount">{formatPrice(grandTotal)}</span>
              </div>

              <Link
                to="/checkout"
                className="btn-primary cart-checkout-btn-link"
                style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}
              >
                Tiến Hành Thanh Toán
              </Link>

              {/* Trust badges */}
              <div className="cart-trust-badges">
                {[
                  { icon: Lock, text: 'Thanh toán an toàn' },
                  { icon: Truck, text: 'Giao hàng nhanh chóng' },
                  { icon: RefreshCw, text: 'Đổi trả 30 ngày' },
                ].map(({ icon: Icon, text }) => (
                  <p key={text} className="cart-trust-badge">
                    <Icon size={12} className="cart-trust-icon" /> {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
