import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import './HeroBanner.css';

export default function HeroBanner({ banners }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // jQuery auto-slide
    intervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [banners.length]);

  useEffect(() => {
    // jQuery slide animation
    $(slideRef.current).children().each(function (i) {
      $(this).css({
        opacity: i === currentSlide ? 1 : 0,
        transform: i === currentSlide ? 'scale(1)' : 'scale(1.05)',
        transition: 'all 0.8s ease',
      });
    });
  }, [currentSlide]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 5000);
  };

  if (!banners || banners.length === 0) return null;

  return (
    <section className="hero-banner">
      {/* Slides */}
      <div ref={slideRef} className="hero-slides">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="hero-slide"
            style={{
              opacity: index === currentSlide ? 1 : 0,
              zIndex: index === currentSlide ? 1 : 0,
            }}
          >
            {/* Background image */}
            <div className="hero-slide-bg">
              <img
                src={banner.image}
                alt={banner.title}
                className="hero-slide-img"
              />
              <div className="hero-slide-overlay" />
            </div>

            {/* Content */}
            <div className="container hero-slide-content-wrap">
              <div className="hero-slide-content">
                <h2
                  className="hero-title"
                  style={{
                    opacity: index === currentSlide ? 1 : 0,
                    transform: index === currentSlide ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.8s ease 0.2s',
                  }}
                >
                  {banner.title}
                </h2>
                <p
                  className="hero-subtitle"
                  style={{
                    opacity: index === currentSlide ? 1 : 0,
                    transform: index === currentSlide ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.8s ease 0.4s',
                  }}
                >
                  {banner.subtitle}
                </p>
                <Link
                  to={banner.link}
                  className="hero-btn"
                  style={{
                    opacity: index === currentSlide ? 1 : 0,
                    transform: index === currentSlide ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.8s ease 0.6s',
                  }}
                >
                  {banner.buttonText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="hero-dots">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
