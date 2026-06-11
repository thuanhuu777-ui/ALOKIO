/**
 * ============================================================
 * PRESENTATION LAYER - Component: Footer
 * Thông tin cửa hàng + Chính sách + Liên hệ.
 * ============================================================
 */
class Footer {
  /**
   * @param {Object} deps
   * @param {Object} deps.storeInfo - Thông tin cửa hàng (STORE_INFO)
   * @param {string} deps.mapLink - Link mở Google Map vị trí cửa hàng
   */
  constructor({ storeInfo, mapLink }) {
    this.storeInfo = storeInfo;
    this.mapLink = mapLink;
    this.el = document.getElementById('footer');
  }

  render() {
    const info = this.storeInfo;
    this.el.innerHTML = `
      <div class="footer__inner container">
        <div class="footer__col">
          <h4 class="footer__title">${info.name}</h4>
          <p>Chuyên Loa Xách Tay Karaoke ${info.name} Chính Hãng, tặng kèm
          micro không dây.<br>Âm thanh đỉnh cao - Giá tốt mỗi ngày.</p>
        </div>

        <div class="footer__col">
          <h4 class="footer__title">Chính sách</h4>
          <ul>
            <li><a href="#/">Bảo hành chính hãng 12 tháng</a></li>
            <li><a href="#/">Đổi trả trong 15 ngày</a></li>
            <li><a href="#/">Giao hàng miễn phí toàn quốc</a></li>
            <li><a href="#/">Trả góp 0%</a></li> 
          </ul>
        </div>

        <div class="footer__col">
          <h4 class="footer__title">Liên hệ</h4>
          <ul>
            <li>Hotline: ${info.phone}</li>
            <li>Email: ${info.email}</li>
            <li>
              <a href="${this.mapLink}" target="_blank" rel="noopener">
                📍 ${info.address}
              </a>
            </li>
            <li>${info.workingHours}</li>
            <li><a href="#/contact">→ Trang liên hệ &amp; bản đồ</a></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        © ${new Date().getFullYear()} ${info.name}. Design By Group 2 - ${info.name}.
      </div>
    `;
  }
}
