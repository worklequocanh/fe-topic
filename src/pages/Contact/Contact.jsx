import { useState, useEffect } from 'react';
import $ from 'jquery';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // jQuery: scroll reveal
    const handleScroll = () => {
      $('.contact-reveal').each(function () {
        const elementTop = $(this).offset().top;
        const viewportBottom = $(window).scrollTop() + $(window).height();
        if (elementTop < viewportBottom - 60) {
          $(this).addClass('animate-fade-in-up');
        }
      });
    };
    $(window).on('scroll', handleScroll);
    handleScroll();
    return () => $(window).off('scroll', handleScroll);
  }, []);

  // jQuery validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (formData.phone && !/^(0|\+84)[0-9]{9,10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Vui lòng nhập tiêu đề';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Vui lòng nhập nội dung';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Nội dung phải có ít nhất 10 ký tự';
    }

    setErrors(newErrors);

    // jQuery: shake animation on error fields
    Object.keys(newErrors).forEach(key => {
      $(`#field-${key}`).css('animation', 'none');
      setTimeout(() => {
        $(`#field-${key}`).css('animation', 'shake 0.4s ease');
      }, 10);
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitted(true);
      // jQuery: success animation
      $('#contact-form').fadeOut(300, function () {
        $('#success-message').fadeIn(500);
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const contactInfo = [
    { icon: MapPin, title: 'Địa chỉ', text: '123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh' },
    { icon: Phone, title: 'Điện thoại', text: '0123 456 789' },
    { icon: Mail, title: 'Email', text: 'info@artisanvn.com' },
    { icon: Clock, title: 'Giờ làm việc', text: 'Thứ 2 - Thứ 7: 9:00 - 18:00' },
  ];

  return (
    <div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
      `}</style>

      {/* Hero */}
      <div className="bg-warm-beige py-8 md:py-12">
        <div className="container-custom text-center">
          <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-charcoal">
            Liên Hệ Với Chúng Tôi
          </h1>
          <div className="w-16 h-0.5 bg-terracotta mt-4 mb-6" />
          <p className="text-taupe leading-relaxed mb-6">
            Bạn có câu hỏi, đề xuất hay cần hỗ trợ? Hãy điền vào form bên dưới hoặc liên hệ 
            trực tiếp qua các kênh thông tin của ArtisanVN. Chúng tôi luôn sẵn lòng lắng nghe 
            và sẽ phản hồi trong thời gian sớm nhất.
          </p>
        </div>
      </div>

      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact info */}
          <div className="lg:col-span-1 contact-reveal">
            <h2 className="font-heading text-xl font-semibold text-charcoal mb-6">
              Thông Tin Liên Hệ
            </h2>
            <div className="space-y-5 mb-8">
              {contactInfo.map(info => {
                const InfoIcon = info.icon;
                return (
                <div key={info.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                    <InfoIcon size={18} className="text-terracotta" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{info.title}</p>
                    <p className="text-sm text-taupe">{info.text}</p>
                  </div>
                </div>
              );})}
            </div>

            {/* Map embed */}
            <div className="rounded-lg overflow-hidden border border-sand/30 h-48 md:h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.447542430618!2d106.70232!3d10.77622!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f385570472f%3A0x4e39de680bbe7338!2sNguy%E1%BB%85n%20Hu%E1%BB%87%2C%20Qu%E1%BA%ADn%201%2C%20TP.%20H%E1%BB%93%20Ch%C3%AD%20Minh!5e0!3m2!1svi!2svn!4v1700000000000!5m2!1svi!2svn"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="ArtisanVN Location"
              />
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2 contact-reveal">
            <div id="contact-form" style={{ display: submitted ? 'none' : 'block' }}>
              <h2 className="font-heading text-xl font-semibold text-charcoal mb-6">
                Gửi Tin Nhắn
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div id="field-name">
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Họ tên <span className="text-terracotta">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      className={`w-full px-5 py-3 border rounded-xl bg-white text-charcoal placeholder:text-taupe/50 focus:outline-none transition-all duration-300 ${
                        errors.name ? 'border-red-400 focus:ring-2 focus:ring-red-400/20' : 'border-sand focus:border-terracotta focus:ring-2 focus:ring-terracotta/20'
                      }`}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div id="field-email">
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Email <span className="text-terracotta">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      className={`w-full px-5 py-3 border rounded-xl bg-white text-charcoal placeholder:text-taupe/50 focus:outline-none transition-all duration-300 ${
                        errors.email ? 'border-red-400 focus:ring-2 focus:ring-red-400/20' : 'border-sand focus:border-terracotta focus:ring-2 focus:ring-terracotta/20'
                      }`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone */}
                  <div id="field-phone">
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0123 456 789"
                      className={`w-full px-5 py-3 border rounded-xl bg-white text-charcoal placeholder:text-taupe/50 focus:outline-none transition-all duration-300 ${
                        errors.phone ? 'border-red-400 focus:ring-2 focus:ring-red-400/20' : 'border-sand focus:border-terracotta focus:ring-2 focus:ring-terracotta/20'
                      }`}
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  {/* Subject */}
                  <div id="field-subject">
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Tiêu đề <span className="text-terracotta">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Chủ đề tin nhắn"
                      className={`w-full px-5 py-3 border rounded-xl bg-white text-charcoal placeholder:text-taupe/50 focus:outline-none transition-all duration-300 ${
                        errors.subject ? 'border-red-400 focus:ring-2 focus:ring-red-400/20' : 'border-sand focus:border-terracotta focus:ring-2 focus:ring-terracotta/20'
                      }`}
                    />
                    {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
                  </div>
                </div>

                {/* Message */}
                <div id="field-message">
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Nội dung <span className="text-terracotta">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Nhập nội dung tin nhắn..."
                    className={`w-full px-5 py-3 border rounded-xl bg-white text-charcoal placeholder:text-taupe/50 focus:outline-none transition-all duration-300 resize-y ${
                      errors.message ? 'border-red-400 focus:ring-2 focus:ring-red-400/20' : 'border-sand focus:border-terracotta focus:ring-2 focus:ring-terracotta/20'
                    }`}
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                </div>

                <button type="submit" className="btn-primary inline-flex items-center gap-2">
                  <Send size={16} /> Gửi Tin Nhắn
                </button>
              </form>
            </div>

            {/* Success message */}
            <div
              id="success-message"
              className="text-center py-16"
              style={{ display: submitted ? 'block' : 'none' }}
            >
              <CheckCircle size={56} className="mx-auto mb-4 text-olive" />
              <h3 className="font-heading text-2xl font-bold text-charcoal mb-3">
                Gửi thành công!
              </h3>
              <p className="text-taupe mb-6">
                Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                  setErrors({});
                  $('#success-message').fadeOut(300, function () {
                    $('#contact-form').fadeIn(500);
                  });
                }}
                className="btn-outline"
              >
                Gửi tin nhắn khác
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
