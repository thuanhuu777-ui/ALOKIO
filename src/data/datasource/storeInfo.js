/**
 * ============================================================
 * DATA LAYER - DataSource: storeInfo
 * Thông tin cửa hàng dùng chung cho Header, Footer,
 * trang Liên hệ và Google Map.
 *
 * >>> SỬA THÔNG TIN CỬA HÀNG TẠI ĐÂY <<<
 * ============================================================
 */
const STORE_INFO = {
  name: 'ALOKIO',
  slogan: 'Loa xách tay karaoke chính hãng',

  /** Logo cửa hàng (ảnh online; lỗi mạng sẽ tự ẩn) */
  logo: 'https://i.postimg.cc/0j2LkcVv/logo-2-1.png',

  /** Địa chỉ hiển thị trên website */
  address: '449/39 Trường Trinh, Tân Bình, Hồ Chí Minh',

  /**
   * Tên địa điểm trên Google Map (đúng theo tên đăng ký trên Google)
   * - dùng để nhúng bản đồ chỉ đúng vị trí cửa hàng.
   */
  mapQuery: 'Tổng Kho Loa Kéo Alokio, Hẻm 449/39 Trường Trình, Tân Bình, Hồ Chí Minh',

  /** Link chia sẻ Google Maps (bấm "Chỉ đường" sẽ mở link này) */
  mapShareLink: 'https://maps.app.goo.gl/yUSPdzUE7ujLzTQB6',

  phone: '0382.181.317',
  email: 'thuanhuu777@gmail.com',
  workingHours: 'Thứ 2 - Chủ nhật: 8:00 - 21:00',

  /**
   * Thông tin thanh toán chuyển khoản (hiện ở bước thanh toán).
   * Chính sách: KHÁCH THANH TOÁN TRƯỚC - CỬA HÀNG GỬI HÀNG SAU.
   */
  payment: {
    bank: 'Vietcombank',
    accountName: 'NGUYEN HUU THUAN',
    accountNumber: '1051000275760',
    branch: 'Trụ sở CN Bắc Gia Lai',
    qrImage: 'src/assets/images/QR_thanhtoan.jpg',
  },

  /** Mạng xã hội - 4 bóng chat góc dưới phải */
  socials: {
    zalo: 'https://zalo.me/0382181317',
    facebook: 'https://www.facebook.com/profile.php?id=61583864592963',
    tiktok: 'https://www.tiktok.com/@loakeoalokio.amthanhviet',
    shopee: 'https://shopee.vn/thuanloakeo777',
  },
};

/** Link nhúng Google Map (iframe) theo địa điểm ở trên */
const STORE_MAP_EMBED_URL =
  'https://www.google.com/maps?q=' +
  encodeURIComponent(STORE_INFO.mapQuery) +
  '&output=embed';

/** Link mở Google Map ở tab mới / app bản đồ để chỉ đường */
const STORE_MAP_LINK = STORE_INFO.mapShareLink;
