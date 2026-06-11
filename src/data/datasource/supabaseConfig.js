/**
 * ============================================================
 * DATA LAYER - DataSource: supabaseConfig
 * Kết nối database Supabase.
 *
 * >>> CÁCH LẤY 2 GIÁ TRỊ DƯỚI ĐÂY <<<
 * 1. Vào https://supabase.com/dashboard → chọn project
 * 2. Settings → API
 * 3. Copy "Project URL"  → dán vào SUPABASE_URL
 * 4. Copy "anon public" key → dán vào SUPABASE_ANON_KEY
 *
 * Khi 2 giá trị còn để trống: website tự dùng dữ liệu local
 * trong productData.js (vẫn chạy bình thường, không lỗi).
 * ============================================================
 */
const SUPABASE_URL = 'https://cqsshlgxbcacdkdrfles.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_cgp5aa8QFIwVIWF0krUulA_hiNH5W0u'; 

/**
 * Client Supabase dùng chung cho toàn bộ Data Layer.
 * = null khi chưa cấu hình hoặc thư viện CDN chưa tải được.
 */
const supabaseClient =
  SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

/**
 * Đổi đường dẫn file trong Storage bucket "media" thành URL đầy đủ.
 * Nếu đã là link http thì giữ nguyên.
 * @param {string} path - vd: 'sản phẩm/A999/1.png'
 * @returns {string}
 */
function mediaUrl(path) {
  if (/^https?:/i.test(path)) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/media/${encodeURI(path)}`;
}
