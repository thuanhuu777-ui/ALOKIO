/**
 * ============================================================
 * PRESENTATION LAYER - uiHelpers
 * Các hàm tiện ích nhỏ cho việc render giao diện.
 * ============================================================
 */

/** Ảnh hiển thị khi ảnh sản phẩm bị lỗi / chưa tồn tại */
const FALLBACK_IMAGE = 'src/assets/images/placeholder.svg';

/**
 * Định dạng tiền Việt Nam: 3290000 -> "3.290.000đ"
 * @param {number} amount
 * @returns {string}
 */
function formatPrice(amount) {
  return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
}

/**
 * Chống XSS khi chèn chuỗi vào HTML.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/**
 * Render sao đánh giá: 4.8 -> "★★★★★ 4.8"
 * @param {number} rating - 0..5
 * @returns {string} HTML
 */
function renderStars(rating) {
  const full = Math.round(rating);
  const stars = '★'.repeat(full) + '☆'.repeat(5 - full);
  return `<span class="stars" aria-label="${rating} trên 5 sao">${stars}</span>
          <span class="rating-value">${rating.toFixed(1)}</span>`;
}

/**
 * Render thẻ <img> có sẵn fallback khi lỗi ảnh.
 * (Sự kiện error được bắt toàn cục trong app.js)
 */
function imgTag(src, alt, className = '') {
  return `<img src="${src}" alt="${escapeHtml(alt)}" class="${className}" loading="lazy">`;
}
