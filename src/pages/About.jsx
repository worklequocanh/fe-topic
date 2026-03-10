import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { Palette, Hand, Leaf, Users, ArrowRight } from 'lucide-react';

export default function About() {
  useEffect(() => {
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
  }, []);

  const team = [
    {
      name: 'Nguyễn Minh Tuấn',
      role: 'Giám đốc sáng lập',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
      bio: 'Với đam mê về nghệ thuật thủ công và hơn 15 năm kinh nghiệm trong ngành, anh Tuấn đã sáng lập ArtisanVN với mong muốn kết nối nghệ nhân và người yêu nghệ thuật.',
    },
    {
      name: 'Trần Thị Hương',
      role: 'Giám đốc nghệ thuật',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
      bio: 'Chị Hương là người trực tiếp tuyển chọn và đánh giá chất lượng từng sản phẩm, đảm bảo chỉ những tác phẩm xuất sắc nhất được giới thiệu đến khách hàng.',
    },
    {
      name: 'Lê Đức Anh',
      role: 'Quản lý vận hành',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      bio: 'Anh Đức Anh đảm bảo mọi đơn hàng được đóng gói cẩn thận và giao đến tay khách hàng một cách an toàn, nhanh chóng nhất.',
    },
  ];

  const values = [
    { icon: Palette, title: 'Nghệ Thuật', desc: 'Mỗi sản phẩm là một tác phẩm nghệ thuật, thể hiện tâm hồn và tay nghề của nghệ nhân.' },
    { icon: Hand, title: 'Thủ Công', desc: 'Tất cả sản phẩm đều được làm thủ công, không sản xuất hàng loạt, đảm bảo tính độc bản.' },
    { icon: Leaf, title: 'Bền Vững', desc: 'Chúng tôi ưu tiên sử dụng nguyên liệu tự nhiên, thân thiện với môi trường.' },
    { icon: Users, title: 'Cộng Đồng', desc: 'Góp phần bảo tồn và phát triển các làng nghề truyền thống Việt Nam.' },
  ];

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200"
          alt="About ArtisanVN"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
              Về Chúng Tôi
            </h1>
            <p className="text-white/70 text-sm md:text-base max-w-lg mx-auto px-4">
              Nơi hội tụ tinh hoa nghệ thuật thủ công Việt Nam
            </p>
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="section-padding bg-cream">
        <div className="container-custom max-w-4xl about-reveal">
          <div className="text-center mb-8">
            <p className="text-terracotta text-sm uppercase tracking-widest mb-2">Câu chuyện</p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-charcoal">
              Hành Trình Của ArtisanVN
            </h2>
            <div className="w-16 h-0.5 bg-terracotta mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600"
                alt="Câu chuyện ArtisanVN"
                className="rounded-lg shadow-md w-full"
              />
            </div>
            <div className="text-taupe leading-relaxed space-y-4">
              <p>
                <strong className="text-charcoal">ArtisanVN</strong> được thành lập năm 2020 với sứ mệnh 
                kết nối những nghệ nhân tài hoa với người yêu thích nghệ thuật thủ công. Chúng tôi tin rằng 
                mỗi sản phẩm thủ công không chỉ là một món đồ, mà còn là một câu chuyện, một tâm huyết 
                được gửi gắm qua đôi bàn tay khéo léo.
              </p>
              <p>
                Từ những bức tranh sơn dầu tinh tế, gốm sứ Bát Tràng truyền thống, đến trang sức bạc 
                chạm khắc độc bản — tất cả đều được chọn lọc kỹ lưỡng từ các nghệ nhân hàng đầu 
                Việt Nam.
              </p>
              <p>
                Chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng cao nhất, 
                đồng thời góp phần bảo tồn và phát triển các làng nghề truyền thống của dân tộc.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-warm-beige">
        <div className="container-custom">
          <div className="text-center mb-8 md:mb-12 about-reveal">
            <p className="text-terracotta text-sm uppercase tracking-widest mb-2">Giá trị cốt lõi</p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-charcoal">
              Điều Chúng Tôi Tin Tưởng
            </h2>
            <div className="w-16 h-0.5 bg-terracotta mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 about-reveal">
            {values.map(v => {
              const ValueIcon = v.icon;
              return (
              <div key={v.title} className="card-hover bg-white rounded-lg p-6 text-center shadow-sm border border-sand/30">
                <div className="w-14 h-14 rounded-full bg-terracotta/10 flex items-center justify-center mx-auto mb-4">
                  <ValueIcon size={28} className="text-terracotta" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-charcoal mb-2">{v.title}</h3>
                <p className="text-sm text-taupe leading-relaxed">{v.desc}</p>
              </div>
            );})}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="text-center mb-8 md:mb-12 about-reveal">
            <p className="text-terracotta text-sm uppercase tracking-widest mb-2">Đội ngũ</p>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-charcoal">
              Những Người Đứng Sau ArtisanVN
            </h2>
            <div className="w-16 h-0.5 bg-terracotta mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 about-reveal">
            {team.map(member => (
              <div key={member.name} className="card-hover bg-white rounded-lg overflow-hidden shadow-sm border border-sand/30">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-heading text-lg font-semibold text-charcoal">{member.name}</h3>
                  <p className="text-sm text-terracotta mb-3">{member.role}</p>
                  <p className="text-sm text-taupe leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-charcoal text-white text-center about-reveal">
        <div className="container-custom">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
            Sẵn sàng khám phá?
          </h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Hãy cùng chúng tôi trải nghiệm vẻ đẹp của nghệ thuật thủ công Việt Nam
          </p>
          <Link to="/products" className="btn-primary !bg-terracotta inline-flex items-center gap-2">
            Xem Sản Phẩm <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
