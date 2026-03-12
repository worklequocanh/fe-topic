import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';

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
    <section className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Slides */}
      <div ref={slideRef} className="relative h-full">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="absolute inset-0"
            style={{
              opacity: index === currentSlide ? 1 : 0,
              zIndex: index === currentSlide ? 1 : 0,
            }}
          >
            {/* Background image */}
            <div className="absolute inset-0">
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal/70 via-charcoal/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="container-custom relative h-full flex items-center z-10">
              <div className="max-w-lg md:max-w-xl lg:max-w-2xl text-white">
                <h2
                  className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 lg:mb-8 leading-tight drop-shadow-md text-gradient !bg-gradient-to-r !from-white !to-white/80"
                  style={{
                    opacity: index === currentSlide ? 1 : 0,
                    transform: index === currentSlide ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.8s ease 0.2s',
                  }}
                >
                  {banner.title}
                </h2>
                <p
                  className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 md:mb-10 lg:mb-12 font-medium tracking-wide drop-shadow-sm"
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
                  className="btn-primary !bg-white !text-charcoal hover:!bg-terracotta hover:!text-white text-sm md:text-base lg:text-lg px-6 md:px-8 py-3 md:py-4"
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
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
