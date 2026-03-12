import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Lock, Truck, RefreshCw } from 'lucide-react';

export default function Cart() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const shippingFee = cartTotal >= 2000000 ? 0 : 50000;
  const grandTotal = cartTotal + shippingFee;

  if (cartItems.length === 0) {
    return (
      <div className="container-custom section-padding text-center">
        <div className="max-w-md mx-auto">
          <ShoppingCart size={56} className="mx-auto mb-6 text-sand" />
          <h2 className="font-heading text-2xl font-bold text-charcoal mb-3">Giỏ hàng trống</h2>
          <p className="text-taupe mb-6">Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá các sản phẩm của chúng tôi!</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            ← Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-warm-beige py-8 md:py-12">
        <div className="container-custom">
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-charcoal text-center">
            Giỏ Hàng
          </h1>
          <p className="text-taupe text-center mt-2 text-sm">
            {cartItems.length} sản phẩm trong giỏ hàng
          </p>
        </div>
      </div>

      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Table header (desktop) */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 pb-3 border-b border-sand/50 text-xs text-taupe uppercase tracking-wider font-medium">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-2 text-center">Số lượng</div>
              <div className="col-span-2 text-right">Giá</div>
              <div className="col-span-2 text-right">Tổng</div>
            </div>

            {cartItems.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-sand/30 p-4 flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center"
              >
                {/* Product info */}
                <div className="flex gap-4 md:col-span-6">
                  <Link to={`/products/${item.slug}`} className="w-20 h-20 md:w-24 md:h-24 rounded-md overflow-hidden flex-shrink-0 bg-warm-beige">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.slug}`} className="font-heading text-sm md:text-base font-semibold text-charcoal hover:text-terracotta transition-colors line-clamp-2">
                      {item.name}
                    </Link>
                    <p className="text-xs text-taupe mt-1">{item.artist}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-terracotta hover:underline mt-2 md:mt-1"
                    >
                      <Trash2 size={12} className="inline mr-1" />Xóa
                    </button>
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between md:justify-center md:col-span-2 mt-3 md:mt-0">
                  <span className="md:hidden text-xs text-taupe">Số lượng:</span>
                  <div className="flex items-center border border-sand rounded">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 text-sm text-charcoal hover:bg-warm-beige transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 text-sm text-charcoal hover:bg-warm-beige transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between md:justify-end md:col-span-2 mt-2 md:mt-0">
                  <span className="md:hidden text-xs text-taupe">Đơn giá:</span>
                  <span className="text-sm text-charcoal">{formatPrice(item.price)}</span>
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between md:justify-end md:col-span-2 mt-2 md:mt-0">
                  <span className="md:hidden text-xs text-taupe">Thành tiền:</span>
                  <span className="text-sm font-semibold text-terracotta">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}

            {/* Cart actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
              <Link to="/products" className="btn-outline !text-sm !py-2 inline-flex items-center gap-2">
                <ArrowLeft size={14} /> Tiếp tục mua sắm
              </Link>
              <button
                onClick={clearCart}
                className="text-sm text-taupe hover:text-terracotta transition-colors underline"
              >
                Xóa toàn bộ giỏ hàng
              </button>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-sand/30 p-6 sticky top-24">
              <h3 className="font-heading text-lg font-semibold text-charcoal mb-4 pb-4 border-b border-sand/50">
                Tóm Tắt Đơn Hàng
              </h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-taupe">Tạm tính:</span>
                  <span className="text-charcoal">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-taupe">Phí vận chuyển:</span>
                  <span className={`${shippingFee === 0 ? 'text-olive font-medium' : 'text-charcoal'}`}>
                    {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
                  </span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-xs text-taupe italic">
                    Miễn phí vận chuyển cho đơn từ {formatPrice(2000000)}
                  </p>
                )}
              </div>

              <div className="flex justify-between pt-4 border-t border-sand/50 mb-6">
                <span className="font-semibold text-charcoal">Tổng cộng:</span>
                <span className="text-xl font-bold text-terracotta">{formatPrice(grandTotal)}</span>
              </div>

              <button
                className="btn-primary w-full"
                onClick={() => alert('Chức năng thanh toán sẽ được phát triển trong phiên bản tiếp theo!')}
              >
                Tiến Hành Thanh Toán
              </button>

              {/* Trust badges */}
              <div className="mt-4 pt-4 border-t border-sand/50 space-y-2">
                {[
                  { icon: Lock, text: 'Thanh toán an toàn' },
                  { icon: Truck, text: 'Giao hàng nhanh chóng' },
                  { icon: RefreshCw, text: 'Đổi trả 30 ngày' },
                ].map(({ icon: Icon, text }) => (
                  <p key={text} className="text-xs text-taupe text-center flex items-center justify-center gap-1.5">
                    <Icon size={12} className="text-terracotta" /> {text}
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
