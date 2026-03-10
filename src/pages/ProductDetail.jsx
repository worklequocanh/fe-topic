import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import $ from 'jquery';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { Star, ShoppingCart, Truck, RefreshCw, Award, ChevronRight, Minus, Plus, PackageSearch, User } from 'lucide-react';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productsRes = await axios.get('/api/products');
        const found = productsRes.data.find(p => p.slug === slug);
        if (found) {
          setProduct(found);
          setSelectedImage(0);
          setQuantity(1);

          // Related products (same category, excluding current)
          const related = productsRes.data
            .filter(p => p.category === found.category && p.id !== found.id)
            .slice(0, 4);
          setRelatedProducts(related);

          // Reviews
          const reviewsRes = await axios.get('/api/reviews');
          setReviews(reviewsRes.data.filter(r => r.productId === found.id));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // jQuery: image zoom effect on hover
  useEffect(() => {
    if (!product) return;

    const $mainImg = $('#main-product-image');

    $mainImg.on('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      $(this).css({
        'transform-origin': `${x}% ${y}%`,
        transform: 'scale(1.5)',
      });
    });

    $mainImg.on('mouseleave', function () {
      $(this).css({
        'transform-origin': 'center center',
        transform: 'scale(1)',
      });
    });

    return () => {
      $mainImg.off('mousemove mouseleave');
    };
  }, [product, selectedImage]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sand border-t-terracotta rounded-full animate-spin mx-auto mb-4" />
          <p className="text-taupe">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom section-padding text-center">
        <PackageSearch size={48} className="mx-auto mb-4 text-taupe" />
        <h2 className="font-heading text-2xl font-bold text-charcoal mb-2">Không tìm thấy sản phẩm</h2>
        <p className="text-taupe mb-4">Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Link to="/products" className="btn-primary">← Về trang sản phẩm</Link>
      </div>
    );
  }

  const allImages = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image];

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-warm-beige py-3">
        <div className="container-custom">
          <nav className="flex items-center gap-1.5 text-sm text-taupe">
            <Link to="/" className="hover:text-terracotta transition-colors">Trang chủ</Link>
            <ChevronRight size={14} />
            <Link to="/products" className="hover:text-terracotta transition-colors">Sản phẩm</Link>
            <ChevronRight size={14} />
            <span className="text-charcoal">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product detail */}
      <section className="container-custom section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <div className="relative bg-white rounded-lg overflow-hidden border border-sand/30 mb-4 cursor-zoom-in">
              {discount > 0 && <span className="badge-sale">-{discount}%</span>}
              <div className="aspect-square">
                <img
                  id="main-product-image"
                  src={allImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300"
                />
              </div>
            </div>
            {/* Gallery thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-3">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-terracotta' : 'border-sand/50 hover:border-sand'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            <p className="text-sm text-terracotta uppercase tracking-wider mb-2">{product.artist}</p>
            <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-charcoal mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="star-rating flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'} />
                ))}
              </div>
              <span className="text-sm text-taupe">{product.rating} ({product.reviewCount} đánh giá)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl md:text-3xl font-bold text-terracotta">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-lg text-taupe line-through">{formatPrice(product.oldPrice)}</span>
              )}
              {discount > 0 && (
                <span className="bg-terracotta/10 text-terracotta text-sm font-semibold px-2 py-1 rounded">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-taupe leading-relaxed mb-6">{product.description}</p>

            {/* Specs */}
            <div className="bg-warm-beige rounded-lg p-4 mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-taupe">Chất liệu:</span>
                <span className="text-charcoal font-medium">{product.material}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-taupe">Kích thước:</span>
                <span className="text-charcoal font-medium">{product.dimensions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-taupe">Nghệ nhân:</span>
                <span className="text-charcoal font-medium">{product.artist}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-taupe">Tình trạng:</span>
                <span className={`font-medium ${product.inStock ? 'text-olive' : 'text-red-500'}`}>
                  {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                </span>
              </div>
            </div>

            {/* Quantity & Add to cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex items-center border border-sand rounded-md">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-4 py-3 text-charcoal hover:bg-warm-beige transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-3 font-medium text-charcoal min-w-[50px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-4 py-3 text-charcoal hover:bg-warm-beige transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => addToCart(product, quantity)}
                className="btn-primary flex-1"
                disabled={!product.inStock}
              >
                <ShoppingCart size={18} className="mr-2" /> Thêm vào giỏ hàng
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-sand/50">
              {[
                { icon: Truck, text: 'Miễn phí giao hàng' },
                { icon: RefreshCw, text: 'Đổi trả 30 ngày' },
                { icon: Award, text: 'Hàng chính hãng' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="text-center">
                  <Icon size={22} className="mx-auto mb-1 text-terracotta" />
                  <p className="text-[11px] text-taupe">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 md:mt-16">
          <div className="flex border-b border-sand/50">
            {[
              { key: 'description', label: 'Mô Tả Chi Tiết' },
              { key: 'reviews', label: `Đánh Giá (${reviews.length})` },
              { key: 'shipping', label: 'Giao Hàng' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 md:px-6 py-3 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
                  activeTab === tab.key
                    ? 'border-terracotta text-terracotta'
                    : 'border-transparent text-taupe hover:text-charcoal'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-6 md:py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-taupe leading-relaxed">
                <p>{product.description}</p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-warm-beige p-4 rounded-lg">
                    <h4 className="font-heading font-semibold text-charcoal mb-2">Chất liệu</h4>
                    <p className="text-sm">{product.material}</p>
                  </div>
                  <div className="bg-warm-beige p-4 rounded-lg">
                    <h4 className="font-heading font-semibold text-charcoal mb-2">Kích thước</h4>
                    <p className="text-sm">{product.dimensions}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.length > 0 ? reviews.map(review => (
                  <div key={review.id} className="bg-white p-4 rounded-lg border border-sand/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-warm-beige rounded-full flex items-center justify-center text-charcoal">
                          <User size={14} />
                        </div>
                        <span className="font-medium text-charcoal text-sm">{review.userName}</span>
                      </div>
                      <span className="text-xs text-taupe">{review.date}</span>
                    </div>
                    <div className="star-rating flex gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < review.rating ? 'fill-current' : 'opacity-30'} />
                      ))}
                    </div>
                    <p className="text-sm text-taupe">{review.comment}</p>
                  </div>
                )) : (
                  <p className="text-taupe text-center py-8">Chưa có đánh giá nào cho sản phẩm này.</p>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="text-taupe leading-relaxed space-y-4">
                <div className="bg-warm-beige p-4 rounded-lg">
                  <h4 className="font-heading font-semibold text-charcoal mb-2 flex items-center gap-2"><Truck size={18} className="text-terracotta" /> Giao hàng</h4>
                  <ul className="text-sm space-y-1 list-disc pl-5">
                    <li>Miễn phí giao hàng cho đơn từ 2.000.000đ</li>
                    <li>Giao hàng toàn quốc trong 3-5 ngày làm việc</li>
                    <li>Đóng gói cẩn thận, bảo vệ sản phẩm tối đa</li>
                  </ul>
                </div>
                <div className="bg-warm-beige p-4 rounded-lg">
                  <h4 className="font-heading font-semibold text-charcoal mb-2 flex items-center gap-2"><RefreshCw size={18} className="text-terracotta" /> Đổi trả</h4>
                  <ul className="text-sm space-y-1 list-disc pl-5">
                    <li>Đổi trả miễn phí trong 30 ngày</li>
                    <li>Hoàn tiền 100% nếu sản phẩm bị lỗi</li>
                    <li>Liên hệ hotline để được hỗ trợ nhanh nhất</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="bg-warm-beige section-padding">
          <div className="container-custom">
            <h2 className="font-heading text-xl md:text-2xl font-bold text-charcoal mb-6 text-center">
              Sản Phẩm Liên Quan
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
