/**
 * ============================================================
 * PRESENTATION LAYER - Component: Header
 * Logo + Menu + Thanh tìm kiếm + Dark mode + Icon giỏ hàng.
 * Responsive: menu thu gọn thành hamburger trên mobile.
 * ============================================================
 */
class Header {
  /**
   * @param {Object} deps
   * @param {import('../../business/services/CartService.js').CartService} deps.cartService
   * @param {Function} deps.onCartOpen - Callback mở Cart Sidebar
   * @param {Object} deps.storeInfo - Thông tin cửa hàng (logo, tên...)
   */
  constructor({ cartService, onCartOpen, storeInfo }) {
    this.cartService = cartService;
    this.onCartOpen = onCartOpen;
    this.storeInfo = storeInfo;
    this.el = document.getElementById('header');

    // Badge giỏ hàng tự cập nhật khi giỏ thay đổi (Observer)
    this.cartService.subscribe(() => this._updateBadge());
  }

  /** Render toàn bộ header */
  render() {
    this.el.innerHTML = `
      <div class="header__inner container">
        <button class="header__hamburger" id="hamburger-btn" aria-label="Mở menu">
          <span></span><span></span><span></span>
        </button>

        <a href="#/" class="header__logo">
          <img src="${this.storeInfo.logo}" alt="Logo ${this.storeInfo.name}"
               class="header__logo-img" id="logo-img">
          ${this.storeInfo.name}
        </a>

        <nav class="header__nav" id="nav-menu">
          <a href="#/" data-nav="home">Trang chủ</a>
          <a href="#/products" data-nav="products">Sản phẩm</a>
          <a href="#/articles" data-nav="articles">Tin tức</a>
          <a href="#/contact" data-nav="contact">Liên hệ</a>
        </nav>

        <form class="header__search" id="search-form" role="search">
          <input type="search" id="search-input"
                 placeholder="Tìm loa theo tên, dòng sản phẩm..."
                 aria-label="Tìm kiếm sản phẩm">
          <button type="submit" aria-label="Tìm kiếm">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
            </svg>
          </button>
        </form>

        <div class="header__actions">
          <button class="header__icon-btn header__cart-btn" id="cart-btn" aria-label="Giỏ hàng">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/>
              <path d="M2 3h3l2.6 12.4a1 1 0 0 0 1 .6h9.7a1 1 0 0 0 1-.7L22 7H6"/>
            </svg>
            <span class="header__cart-badge" id="cart-badge">0</span>
          </button>
        </div>
      </div>
    `;

    this._bindEvents();
    this._updateBadge();
  }

  /** Gắn sự kiện cho header */
  _bindEvents() {
    // Logo lỗi (mất mạng) -> ẩn ảnh, vẫn còn chữ tên cửa hàng
    const logoImg = this.el.querySelector('#logo-img');
    logoImg.dataset.fallbackApplied = '1'; // Không dùng placeholder chung
    logoImg.addEventListener('error', () => {
      logoImg.style.display = 'none';
    });

    // Tìm kiếm -> chuyển sang trang sản phẩm kèm từ khóa
    const form = this.el.querySelector('#search-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const keyword = this.el.querySelector('#search-input').value.trim();
      location.hash = keyword
        ? `#/products?q=${encodeURIComponent(keyword)}`
        : '#/products';
      this._closeMobileMenu();
    });

    // Mở giỏ hàng
    this.el.querySelector('#cart-btn').addEventListener('click', this.onCartOpen);

    // Hamburger menu (mobile)
    const hamburger = this.el.querySelector('#hamburger-btn');
    const nav = this.el.querySelector('#nav-menu');
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    // Bấm link nào trong menu thì đóng menu mobile
    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') this._closeMobileMenu();
    });

  }

  /** Đóng menu mobile */
  _closeMobileMenu() {
    this.el.querySelector('#nav-menu').classList.remove('open');
    this.el.querySelector('#hamburger-btn').classList.remove('active');
  }

  /** Cập nhật số lượng trên icon giỏ hàng */
  _updateBadge() {
    const badge = this.el.querySelector('#cart-badge');
    if (badge) {
      badge.textContent = this.cartService.count;
      badge.classList.toggle('hidden', this.cartService.count === 0);
    }
  }

  /** Đánh dấu link menu đang active theo trang hiện tại */
  setActive(path) {
    this.el.querySelectorAll('[data-nav]').forEach((a) => {
      const key = a.dataset.nav;
      const isActive =
        (key === 'home' && path === '/') ||
        (key === 'products' && path.startsWith('/product')) ||
        (key === 'articles' && path.startsWith('/article')) ||
        (key === 'contact' && path === '/contact');
      a.classList.toggle('active', isActive);
    });
  }
}
