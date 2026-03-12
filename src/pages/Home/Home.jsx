import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs, query, where, limit, addDoc, deleteDoc, doc } from 'firebase/firestore';
import $ from 'jquery';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import ProductCard from '../../components/ProductCard/ProductCard';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import { Star } from 'lucide-react';
import './Home.css';
import { seedData } from '../../firebase/seedData';

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [artists, setArtists] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const uploadSampleData = async () => {
      const params = new URLSearchParams(location.search);
      const forceReseed = params.get('reseed') === 'true';

      // Check if products collection is empty or force reseed
      const checkProducts = await getDocs(query(collection(db, 'products'), limit(1)));
      
      if (checkProducts.empty || forceReseed) {
        console.log(forceReseed ? "Re-seeding data..." : "Database is empty. Initializing seed data...");
        
        // If re-seeding, we should ideally clear existing data. 
        // Simple version: just add. Better version: clear collections.
        if (forceReseed) {
          const collectionsToClear = Object.keys(seedData);
          for (const colName of collectionsToClear) {
            const snap = await getDocs(collection(db, colName));
            for (const d of snap.docs) {
              await deleteDoc(doc(db, colName, d.id));
            }
          }
        }

        for (const [colName, items] of Object.entries(seedData)) {
          console.log(`Seeding collection: ${colName}...`);
          for (const item of items) {
            await addDoc(collection(db, colName), item);
          }
        }
        console.log("Seed data initialized successfully!");
        // Remove the reseed param and reload
        window.location.href = window.location.origin + window.location.pathname;
      }
    };

    const fetchData = async () => {
      try {
        await uploadSampleData();
        const [bannersSnap, categoriesSnap, productsSnap, artistsSnap, testimonialsSnap] = await Promise.all([
          getDocs(collection(db, 'banners')),
          getDocs(collection(db, 'categories')),
          getDocs(query(collection(db, 'products'), where('featured', '==', true), limit(8))),
          getDocs(collection(db, 'artists')),
          getDocs(collection(db, 'testimonials')),
        ]);

        setBanners(bannersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setCategories(categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setFeaturedProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setArtists(artistsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setTestimonials(testimonialsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching data from Firebase:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [location.search]);

  // jQuery: testimonial carousel
  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // jQuery: fade-in on scroll
  useEffect(() => {
    const handleScroll = () => {
      $('.scroll-reveal').each(function () {
        const elementTop = $(this).offset().top;
        const viewportBottom = $(window).scrollTop() + $(window).height();
        if (elementTop < viewportBottom - 80) {
          $(this).addClass('animate-fade-in-up');
        }
      });
    };

    $(window).on('scroll', handleScroll);
    handleScroll(); // trigger once
    return () => $(window).off('scroll', handleScroll);
  }, [loading]);

  if (loading) {
    return (
      <div className="home-loading">
        <div className="home-spinner" />
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner banners={banners} />

      {/* Categories Section */}
      <section className="section-categories">
        <div className="container">
          <div className="section-header scroll-reveal">
            <p className="section-eyebrow">Bộ sưu tập</p>
            <h2 className="section-title">Danh Mục Nổi Bật</h2>
            <div className="section-divider" />
          </div>

          <div className="categories-grid scroll-reveal">
            {categories.map(cat => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-featured">
        <div className="container">
          <div className="section-header scroll-reveal">
            <p className="section-eyebrow">Được yêu thích</p>
            <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
            <div className="section-divider" />
          </div>

          <div className="featured-grid scroll-reveal">
            {featuredProducts.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="featured-cta scroll-reveal">
            <Link to="/products" className="btn-outline">
              Xem Tất Cả Sản Phẩm →
            </Link>
          </div>
        </div>
      </section>

      {/* About Artists Section */}
      <section className="section-artists">
        <div className="container">
          <div className="section-header scroll-reveal">
            <p className="section-eyebrow">Đội ngũ</p>
            <h2 className="section-title">Nghệ Nhân Của Chúng Tôi</h2>
            <div className="section-divider" />
          </div>

          <div className="artists-grid scroll-reveal">
            {artists.map(artist => (
              <div key={artist.id} className="artist-card">
                <div className="artist-avatar-wrap">
                  <img
                    src={artist.avatar}
                    alt={artist.name}
                    className="artist-avatar"
                    loading="lazy"
                  />
                </div>
                <h3 className="artist-name">{artist.name}</h3>
                <p className="artist-specialty">{artist.specialty}</p>
                <p className="artist-experience">{artist.experience} kinh nghiệm</p>
                <p className="artist-bio">{artist.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-testimonials">
        <div className="container">
          <div className="section-header scroll-reveal">
            <p className="section-eyebrow">Khách hàng nói gì</p>
            <h2 className="section-title">Đánh Giá Từ Khách Hàng</h2>
            <div className="section-divider" />
          </div>

          <div className="testimonial-wrap scroll-reveal">
            {testimonials.length > 0 && (
              <div className="testimonial-card">
                <div className="testimonial-quote">"</div>
                <div>
                  <p className="testimonial-comment">
                    {testimonials[currentTestimonial]?.comment}
                  </p>
                  <div className="testimonial-author">
                    <img
                      src={testimonials[currentTestimonial]?.avatar}
                      alt={testimonials[currentTestimonial]?.name}
                      className="testimonial-avatar"
                    />
                    <div className="testimonial-author-info">
                      <p className="testimonial-name">
                        {testimonials[currentTestimonial]?.name}
                      </p>
                      <p className="testimonial-role">
                        {testimonials[currentTestimonial]?.role}
                      </p>
                    </div>
                  </div>
                  <div className="testimonial-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="pd-star active" />
                    ))}
                  </div>
                </div>

                {/* Dots */}
                <div className="testimonial-dots">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentTestimonial(i)}
                      className={`testimonial-dot ${i === currentTestimonial ? 'active' : ''}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-newsletter">
        <div className="container">
          <div className="newsletter-wrap scroll-reveal">
            <p className="newsletter-eyebrow">Đừng bỏ lỡ</p>
            <h2 className="newsletter-title">Đăng Ký Nhận Tin Mới</h2>
            <p className="newsletter-desc">
              Nhận thông báo về sản phẩm mới, ưu đãi đặc biệt và câu chuyện của nghệ nhân.
            </p>
            <form
              className="newsletter-form"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="newsletter-input"
              />
              <button type="submit" className="btn-primary">
                Đăng Ký
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
