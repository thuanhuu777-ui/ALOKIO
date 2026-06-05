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

## 5. Hướng dẫn chi tiết Thêm / Sửa sản phẩm

Mọi thông tin về sản phẩm của website đều được quản lý tập trung tại file **`src/data/datasource/productData.js`**. Để sửa mô tả hoặc thêm sản phẩm, bạn chỉ cần mở file này lên bằng bất kỳ trình soạn thảo văn bản nào (Notepad, VS Code, v.v.).

### 5.1. Cấu trúc của một sản phẩm
Trong file `productData.js`, tìm đến mảng `productData`. Mỗi sản phẩm được khai báo dưới dạng một "object" nằm trong cặp ngoặc nhọn `{ ... }`. Ví dụ:

```javascript
{
  id: 1, // Mã sản phẩm (nên để số tăng dần, không trùng nhau)
  name: 'Loa xách tay Alokio V22 - Đen', // Tên hiển thị
  brand: 'Alokio', // Thương hiệu
  category: 'Loa xách tay', // Danh mục
  price: 3290000, // Giá bán hiện tại (để số viết liền, không có dấu phẩy)
  oldPrice: 3990000, // Giá cũ (giá gạch ngang)
  description: 'Loa xách tay karaoke Alokio V22...', // Mô tả dài của sản phẩm
  specs: { // Thông số kỹ thuật (hiện dạng bảng ở trang chi tiết)
    'Loại loa': 'Loa xách tay karaoke',
    'Công suất': '800W',
    'Bảo hành': '12 tháng'
  },
  images: img('V22 - Đen', [1, 2, 3]), // Hình ảnh (xem HD thêm ảnh bên dưới)
  rating: 4.8, // Số sao đánh giá (hiển thị giao diện)
  stock: 15, // Số lượng tồn kho (khách không thể mua quá số này)
  featured: true, // true: Hiện ở mục "Sản phẩm nổi bật" trang chủ, false: Ẩn
}
```

### 5.2. Cách sửa nội dung (Tên, Giá, Mô tả)
1. Mở file `src/data/datasource/productData.js`.
2. Kéo xuống phần `productData = [ ... ]` và tìm sản phẩm bạn muốn sửa.
3. Sửa thông tin nằm trong cặp dấu nháy đơn `''` hoặc thay đổi các con số:
   - **Sửa mô tả:** Thay đổi văn bản ở dòng `description: '...'`. Có thể dùng dấu `+` để nối các đoạn văn bản dài cho dễ đọc.
   - **Sửa giá:** Thay đổi con số ở `price:` và `oldPrice:`. Không nhập dấu chấm hay phẩy (VD: đúng là `3290000`, sai là `3.290.000`).
   - **Sửa thông số kỹ thuật:** Trong phần `specs: { ... }`, bạn có thể thêm hoặc sửa bất kỳ dòng `"Tên thông số": "Giá trị"` nào.

### 5.3. Cách thêm 1 sản phẩm hoàn toàn mới
**Bước 1: Chuẩn bị hình ảnh**
1. Vào thư mục `src/assets/sản phẩm/`
2. Tạo một thư mục con mới cho sản phẩm, ví dụ đặt tên là `Loa ABC`.
3. Copy hình ảnh của sản phẩm vào thư mục đó, và đổi tên ảnh thành các con số: `1.png`, `2.png`, `3.png`... (Lưu ý: Bắt buộc dùng đuôi `.png`).

**Bước 2: Thêm dữ liệu vào file**
1. Mở file `src/data/datasource/productData.js`.
2. Kéo xuống ngay phía trên dấu `];` cuối cùng của file (đây là nơi kết thúc danh sách sản phẩm).
3. Đảm bảo sản phẩm trước đó kết thúc bằng dấu phẩy `,`.
4. Copy toàn bộ một khối mã `{ ... }` của một sản phẩm cũ và dán xuống dưới.
5. Đổi `id:` thành một số mới chưa từng được sử dụng (ví dụ: `7`).
6. Sửa tên, giá, mô tả theo ý bạn.
7. Đổi đường dẫn hình ảnh cho khớp với tên thư mục vừa tạo. Ví dụ thư mục là `Loa ABC` và có 3 ảnh, bạn sửa thành: `images: img('Loa ABC', [1, 2, 3]),`.
8. Lưu file lại và tải lại (F5) trang web để xem thành quả!
