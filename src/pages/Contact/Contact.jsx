import { useState, useEffect } from 'react';
import $ from 'jquery';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './Contact.css';

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
  const [loading, setLoading] = useState(false);

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

  // Validation
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const contactData = {
          ...formData,
          createdAt: serverTimestamp(),
          status: 'unread'
        };
        await addDoc(collection(db, 'contacts'), contactData);
        setSubmitted(true);
        // jQuery: success animation
        $('#contact-form').fadeOut(300, function () {
          $('#success-message').fadeIn(500);
        });
      } catch (error) {
        console.error("Error saving contact:", error);
        alert("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
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
      <div className="contact-hero">
        <div className="container">
          <h1 className="contact-hero-title">Liên Hệ Với Chúng Tôi</h1>
          <div className="contact-hero-divider" />
          <p className="contact-hero-desc">
            Bạn có câu hỏi, đề xuất hay cần hỗ trợ? Hãy điền vào form bên dưới hoặc liên hệ
            trực tiếp qua các kênh thông tin của ArtisanVN. Chúng tôi luôn sẵn lòng lắng nghe
            và sẽ phản hồi trong thời gian sớm nhất.
          </p>
        </div>
      </div>

      <div className="container section-padding">
        <div className="contact-layout">
          {/* Contact info */}
          <div className="contact-reveal">
            <h2 className="contact-info-title">Thông Tin Liên Hệ</h2>
            <div className="contact-info-list">
              {contactInfo.map(info => {
                const InfoIcon = info.icon;
                return (
                  <div key={info.title} className="contact-info-item">
                    <div className="contact-info-icon-wrap">
                      <InfoIcon size={18} className="contact-info-icon" />
                    </div>
                    <div>
                      <p className="contact-info-key">{info.title}</p>
                      <p className="contact-info-value">{info.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map embed */}
            <div className="contact-map-wrap">
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
          <div className="contact-reveal">
            <div id="contact-form" style={{ display: submitted ? 'none' : 'block' }}>
              <h2 className="contact-form-title">Gửi Tin Nhắn</h2>
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-row">
                  {/* Name */}
                  <div id="field-name" className="contact-field">
                    <label className="contact-label">
                      Họ tên <span className="contact-required">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      className={`contact-input ${errors.name ? 'has-error' : ''}`}
                    />
                    {errors.name && <p className="contact-error">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div id="field-email" className="contact-field">
                    <label className="contact-label">
                      Email <span className="contact-required">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      className={`contact-input ${errors.email ? 'has-error' : ''}`}
                    />
                    {errors.email && <p className="contact-error">{errors.email}</p>}
                  </div>
                </div>

                <div className="contact-form-row">
                  {/* Phone */}
                  <div id="field-phone" className="contact-field">
                    <label className="contact-label">Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="0123 456 789"
                      className={`contact-input ${errors.phone ? 'has-error' : ''}`}
                    />
                    {errors.phone && <p className="contact-error">{errors.phone}</p>}
                  </div>

                  {/* Subject */}
                  <div id="field-subject" className="contact-field">
                    <label className="contact-label">
                      Tiêu đề <span className="contact-required">*</span>
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Chủ đề tin nhắn"
                      className={`contact-input ${errors.subject ? 'has-error' : ''}`}
                    />
                    {errors.subject && <p className="contact-error">{errors.subject}</p>}
                  </div>
                </div>

                {/* Message */}
                <div id="field-message" className="contact-field">
                  <label className="contact-label">
                    Nội dung <span className="contact-required">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Nhập nội dung tin nhắn..."
                    className={`contact-textarea ${errors.message ? 'has-error' : ''}`}
                  />
                  {errors.message && <p className="contact-error">{errors.message}</p>}
                </div>

                <div>
                  <button type="submit" className="btn-primary contact-submit-btn" disabled={loading}>
                    <Send size={16} /> {loading ? 'Đang gửi...' : 'Gửi Tin Nhắn'}
                  </button>
                </div>
              </form>
            </div>

            {/* Success message */}
            <div
              id="success-message"
              className="contact-success"
              style={{ display: submitted ? 'block' : 'none' }}
            >
              <CheckCircle size={56} className="contact-success-icon" />
              <h3 className="contact-success-title">Gửi thành công!</h3>
              <p className="contact-success-desc">
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
