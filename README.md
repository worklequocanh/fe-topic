# ArtisanVN - Tinh Hoa Nghệ Thuật Thủ Công Việt Nam

ArtisanVN là một nền tảng thương mại điện tử hiện đại dành riêng cho các sản phẩm thủ công mỹ nghệ cao cấp từ các làng nghề truyền thống Việt Nam. Dự án được xây dựng với trải nghiệm người dùng cao cấp, hình ảnh AI sống động và hệ thống quản lý dữ liệu mạnh mẽ dựa trên Firebase.

## 🚀 Tính Năng Nổi Bật

### 🎨 Trải Nghiệm Người Dùng & Thiết Kế
- **Giao diện Premium:** Sử dụng phong cách thiết kế hiện đại, tối giản, tập trung vào việc tôn vinh vẻ đẹp của sản phẩm.
- **Hình ảnh AI sống động:** Toàn bộ tư liệu hình ảnh (Banners, Categories, Products) được tạo bởi AI Gemini, đảm bảo tính thẩm mỹ, nhất quán và độc quyền.
- **Hiệu ứng mượt mà:** Sử dụng các hiệu ứng micro-animations, glassmorphism và jQuery để tạo cảm giác sang trọng.

### 📦 Quản Lý Sản Phẩm & Giỏ Hàng
- **Phân loại danh mục:** Gốm sứ, Tranh vẽ, Đồ gỗ, Trang sức.
- **Chi tiết sản phẩm:** Cung cấp thông tin chi tiết về nghệ nhân, chất liệu, kích thước và đánh giá từ khách hàng.
- **Giỏ hàng linh hoạt:** Quản lý số lượng, tính toán phí vận chuyển thông minh (Miễn phí từ đơn 2.000.000đ).

### 💳 Thanh Toán & Tra Cứu Đơn Hàng (MỚI)
- **Checkout nhanh chóng:** Quy trình thanh toán đơn giản, lưu trữ trực tiếp vào Firebase Firestore.
- **Tra cứu đơn hàng thông minh:** 
  - Tra cứu theo **Mã đơn hàng** để xem chi tiết tình trạng.
  - Tra cứu theo **Số điện thoại** để xem danh sách toàn bộ lịch sử mua hàng.
- **Quản lý trạng thái:** Hệ thống cập nhật trạng thái đơn hàng (Pending, Confirmed, Shipping, Completed, Cancelled).

## 🛠 Công Nghệ Sử Dụng

- **Frontend:** React.js, Vite, React Router 6.
- **Styling:** Vanilla CSS (Bố cục hiện đại, Mobile-friendly).
- **Backend & Database:** Firebase Firestore.
- **Icons:** Lucide-react.
- **Thư viện bổ trợ:** jQuery (cho sticky header & animations).
- **AI Tooling:** Gemini Banana (Generation tư liệu hình ảnh).

## 📥 Hướng Dẫn Cài Đặt

1. **Clone project:**
   ```bash
   git clone [link-repo]
   cd fe-topic
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

3. **Cấu hình Firebase:**
   - Tạo file `src/firebase.js` và dán cấu hình Firebase SDK của bạn vào.

4. **Khởi tạo dữ liệu mẫu (Seeding):**
   - Chạy ứng dụng (`npm run dev`).
   - Truy cập URL: `http://localhost:5173/?reseed=true` để tự động đẩy dữ liệu mẫu và hình ảnh AI lên Firestore.

5. **Chạy ứng dụng:**
   ```bash
   npm run dev
   ```

## 📂 Cấu trúc thư mục chính

- `src/firebase/`: Chứa cấu hình kết nối và logic đẩy dữ liệu mẫu (`seedData.js`).
- `src/context/`: Quản lý trạng thái giỏ hàng (`CartContext.js`).
- `src/pages/`: Chứa các trang chính (Home, Products, Checkout, TrackOrder...).
- `public/images/`: Toàn bộ kho ảnh AI được phân loại theo thư mục (banners, categories, products, team).

---
© 2024 **ArtisanVN Team** - Vì một nền thủ công Việt vươn tầm thế giới.
