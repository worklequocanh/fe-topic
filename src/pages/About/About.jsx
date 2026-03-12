import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import $ from 'jquery';
import * as LucideIcons from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import './About.css';

export default function About() {
  const [team, setTeam] = useState([]);
  const [values, setValues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamSnap, valuesSnap] = await Promise.all([
          getDocs(collection(db, 'team')),
          getDocs(collection(db, 'values')),
        ]);
        
        setTeam(teamSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setValues(valuesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error('Error fetching About data from Firebase:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (loading) return;

    // jQuery: scroll reveal
    const handleScroll = () => {
      $('.about-reveal').each(function () {
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
  }, [loading]);

  if (loading) {
    return (
      <div className="pd-loading">
        <div className="pd-spinner" />
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <div className="about-hero">
        <img
          src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200"
          alt="About ArtisanVN"
          className="about-hero-img"
        />
        <div className="about-hero-overlay">
          <div className="about-hero-content">
            <h1 className="about-hero-title">Về Chúng Tôi</h1>
            <p className="about-hero-desc">
              Nơi hội tụ tinh hoa nghệ thuật thủ công Việt Nam
            </p>
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="about-story">
        <div className="container">
          <div className="about-story-inner about-reveal">
            <div className="section-header">
              <p className="section-eyebrow">Câu chuyện</p>
              <h2 className="section-title">Hành Trình Của ArtisanVN</h2>
              <div className="section-divider" />
            </div>
            <div className="about-story-grid">
              <img
                src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600"
                alt="Câu chuyện ArtisanVN"
                className="about-story-img"
              />
              <div className="about-story-text">
                <p className="about-story-paragraph">
                  <strong style={{ color: 'var(--color-charcoal)', fontWeight: 700 }}>ArtisanVN</strong> được thành lập năm 2020 với sứ mệnh
                  kết nối những nghệ nhân tài hoa với người yêu thích nghệ thuật thủ công. Chúng tôi tin rằng
                  mỗi sản phẩm thủ công không chỉ là một món đồ, mà còn là một câu chuyện, một tâm huyết
                  được gửi gắm qua đôi bàn tay khéo léo.
                </p>
                <p className="about-story-paragraph">
                  Từ những bức tranh sơn dầu tinh tế, gốm sứ Bát Tràng truyền thống, đến trang sức bạc
                  chạm khắc độc bản — tất cả đều được chọn lọc kỹ lưỡng từ các nghệ nhân hàng đầu
                  Việt Nam.
                </p>
                <p className="about-story-paragraph">
                  Chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng cao nhất,
                  đồng thời góp phần bảo tồn và phát triển các làng nghề truyền thống của dân tộc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="container">
          <div className="section-header about-reveal">
            <p className="section-eyebrow">Giá trị cốt lõi</p>
            <h2 className="section-title">Điều Chúng Tôi Tin Tưởng</h2>
            <div className="section-divider" />
          </div>

          <div className="about-values-grid about-reveal">
            {values.map(v => {
              const ValueIcon = LucideIcons[v.icon] || LucideIcons.HelpCircle;
              return (
                <div key={v.title} className="about-value-card">
                  <div className="about-value-icon-wrap">
                    <ValueIcon size={32} className="about-value-icon" />
                  </div>
                  <h3 className="about-value-title">{v.title}</h3>
                  <p className="about-value-desc">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about-team">
        <div className="container">
          <div className="section-header about-reveal">
            <p className="section-eyebrow">Đội ngũ</p>
            <h2 className="section-title">Những Người Đứng Sau ArtisanVN</h2>
            <div className="section-divider" />
          </div>

          <div className="about-team-grid about-reveal">
            {team.map(member => (
              <div key={member.name} className="about-team-card">
                <div className="about-team-img-wrap">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="about-team-img"
                    loading="lazy"
                  />
                </div>
                <div className="about-team-info">
                  <h3 className="about-team-name">{member.name}</h3>
                  <p className="about-team-role">{member.role}</p>
                  <p className="about-team-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta about-reveal">
        <div className="container">
          <h2 className="about-cta-title">Sẵn sàng khám phá?</h2>
          <p className="about-cta-desc">
            Hãy cùng chúng tôi trải nghiệm vẻ đẹp của nghệ thuật thủ công Việt Nam
          </p>
          <Link to="/products" className="btn-primary about-cta-btn">
            Xem Sản Phẩm <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
