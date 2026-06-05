/**
 * ============================================================
 * DATA LAYER - DataSource: productData
 * Dữ liệu sản phẩm thật của cửa hàng - loa karaoke ALOKIO.
 * Ảnh + video nằm trong: web\src\assets\sản phẩm\
 * (mỗi thư mục con = 1 sản phẩm, chứa nhiều ảnh mô tả).
 *
 * LƯU Ý: GIÁ BÁN là giá mẫu, bạn chỉnh lại theo giá thực tế tại đây.
 * ============================================================
 */
const IMG_BASE = 'src/assets/sản phẩm';

/**
 * Helper: tạo mảng đường dẫn ảnh cho 1 sản phẩm.
 * encodeURI để xử lý tên thư mục có dấu cách & tiếng Việt.
 * @param {string} folder - Tên thư mục sản phẩm
 * @param {(string|number)[]} files - Tên file ảnh (không cần .png)
 * @returns {string[]}
 */
const img = (folder, files) =>
  files.map((f) => encodeURI(`${IMG_BASE}/${folder}/${f}.png`));

/**
 * Video khách hàng hát thử tại cửa hàng (file .mp4 nằm cùng
 * thư mục "sản phẩm"). Hiển thị ở section video trên trang chủ.
 */
const customerVideos = [
  {
    id: 1,
    title: 'Khách hát thử cùng loa Alokio',
    src: encodeURI(`${IMG_BASE}/7903426131505.mp4`),
  },
  {
    id: 2,
    title: 'Trải nghiệm karaoke tại cửa hàng',
    src: encodeURI(`${IMG_BASE}/7903425700253.mp4`),
  },
  {
    id: 3,
    title: 'Giọng hát khách hàng cùng micro Alokio',
    src: encodeURI(`${IMG_BASE}/7903425011264.mp4`),
  },
];

const productData = [
  {
    id: 1,
    name: 'Loa xách tay Alokio V22 - Đen',
    brand: 'Alokio',
    category: 'Loa xách tay',
    price: 3290000,
    oldPrice: 3990000,
    description:
      'Loa xách tay karaoke Alokio V22 màu Đen sang trọng, công suất 800W ' +
      'với 2 bass 20 cho âm thanh mạnh mẽ, echo siêu hay. Tặng kèm combo ' +
      '2 micro không dây UHF, bảo hành 12 tháng. Nhỏ gọn dễ mang theo, ' +
      'hát hay ở mọi nơi.',
    specs: {
      'Loại loa': 'Loa xách tay karaoke',
      'Công suất': '800W',
      'Bass': '2 bass 20',
      'Echo': 'Echo siêu hay',
      'Màu sắc': 'Đen',
      'Tặng kèm': 'Combo 2 micro UHF',
      'Bảo hành': '12 tháng',
    },
    images: img('V22 - Đen', [1, 2, 3, 4, 5, 6, 7]),
    rating: 4.8,
    stock: 15,
    featured: true,
  },
  {
    id: 2,
    name: 'Loa xách tay Alokio V22 - Xanh',
    brand: 'Alokio',
    category: 'Loa xách tay',
    price: 3290000,
    oldPrice: 3990000,
    description:
      'Loa xách tay karaoke Alokio V22 màu Xanh trẻ trung nổi bật, ' +
      'công suất 800W với 2 bass 20, echo siêu hay. Tặng kèm combo 2 micro ' +
      'không dây UHF, bảo hành 12 tháng. Thiết kế retro tinh tế, ' +
      'phù hợp cả nghe nhạc lẫn hát karaoke.',
    specs: {
      'Loại loa': 'Loa xách tay karaoke',
      'Công suất': '800W',
      'Bass': '2 bass 20',
      'Echo': 'Echo siêu hay',
      'Màu sắc': 'Xanh',
      'Tặng kèm': 'Combo 2 micro UHF',
      'Bảo hành': '12 tháng',
    },
    images: img('V22 - Xanh', [1, 2, 3, 4, 5, 6, 7]),
    rating: 4.8,
    stock: 12,
    featured: true,
  },
  {
    id: 3,
    name: 'Loa xách tay Alokio V22 - Cam',
    brand: 'Alokio',
    category: 'Loa xách tay',
    price: 3290000,
    oldPrice: 3990000,
    description:
      'Loa xách tay karaoke Alokio V22 màu Cam cá tính, công suất 800W ' +
      'với 2 bass 20, echo siêu hay. Tặng kèm combo 2 micro không dây UHF, ' +
      'bảo hành 12 tháng. Gam màu ấn tượng dành cho người yêu phong cách khác biệt.',
    specs: {
      'Loại loa': 'Loa xách tay karaoke',
      'Công suất': '800W',
      'Bass': '2 bass 20',
      'Echo': 'Echo siêu hay',
      'Màu sắc': 'Cam',
      'Tặng kèm': 'Combo 2 micro UHF',
      'Bảo hành': '12 tháng',
    },
    images: img('V22 - CAm', [1, 12, 13, 14, 16, 17, 22]),
    rating: 4.7,
    stock: 8,
    featured: false,
  },
  {
    id: 4,
    name: 'Loa xách tay Alokio A999',
    brand: 'Alokio',
    category: 'Loa xách tay',
    price: 3990000,
    oldPrice: 4590000,
    description:
      'Loa xách tay karaoke Alokio A999 công suất 900W với 2 bass 20, ' +
      'echo siêu hay. Tặng kèm combo 2 micro sạc UHF cao cấp, bảo hành 12 tháng. ' +
      'Vỏ gỗ vân sang trọng, công suất lớn nhất dòng xách tay của Alokio.',
    specs: {
      'Loại loa': 'Loa xách tay karaoke',
      'Công suất': '900W',
      'Bass': '2 bass 20',
      'Echo': 'Echo siêu hay',
      'Tặng kèm': 'Combo 2 micro sạc UHF',
      'Bảo hành': '12 tháng',
    },
    images: img('A999', [1, 2, 3, 4, 5, 6, 7, 8]),
    rating: 4.9,
    stock: 9,
    featured: true,
  },
  {
    id: 5,
    name: 'Loa xách tay Alokio A888',
    brand: 'Alokio',
    category: 'Loa xách tay',
    price: 2790000,
    oldPrice: 3290000,
    description:
      'Loa xách tay karaoke Alokio A888 công suất 600W với 2 bass 20, ' +
      'echo siêu hay. Tặng kèm combo 2 micro không dây VHF, bảo hành 12 tháng. ' +
      'Thiết kế vỏ gỗ màu kem thanh lịch, mức giá dễ tiếp cận.',
    specs: {
      'Loại loa': 'Loa xách tay karaoke',
      'Công suất': '600W',
      'Bass': '2 bass 20',
      'Echo': 'Echo siêu hay',
      'Tặng kèm': 'Combo 2 micro VHF',
      'Bảo hành': '12 tháng',
    },
    images: img('A888', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]),
    rating: 4.7,
    stock: 20,
    featured: true,
  },
  {
    id: 6,
    name: 'Loa xách tay Alokio V20',
    brand: 'Alokio',
    category: 'Loa xách tay',
    price: 1990000,
    oldPrice: 2490000,
    description:
      'Loa xách tay karaoke Alokio V20 với treble thạch anh trong trẻo, ' +
      'bass 20 chắc khỏe. Tặng kèm combo 2 micro không dây VHF, giao hàng miễn phí, ' +
      'bảo hành 12 tháng. Nhỏ gọn nhất dòng Alokio - giá mềm cho người mới bắt đầu.',
    specs: {
      'Loại loa': 'Loa xách tay karaoke',
      'Treble': 'Treble thạch anh',
      'Bass': 'Bass 20',
      'Tặng kèm': 'Combo 2 micro VHF',
      'Bảo hành': '12 tháng',
      'Vận chuyển': 'Giao hàng miễn phí',
    },
    images: img('V20', [23, 25, 27, 28, 29, 30, 31, 32, 33, 34, 35]),
    rating: 4.6,
    stock: 25,
    featured: false,
  },
];
