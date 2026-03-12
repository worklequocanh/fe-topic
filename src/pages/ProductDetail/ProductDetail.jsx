import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import $ from 'jquery';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Star, Truck, ShieldCheck, ChevronRight, Minus, Plus, ShoppingCart, RefreshCw, Award, PackageSearch, User } from 'lucide-react';
import './ProductDetail.css';

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
        const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const found = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
          setProduct(found);
          setSelectedImage(0);
          setQuantity(1);

          // Related products (same category, excluding current)
          const relatedQ = query(
            collection(db, 'products'), 
            where('category', '==', found.category),
            limit(5)
          );
          const relatedSnap = await getDocs(relatedQ);
          setRelatedProducts(relatedSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(p => p.id !== found.id)
            .slice(0, 4)
          );

          // Reviews
          const reviewsQ = query(collection(db, 'reviews'), where('productId', '==', found.id));
          const reviewsSnap = await getDocs(reviewsQ);
          setReviews(reviewsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
      <div className="pd-loading">
        <div className="pd-spinner" />
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-not-found">
        <PackageSearch size={48} className="pd-not-found-icon" />
        <h2 className="pd-not-found-title">Không tìm thấy sản phẩm</h2>
        <p className="pd-not-found-desc">Sản phẩm bạn tìm kiếm không tồn tại hoặc đã bị xóa.</p>
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
      <div className="pd-breadcrumb-wrap">
        <div className="container">
          <nav className="pd-breadcrumb">
            <Link to="/" className="pd-breadcrumb-link">Trang chủ</Link>
            <ChevronRight size={14} className="pd-breadcrumb-sep" />
            <Link to="/products" className="pd-breadcrumb-link">Sản phẩm</Link>
            <ChevronRight size={14} className="pd-breadcrumb-sep" />
            <span className="pd-breadcrumb-current">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product detail */}
      <section className="container section-padding">
        <div className="pd-main-grid">
          {/* Images */}
          <div>
            <div className="pd-main-img-wrap">
              {discount > 0 && <span className="pd-discount-badge">-{discount}%</span>}
              <div className="pd-main-img-inner">
                <img
                  id="main-product-image"
                  src={allImages[selectedImage] || null}
                  alt={product.name}
                  className="pd-main-img"
                />
              </div>
            </div>
            {/* Gallery thumbnails */}
            {allImages.length > 1 && (
              <div className="pd-thumbnails">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`pd-thumbnail-btn ${selectedImage === i ? 'active' : ''}`}
                  >
                    <img src={img || null} alt="" className="pd-thumbnail-img" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="pd-info">
            <p className="pd-artist-label">{product.artist}</p>
            <h1 className="pd-title">{product.name}</h1>

            {/* Rating */}
            <div className="pd-rating">
              <div className="pd-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={`pd-star ${i < Math.floor(product.rating) ? 'active' : ''}`} />
                ))}
              </div>
              <span className="pd-rating-text">{product.rating} ({product.reviewCount} đánh giá)</span>
            </div>

            {/* Price */}
            <div className="pd-price-wrap">
              <span className="pd-price">{formatPrice(product.price)}</span>
              {product.oldPrice && (
                <span className="pd-price-old">{formatPrice(product.oldPrice)}</span>
              )}
              {discount > 0 && (
                <span className="pd-discount-tag">-{discount}%</span>
              )}
            </div>

            {/* Description */}
            <p className="pd-description">{product.description}</p>

            {/* Specs */}
            <div className="pd-specs">
              <div className="pd-spec-row">
                <span className="pd-spec-label">Chất liệu:</span>
                <span className="pd-spec-value">{product.material}</span>
              </div>
              <div className="pd-spec-row">
                <span className="pd-spec-label">Kích thước:</span>
                <span className="pd-spec-value">{product.dimensions}</span>
              </div>
              <div className="pd-spec-row">
                <span className="pd-spec-label">Nghệ nhân:</span>
                <span className="pd-spec-value">{product.artist}</span>
              </div>
              <div className="pd-spec-row pd-spec-row-border">
                <span className="pd-spec-label">Tình trạng:</span>
                <span className={`pd-spec-value ${product.inStock ? 'pd-instock' : 'pd-outstock'}`}>
                  {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                </span>
              </div>
            </div>

            {/* Quantity & Add to cart */}
            <div className="pd-actions">
              <div className="pd-qty-control">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="pd-qty-btn"
                >
                  <Minus size={16} />
                </button>
                <span className="pd-qty-num">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="pd-qty-btn"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => addToCart(product, quantity)}
                className="btn-primary pd-add-btn"
                disabled={!product.inStock}
              >
                <ShoppingCart size={18} /> Thêm vào giỏ hàng
              </button>
            </div>

            {/* Trust badges */}
            <div className="pd-trust">
              {[
                { icon: Truck, text: 'Miễn phí giao hàng' },
                { icon: RefreshCw, text: 'Đổi trả 30 ngày' },
                { icon: Award, text: 'Hàng chính hãng' },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.text} className="pd-trust-item">
                    <IconComponent size={22} className="pd-trust-icon" />
                    <p className="pd-trust-text">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pd-tabs">
          <div className="pd-tab-nav">
            {[
              { key: 'description', label: 'Mô Tả Chi Tiết' },
              { key: 'reviews', label: `Đánh Giá (${reviews.length})` },
              { key: 'shipping', label: 'Giao Hàng' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pd-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="pd-tab-content">
            {activeTab === 'description' && (
              <div className="pd-desc-content">
                <p className="pd-desc-text">{product.description}</p>
                <div className="pd-desc-specs-grid">
                  <div className="pd-desc-spec-box">
                    <h4 className="pd-desc-spec-title">Chất liệu</h4>
                    <p>{product.material}</p>
                  </div>
                  <div className="pd-desc-spec-box">
                    <h4 className="pd-desc-spec-title">Kích thước</h4>
                    <p>{product.dimensions}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="pd-reviews">
                {reviews.length > 0 ? reviews.map(review => (
                  <div key={review.id} className="pd-review-card">
                    <div className="pd-review-header">
                      <div className="pd-review-user">
                        <div className="pd-review-avatar">
                          <User size={14} />
                        </div>
                        <span className="pd-review-name">{review.userName}</span>
                      </div>
                      <span className="pd-review-date">{review.date}</span>
                    </div>
                    <div className="pd-stars pd-review-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={`pd-star ${i < review.rating ? 'active' : ''}`} />
                      ))}
                    </div>
                    <p className="pd-review-comment">{review.comment}</p>
                  </div>
                )) : (
                  <p className="pd-no-reviews">Chưa có đánh giá nào cho sản phẩm này.</p>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="pd-shipping">
                <div className="pd-shipping-box">
                  <h4 className="pd-shipping-title">
                    <Truck size={20} className="pd-trust-icon" /> Giao hàng
                  </h4>
                  <ul className="pd-shipping-list">
                    <li>Miễn phí giao hàng cho đơn từ 2.000.000đ</li>
                    <li>Giao hàng toàn quốc trong 3-5 ngày làm việc</li>
                    <li>Đóng gói cẩn thận, bảo vệ sản phẩm tối đa</li>
                  </ul>
                </div>
                <div className="pd-shipping-box">
                  <h4 className="pd-shipping-title">
                    <RefreshCw size={20} className="pd-trust-icon" /> Đổi trả
                  </h4>
                  <ul className="pd-shipping-list">
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
        <section className="pd-related">
          <div className="container">
            <h2 className="pd-related-title">Sản Phẩm Liên Quan</h2>
            <div className="pd-related-grid">
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
