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
          <div className="text-center text-white px-4 md:px-8">
            <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              Về Chúng Tôi
            </h1>
            <p className="text-white/80 text-base md:text-lg lg:text-xl max-w-2xl mx-auto">
              Nơi hội tụ tinh hoa nghệ thuật thủ công Việt Nam
            </p>
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="section-padding bg-cream">
        <div className="container-custom max-w-4xl about-reveal">
          <div className="text-center mb-10 md:mb-16">
            <p className="text-terracotta text-sm md:text-base uppercase tracking-widest mb-3">Câu chuyện</p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal">
              Hành Trình Của ArtisanVN
            </h2>
            <div className="w-16 md:w-24 h-0.5 md:h-1 bg-terracotta mx-auto mt-5 md:mt-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="order-2 md:order-1">
              <img
                src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600"
                alt="Câu chuyện ArtisanVN"
                className="rounded-2xl shadow-xl w-full"
              />
            </div>
            <div className="text-taupe leading-relaxed order-1 md:order-2">
              <p className="text-base md:text-lg lg:text-xl mb-4 md:mb-6">
                <strong className="text-charcoal font-bold">ArtisanVN</strong> được thành lập năm 2020 với sứ mệnh 
                kết nối những nghệ nhân tài hoa với người yêu thích nghệ thuật thủ công. Chúng tôi tin rằng 
                mỗi sản phẩm thủ công không chỉ là một món đồ, mà còn là một câu chuyện, một tâm huyết 
                được gửi gắm qua đôi bàn tay khéo léo.
              </p>
              <p className="text-base md:text-lg lg:text-xl mb-4 md:mb-6">
                Từ những bức tranh sơn dầu tinh tế, gốm sứ Bát Tràng truyền thống, đến trang sức bạc 
                chạm khắc độc bản — tất cả đều được chọn lọc kỹ lưỡng từ các nghệ nhân hàng đầu 
                Việt Nam.
              </p>
              <p className="text-base md:text-lg lg:text-xl">
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
          <div className="text-center mb-10 md:mb-16 about-reveal">
            <p className="text-terracotta text-sm md:text-base uppercase tracking-widest mb-3">Giá trị cốt lõi</p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal">
              Điều Chúng Tôi Tin Tưởng
            </h2>
            <div className="w-16 md:w-24 h-0.5 md:h-1 bg-terracotta mx-auto mt-5 md:mt-6" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 about-reveal">
            {values.map(v => {
              const ValueIcon = v.icon;
              return (
              <div key={v.title} className="card-hover bg-white rounded-2xl p-8 md:p-10 text-center shadow-sm border border-sand/30">
                <div className="w-16 md:w-20 h-16 md:h-20 rounded-full bg-terracotta/10 flex items-center justify-center mx-auto mb-6 md:mb-8">
                  <ValueIcon size={32} className="text-terracotta lg:w-10 lg:h-10" />
                </div>
                <h3 className="font-heading text-xl md:text-2xl font-bold text-charcoal mb-3 md:mb-4">{v.title}</h3>
                <p className="text-base md:text-lg text-taupe leading-relaxed">{v.desc}</p>
              </div>
            );})}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-cream">
        <div className="container-custom">
          <div className="text-center mb-10 md:mb-16 about-reveal">
            <p className="text-terracotta text-sm md:text-base uppercase tracking-widest mb-3">Đội ngũ</p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal">
              Những Người Đứng Sau ArtisanVN
            </h2>
            <div className="w-16 md:w-24 h-0.5 md:h-1 bg-terracotta mx-auto mt-5 md:mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-12 about-reveal">
            {team.map(member => (
              <div key={member.name} className="card-hover bg-white rounded-2xl overflow-hidden shadow-sm border border-sand/30 flex flex-col">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="p-8 md:p-10 text-center bg-white flex-1 flex flex-col">
                  <h3 className="font-heading text-2xl md:text-3xl font-bold text-charcoal mb-3">{member.name}</h3>
                  <p className="text-base font-medium text-terracotta mb-5">{member.role}</p>
                  <p className="text-base md:text-lg text-taupe leading-relaxed mb-0">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-charcoal text-white text-center about-reveal">
        <div className="container-custom">
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-5 md:mb-6">
            Sẵn sàng khám phá?
          </h2>
          <p className="text-white/80 text-base md:text-lg lg:text-xl mb-8 md:mb-10 max-w-2xl mx-auto">
            Hãy cùng chúng tôi trải nghiệm vẻ đẹp của nghệ thuật thủ công Việt Nam
          </p>
          <Link to="/products" className="btn-primary !bg-terracotta inline-flex items-center gap-2 text-base md:text-lg px-8 py-4">
            Xem Sản Phẩm <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
