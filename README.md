# ArtisanVN - Tinh Hoa Nghệ Thuật Thủ Công Việt Nam

ArtisanVN là một nền tảng thương mại điện tử (E-commerce) cao cấp, được thiết kế để tôn vinh và đưa các sản phẩm thủ công mỹ nghệ tinh xảo từ các làng nghề truyền thống Việt Nam đến gần hơn với khách hàng hiện đại. Dự án kết hợp công nghệ web tiên tiến với sức mạnh của AI để tạo ra một trải nghiệm mua sắm sang trọng, đồng nhất và tin cậy.

## 🚀 Tính Năng Chính

### 💎 Trải Nghiệm Mua Sắm (Frontend)
- **Giao diện Premium:** Thiết kế Mobile-first, phong cách hiện đại với hiệu ứng mượt mà (Glassmorphism, Micro-animations).
- **Hình ảnh AI-Generated:** Toàn bộ tư liệu hình ảnh được tạo bởi AI Gemini, đảm bảo tính thẩm mỹ cao và sự nhất quán trên toàn hệ thống.
- **Giỏ hàng Thông minh:** Tự động tính toán phí vận chuyển, áp dụng voucher và quản lý trạng thái giỏ hàng thời gian thực.
- **Thanh toán & Tra cứu:** Quy trình Checkout tối giản và hệ thống tra cứu đơn hàng linh hoạt theo **Mã đơn** hoặc **Số điện thoại**.

### 🛠 Hệ Thống Quản Trị (Admin Dashboard)
- **Tổng quan Kinh doanh:** Dashboard thống kê doanh thu, đơn hàng, sản phẩm và tin nhắn chờ xử lý với biểu đồ trực quan.
- **Quản lý Sản phẩm & Danh mục:** Hệ thống CRUD (Thêm, Sửa, Xóa) mạnh mẻ, hỗ trợ quản lý kho và phân loại sản phẩm.
- **Quản lý Nghệ nhân:** Tôn vinh và quản lý thông tin các nghệ nhân - những người tạo ra linh hồn cho sản phẩm.
- **Điều phối Đơn hàng:** Theo dõi và cập nhật trạng thái đơn hàng (Confirmed, Shipping, Completed...).
- **Quản lý Phản hồi & Đánh giá:** Phê duyệt/Ẩn các đánh giá từ khách hàng và quản lý tin nhắn liên hệ tập trung.
- **CMS Trang chủ:** Linh hoạt chỉnh sửa các banner slide và danh sách sản phẩm nổi bật trực tiếp từ admin.

## 🧱 Công Nghệ & Kiến Trúc

- **Core:** React 18, Vite, React Router 6.
- **Database & Auth:** Firebase Firestore, Firebase Authentication.
- **Styling:** Modern Vanilla CSS (Không dùng thư viện utility giúp mã nguồn sạch và tốc độ tải trang nhanh).
- **Assets:** Lucide icons, Google Fonts (Outfit, Inter).
- **Tooling:** Git (via WSL), AI Gemini (Design & Content).

## 📂 Tổ Chức Thư Mục

```text
src/
├── pages/
│   ├── Admin/          # Dashboard quản trị (Phân chia theo Module)
│   ├── Main/           # Các trang chính (Home, Shop, Project...)
│   └── User/           # Checkout, Tracking...
├── context/            # Quản lý State toàn cục (Cart, Admin)
├── assets/             # Biểu tượng, font chữ
└── firebase/           # Cấu hình Firestore & Seeding data
```

## 📥 Cài Đặt & Chạy

1. **Cài đặt dự án:**
   ```bash
   npm install
   ```

2. **Cấu hình Môi trường:** Tạo file `.env` với cấu hình Firebase (Xem mẫu trong tài liệu nội bộ).

3. **Chạy ứng dụng:**
   ```bash
   npm run dev
   ```

4. **Reseed dữ liệu (nếu cần):** Thêm query `?reseed=true` vào URL trang chủ để khởi tạo dữ liệu mẫu lên Firestore.

---
© 2024 **ArtisanVN Team** - Vì một nền thủ công Việt vươn tầm thế giới.
