# AlokioStore - Website bán loa karaoke

Website bán loa hoàn chỉnh xây dựng bằng **HTML5 + CSS3 + Vanilla JavaScript (ES6)**,
không dùng framework, theo mô hình **Clean Architecture 3 tầng**.
**Mở thẳng `index.html` bằng trình duyệt là chạy — không cần cài gì thêm.**

## 1. Cách chạy

Mở file `web\index.html` bằng Chrome/Edge (nhấp đúp là xong).

Toàn bộ ảnh, video nằm gọn trong `web\src\assets\` — chỉ cần copy
nguyên thư mục `web` là mang website đi đâu cũng chạy.

> Lần đầu sau khi tải code: nhấp đúp `DON-DEP-BAM-VAO-DAY.bat` (1 lần duy nhất)
> để tự động chuyển ảnh/video từ thư mục `website` cũ vào `web` và dọn file thừa.

## 2. Cây thư mục source code

```
web/
├── index.html                      # Trang duy nhất (SPA), nạp script theo thứ tự 3 tầng
├── README.md
└── src/
    ├── presentation/               # TẦNG GIAO DIỆN
    │   ├── app.js                  # Khởi động app + Router (hash) + DI
    │   ├── pages/
    │   │   ├── HomePage.js         # Banner, nổi bật, khuyến mãi, video khách hát
    │   │   ├── ProductsPage.js     # Danh sách + tìm kiếm + lọc + sắp xếp + phân trang
    │   │   ├── ProductDetailPage.js# Chi tiết + gallery ảnh + thêm giỏ
    │   │   ├── CheckoutPage.js     # Form thanh toán + validate
    │   │   └── ContactPage.js      # Liên hệ + Google Map vị trí cửa hàng
    │   ├── components/
    │   │   ├── Header.js           # Logo, menu, tìm kiếm, dark mode, giỏ hàng
    │   │   ├── Footer.js
    │   │   ├── ProductCard.js      # Card sản phẩm + skeleton
    │   │   ├── CartSidebar.js      # Giỏ hàng trượt từ phải
    │   │   ├── Toast.js            # Thông báo nổi
    │   │   └── uiHelpers.js        # formatPrice, escapeHtml, renderStars...
    │   └── styles/
    │       ├── base.css            # Biến màu, reset, header/footer, hero, dark mode
    │       ├── components.css      # Card, giỏ hàng, form, toast, skeleton, video...
    │       └── responsive.css      # Desktop 4 cột / Tablet 2 cột / Mobile 1 cột
    ├── business/                   # TẦNG NGHIỆP VỤ
    │   ├── services/
    │   │   ├── ProductService.js   # Sản phẩm, nổi bật, video, phân trang
    │   │   └── CartService.js      # Thêm/xóa/cập nhật giỏ, tính tổng (Observer)
    │   ├── usecases/
    │   │   ├── SearchUseCase.js    # Tìm theo tên/thương hiệu (hỗ trợ không dấu)
    │   │   ├── FilterUseCase.js    # Lọc theo dòng loa + khoảng giá
    │   │   └── SortUseCase.js      # Giá tăng/giảm, đánh giá cao
    │   └── validators/
    │       └── CheckoutValidator.js# Kiểm tra họ tên, SĐT, địa chỉ, email
    ├── data/                       # TẦNG DỮ LIỆU
    │   ├── datasource/
    │   │   ├── storeInfo.js        # Logo, địa chỉ (Google Map), SĐT, email
    │   │   └── productData.js      # 6 loa xách tay Alokio + 3 video (SỬA GIÁ TẠI ĐÂY)
    │   ├── models/
    │   │   ├── Product.js
    │   │   └── CartItem.js
    │   └── repositories/
    │       ├── ProductRepository.js# Cung cấp sản phẩm/video (giả lập API có delay)
    │       └── CartRepository.js   # Lưu/đọc giỏ hàng từ LocalStorage
    └── assets/
        ├── img/
        │   └── picture.jpg         # Ảnh lớn hero banner trang chủ
        ├── sản phẩm/               # Ảnh từng sản phẩm (mỗi thư mục con = 1 loa)
        │   ├── V22 - Đen/ ...      # + 3 video khách hát (.mp4)
        │   └── ...
        └── images/
            └── placeholder.svg     # Ảnh dự phòng khi ảnh sản phẩm bị lỗi
```

Quy tắc phụ thuộc một chiều: `Presentation → Business → Data`.
Script được nạp trong `index.html` theo đúng thứ tự đó (không dùng ES Module
để có thể mở trực tiếp `index.html` mà không cần web server).


## 3. Chức năng

- Trang chủ: hero banner (ảnh `src/assets/img/picture.jpg`), sản phẩm nổi bật,
  khuyến mãi, **3 video khách hát thử tại cửa hàng**
- Danh sách: grid responsive (4/2/1 cột), tìm kiếm (hỗ trợ không dấu),
  lọc theo khoảng giá, sắp xếp (giá tăng/giảm, đánh giá), phân trang
- Chi tiết: gallery nhiều ảnh, thông số kỹ thuật, chọn số lượng, thêm giỏ
- Giỏ hàng: sidebar trượt từ phải, tăng/giảm/xóa, tính tổng, lưu **LocalStorage**
- Thanh toán: form họ tên / SĐT / địa chỉ / email, validate chi tiết từng ô
- Liên hệ: thông tin cửa hàng (bấm gọi / gửi mail), form gửi tin nhắn,
  **Google Map nhúng** xem vị trí + nút "Chỉ đường" mở Google Maps
- Nâng cao: **Dark Mode** (lưu lựa chọn), **Toast notification**,
  **Skeleton loading**, **Pagination**, **menu hamburger** trên mobile,
  chặn đặt quá số lượng tồn kho

## 4. Tùy chỉnh nhanh

| Muốn sửa | Sửa ở đâu |
|---|---|
| **Địa chỉ cửa hàng (Google Map), SĐT, email, logo** | `src/data/datasource/storeInfo.js` |
| Giá bán, mô tả, tồn kho | `src/data/datasource/productData.js` |
| Thêm sản phẩm mới | Thêm 1 object vào `productData.js` (ảnh để trong 1 thư mục con mới trong `web\src\assets\sản phẩm`) |
| Thêm/đổi video khách hát | Mảng `customerVideos` trong `productData.js` |
| Đổi ảnh hero | Thay file `web\src\assets\img\picture.jpg` (giữ nguyên tên) |
| Màu sắc giao diện | Biến `:root` trong `src/presentation/styles/base.css` |
| Khoảng giá bộ lọc | `PRICE_RANGES` trong `src/business/usecases/FilterUseCase.js` |
| Số sản phẩm mỗi trang | `PER_PAGE` trong `src/presentation/pages/ProductsPage.js` |
| Thông tin liên hệ footer | `src/presentation/components/Footer.js` |
