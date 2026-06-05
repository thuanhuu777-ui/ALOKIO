/**
 * ============================================================
 * PRESENTATION LAYER - Page: ContactPage (Liên hệ)
 * Thông tin cửa hàng + form gửi tin nhắn + Google Map
 * (xem vị trí ngay trên trang hoặc bấm "Chỉ đường" để mở
 * Google Maps).
 * ============================================================
 */
/* global Toast, escapeHtml */

class ContactPage {
  /**
   * @param {Object} deps
   * @param {Object} deps.storeInfo - Thông tin cửa hàng (STORE_INFO)
   * @param {string} deps.mapEmbedUrl - Link nhúng Google Map
   * @param {string} deps.mapLink - Link mở Google Map chỉ đường
   */
  constructor({ storeInfo, mapEmbedUrl, mapLink }) {
    this.storeInfo = storeInfo;
    this.mapEmbedUrl = mapEmbedUrl;
    this.mapLink = mapLink;
  }

  /**
   * @param {HTMLElement} container
   */
  async render(container) {
    const info = this.storeInfo;

    container.innerHTML = `
      <div class="container section fade-in">
        <h1 class="page-title">Liên hệ với chúng tôi</h1>
        <p class="contact-intro">
          Hãy ghé cửa hàng để nghe thử loa trực tiếp, hoặc gửi tin nhắn -
          ${escapeHtml(info.name)} sẽ phản hồi trong thời gian sớm nhất.
        </p>

        <!-- 4 ô thông tin liên hệ -->
        <div class="contact-grid">
          <a class="contact-card" href="tel:${info.phone.replace(/[^\d+]/g, '')}">
            <span class="contact-card__icon">📞</span>
            <h3>Điện thoại</h3>
            <p>${escapeHtml(info.phone)}</p>
          </a>
          <a class="contact-card" href="mailto:${info.email}">
            <span class="contact-card__icon">✉️</span>
            <h3>Email</h3>
            <p>${escapeHtml(info.email)}</p>
          </a>
          <a class="contact-card" href="${this.mapLink}" target="_blank" rel="noopener">
            <span class="contact-card__icon">📍</span>
            <h3>Địa chỉ</h3>
            <p>${escapeHtml(info.address)}</p>
          </a>
          <div class="contact-card">
            <span class="contact-card__icon">🕐</span>
            <h3>Giờ mở cửa</h3>
            <p>${escapeHtml(info.workingHours)}</p>
          </div>
        </div>

        <div class="contact-layout">
          <!-- Form gửi tin nhắn -->
          <form class="checkout-form contact-form" id="contact-form" novalidate>
            <h3>Gửi tin nhắn cho cửa hàng</h3>
            <div class="form-group">
              <label for="ct-name">Họ và tên *</label>
              <input type="text" id="ct-name" placeholder="Nguyễn Văn A">
            </div>
            <div class="form-group">
              <label for="ct-phone">Số điện thoại *</label>
              <input type="tel" id="ct-phone" placeholder="0912345678">
            </div>
            <div class="form-group">
              <label for="ct-message">Nội dung *</label>
              <textarea id="ct-message" rows="4"
                placeholder="Tôi muốn hỏi về loa V22 màu cam..."></textarea>
            </div>
            <button type="submit" class="btn btn--accent btn--block">
              Gửi tin nhắn
            </button>
          </form>

          <!-- Google Map: xem vị trí cửa hàng -->
          <div class="contact-map">
            <h3>Vị trí cửa hàng trên bản đồ</h3>
            <div class="contact-map__frame">
              <iframe
                src="${this.mapEmbedUrl}"
                loading="lazy"
                allowfullscreen
                referrerpolicy="no-referrer-when-downgrade"
                title="Bản đồ vị trí cửa hàng ${escapeHtml(info.name)}">
              </iframe>
            </div>
            <a href="${this.mapLink}" target="_blank" rel="noopener"
               class="btn btn--primary btn--block contact-map__btn">
              🧭 Chỉ đường đến cửa hàng (mở Google Maps)
            </a>
          </div>
        </div>
      </div>
    `;

    this._bindForm(container);
  }

  /** Form liên hệ: kiểm tra đơn giản + thông báo (demo, chưa có backend) */
  _bindForm(container) {
    const form = container.querySelector('#contact-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('#ct-name').value.trim();
      const phone = form.querySelector('#ct-phone').value.trim();
      const message = form.querySelector('#ct-message').value.trim();

      if (!name || !phone || !message) {
        Toast.show('Vui lòng điền đầy đủ họ tên, SĐT và nội dung', 'error');
        return;
      }

      // Demo: chưa có server nhận tin nhắn -> chỉ hiển thị xác nhận
      form.reset();
      Toast.show(`Cảm ơn ${name}! Tin nhắn đã được ghi nhận.`, 'success');
    });
  }
}
