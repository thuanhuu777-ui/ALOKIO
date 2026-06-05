/**
 * ============================================================
 * PRESENTATION LAYER - Component: ChatBubbles
 * 4 bóng chat nổi ở góc dưới bên phải màn hình:
 * Zalo - Facebook - TikTok - Shopee.
 * Bấm vào sẽ mở trang tương ứng ở tab mới.
 * Link được cấu hình trong STORE_INFO.socials (storeInfo.js).
 * ============================================================
 */
class ChatBubbles {
  /**
   * @param {Object} deps
   * @param {Object} deps.socials - { zalo, facebook, tiktok, shopee }
   */
  constructor({ socials }) {
    this.socials = socials;
  }

  /** Tạo cụm bóng chat và gắn vào cuối <body> (gọi 1 lần khi app chạy) */
  render() {
    const wrap = document.createElement('div');
    wrap.className = 'chat-bubbles';
    wrap.setAttribute('aria-label', 'Liên hệ qua mạng xã hội');

    wrap.innerHTML = `
      <!-- Zalo -->
      <a href="${this.socials.zalo}" target="_blank" rel="noopener"
         class="chat-bubble chat-bubble--zalo" title="Chat Zalo: 0382.181.317">
        <span class="chat-bubble__text">Zalo</span>
      </a>

      <!-- Facebook -->
      <a href="${this.socials.facebook}" target="_blank" rel="noopener"
         class="chat-bubble chat-bubble--facebook" title="Facebook Alokio">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
          <path d="M13.4 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.6-1.5h1.4V4.4c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7v2.5H8.2v3h2.5V21h2.7z"/>
        </svg>
      </a>

      <!-- TikTok -->
      <a href="${this.socials.tiktok}" target="_blank" rel="noopener"
         class="chat-bubble chat-bubble--tiktok" title="TikTok Loa kéo Alokio">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M16.6 3c.4 2 1.7 3.3 3.9 3.5v2.8c-1.4 0-2.7-.4-3.9-1.2v5.9c0 3.6-2.4 5.9-5.6 5.9-3 0-5.3-2.2-5.3-5.2 0-3 2.5-5.2 5.6-5V13c-.3-.1-.6-.1-.9-.1-1.4 0-2.5 1-2.5 2.4 0 1.5 1.1 2.5 2.5 2.5 1.6 0 2.7-1.1 2.7-3V3h3.5z"/>
        </svg>
      </a>

      <!-- Shopee -->
      <a href="${this.socials.shopee}" target="_blank" rel="noopener"
         class="chat-bubble chat-bubble--shopee" title="Gian hàng Shopee">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none"
             stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
             stroke-linejoin="round">
          <path d="M5 8h14l-1 12.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20.5L5 8z"/>
          <path d="M8.5 8a3.5 3.5 0 0 1 7 0"/>
          <path d="M14 12c-.4-.7-1.2-1-2-1-1.1 0-2 .6-2 1.5s.9 1.3 2 1.5c1.1.2 2 .6 2 1.5s-.9 1.5-2 1.5c-.8 0-1.6-.3-2-1"/>
        </svg>
      </a>
    `;

    document.body.appendChild(wrap);
  }
}
