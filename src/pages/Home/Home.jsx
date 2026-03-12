import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import $ from 'jquery';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import ProductCard from '../../components/ProductCard/ProductCard';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import 'lucide-react';

export default function Home() {
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [artists, setArtists] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersRes, categoriesRes, productsRes, artistsRes, testimonialsRes] = await Promise.all([
          axios.get('/api/banners'),
          axios.get('/api/categories'),
          axios.get('/api/products'),
          axios.get('/api/artists'),
          axios.get('/api/testimonials'),
        ]);
        setBanners(bannersRes.data);
        setCategories(categoriesRes.data);
        setFeaturedProducts(productsRes.data.filter(p => p.featured));
        setArtists(artistsRes.data);
        setTestimonials(testimonialsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sand border-t-terracotta rounded-full animate-spin mx-auto mb-4" />
          <p className="text-taupe">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner banners={banners} />

      {/* Categories Section */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="text-center mb-10 md:mb-16 scroll-reveal">
            <p className="text-terracotta text-sm md:text-base uppercase tracking-widest mb-3">Bộ sưu tập</p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal">
              Danh Mục Nổi Bật
            </h2>
            <div className="w-16 md:w-24 h-0.5 md:h-1 bg-terracotta mx-auto mt-5 md:mt-6" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8 scroll-reveal">
            {categories.map(cat => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section-padding bg-warm-beige">
        <div className="container-custom">
          <div className="text-center mb-10 md:mb-16 scroll-reveal">
            <p className="text-terracotta text-sm md:text-base uppercase tracking-widest mb-3">Được yêu thích</p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal">
              Sản Phẩm Nổi Bật
            </h2>
            <div className="w-16 md:w-24 h-0.5 md:h-1 bg-terracotta mx-auto mt-5 md:mt-6" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 scroll-reveal">
            {featuredProducts.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12 scroll-reveal">
            <Link to="/products" className="btn-outline">
              Xem Tất Cả Sản Phẩm →
            </Link>
          </div>
        </div>
      </section>

      {/* About Artists Section */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="text-center mb-10 md:mb-16 scroll-reveal">
            <p className="text-terracotta text-sm md:text-base uppercase tracking-widest mb-3">Đội ngũ</p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal">
              Nghệ Nhân Của Chúng Tôi
            </h2>
            <div className="w-16 md:w-24 h-0.5 md:h-1 bg-terracotta mx-auto mt-5 md:mt-6" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 scroll-reveal">
            {artists.map(artist => (
              <div key={artist.id} className="card-hover bg-white rounded-2xl overflow-hidden shadow-sm border border-sand/30 text-center p-8 md:p-10 group">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden mx-auto mb-6 border-4 border-warm-beige group-hover:border-terracotta/30 transition-colors duration-500">
                  <img
                    src={artist.avatar}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-heading text-xl md:text-2xl font-semibold text-charcoal mb-2">{artist.name}</h3>
                <p className="text-sm md:text-base text-terracotta mb-2">{artist.specialty}</p>
                <p className="text-xs md:text-sm text-taupe mb-3">{artist.experience} kinh nghiệm</p>
                <p className="text-sm md:text-base text-taupe leading-relaxed">{artist.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-warm-beige">
        <div className="container-custom">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <p className="text-terracotta text-sm uppercase tracking-widest mb-2">Khách hàng nói gì</p>
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-charcoal">
              Đánh Giá Từ Khách Hàng
            </h2>
            <div className="w-16 h-0.5 bg-terracotta mx-auto mt-4" />
          </div>

          <div className="max-w-2xl mx-auto scroll-reveal">
            {testimonials.length > 0 && (
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-sand/30 text-center relative">
                <div className="text-4xl text-terracotta/30 font-heading mb-4">"</div>
                <div className="transition-all duration-500">
                  <p className="text-base md:text-lg text-charcoal leading-relaxed mb-6 italic">
                    {testimonials[currentTestimonial]?.comment}
                  </p>
                  <div className="flex items-center justify-center gap-3 md:gap-4">
                    <img
                      src={testimonials[currentTestimonial]?.avatar}
                      alt={testimonials[currentTestimonial]?.name}
                      className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-warm-beige"
                    />
                    <div className="text-left">
                      <p className="font-semibold text-charcoal text-sm md:text-base">
                        {testimonials[currentTestimonial]?.name}
                      </p>
                      <p className="text-xs md:text-sm text-taupe">
                        {testimonials[currentTestimonial]?.role}
                      </p>
                    </div>
                  </div>
                  <div className="star-rating mt-3 flex justify-center gap-1.5 align-middle">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-current text-terracotta/80" />
                    ))}
                  </div>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-6">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentTestimonial(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentTestimonial ? 'bg-terracotta w-6' : 'bg-sand'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding bg-charcoal text-white">
        <div className="container-custom text-center scroll-reveal">
          <p className="text-terracotta text-sm uppercase tracking-widest mb-2">Đừng bỏ lỡ</p>
          <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6">
            Đăng Ký Nhận Tin Mới
          </h2>
          <p className="text-white/80 text-base md:text-lg mb-8 md:mb-10 max-w-md mx-auto">
            Nhận thông báo về sản phẩm mới, ưu đãi đặc biệt và câu chuyện của nghệ nhân.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-white/40 focus:outline-none focus:border-terracotta transition-colors"
            />
            <button type="submit" className="btn-primary !bg-terracotta">
              Đăng Ký
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
