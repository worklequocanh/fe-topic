# BÁO CÁO KẾT QUẢ ĐỒ ÁN CUỐI KỲ: DỰ ÁN ARTISANVN

## 1. Thông Tin Chung
- **Tên dự án:** ArtisanVN - Nền tảng thương mại điện tử Thủ công mỹ nghệ.
- **Loại hình:** Web Application (Single Page Application - SPA).
- **Mục tiêu:** Xây dựng cầu nối giữa làng nghề truyền thống và khách hàng hiện đại, ứng dụng công nghệ AI để tối ưu hóa nội dung hình ảnh.

## 2. Phân Tích Hệ Thống

### 2.1. Đối Tượng Người Dùng
- **Khách hàng:** Tìm kiếm sản phẩm, đặt hàng, theo dõi đơn hàng và gửi phản hồi.
- **Quản trị viên (Admin):** Quản lý sản phẩm, đơn đặt hàng, nội dung website và nghệ nhân.

### 2.2. Kiến Trúc Kỹ Thuật
- **Cấu trúc:** Client-Server kiến trúc phi tập trung (Serverless) sử dụng Firebase.
- **Tổ chức mã nguồn:** Áp dụng mô hình **Modular Architecture** (đặc biệt là phân vùng Admin) giúp dễ dàng mở rộng và bảo trì.

## 3. Các Module Chức Năng Đã Hoàn Thành

### 3.1. Phân Hệ Người Dùng (Client Site)
- **Trang chủ (Home):** Hiển thị Banner động, danh mục nổi bật và sản phẩm đề xuất.
- **Cửa hàng (Shop):** Tìm kiếm và lọc sản phẩm theo danh mục/giá.
- **Giỏ hàng (Cart):** Tính toán logic phí vận chuyển linh hoạt.
- **Thanh toán (Checkout):** Thu thập thông tin khách đơn giản hóa, bảo mật qua Firebase.
- **Tra cứu (Order Tracking):** Truy vấn dữ liệu theo thời gian thực (Real-time) từ Firestore.

### 3.2. Phân Hệ Quản Trị (Admin Site)
- **Hệ thống Dashboard:** Tổng hợp chỉ số kinh doanh thu thực tế (Revenue), đơn hàng (Orders).
- **Quản lý Danh mục & Sản phẩm:** Toàn diện quy trình CRUD với giao diện hiện đại.
- **Quản lý Đánh giá & Liên hệ:** Hệ thống phê duyệt bình luận khách hàng giúp kiểm soát chất lượng nội dung.
- **CMS Control:** Cho phép thay đổi giao diện trang chủ mà không cần can thiệp vào code.

## 4. Đặc Điểm Nổi Bật Về Kỹ Thuật

- **UI/UX:** Sử dụng Vanilla CSS thuần túy kết hợp Flexbox/Grid hiện đại, đạt tốc độ tải trang cao và tương thích tốt trên thiết bị di động.
- **Dữ Liệu:** Sử dụng **Firebase Firestore** với cấu hình bảo mật `rules` nghiêm ngặt và giải pháp **Seeding Data** tự động.
- **AI Integration:** Ứng dụng AI Gemini để thiết kế giao diện và tạo ra bộ asset hình ảnh đồng nhất, giúp dự án mang chất riêng biệt (Unique).
- **Git Workflow:** Quản lý mã nguồn theo Atomic Commits qua môi trường WSL, đảm bảo lịch sử phát triển minh bạch.

## 5. Đánh giá & Kết luận
Dự án đã hoàn thành đầy đủ các yêu cầu cốt lõi của một nền tảng thương mãi điện tử hiện đại. Hệ thống hoạt động ổn định, dữ liệu đồng bộ mượt mà giữa Client và Admin. 

**Hướng phát triển tương lai:**
- Tích hợp cổng thanh toán trực tuyến (VNPay/Momo).
- Hệ thống Recommendation System dựa trên hành vi khách hàng.
- Nâng cấp khả năng quản lý Team và Đa ngôn ngữ.

---
*Ngày hoàn thành: 12/03/2026*
*Người thực hiện: ArtisanVN Team*
