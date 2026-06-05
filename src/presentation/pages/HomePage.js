/**
 * ============================================================
 * PRESENTATION LAYER - Page: HomePage (Trang chủ)
 * Banner lớn + Sản phẩm nổi bật + Danh mục dòng loa + Khuyến mãi.
 * ============================================================
 */
/* global ProductCard, escapeHtml */

class HomePage {
  /**
   * @param {Object} deps
   * @param {import('../../business/services/ProductService.js').ProductService} deps.productService
   */
  constructor({ productService }) {
    this.productService = productService;
  }

  /**
   * Render trang chủ vào container.
   * @param {HTMLElement} container
   */
  async render(container) {
    // ---- 1. Khung trang + Skeleton trong lúc chờ dữ liệu ----
    container.innerHTML = `
      <!-- Hero Banner -->
      <section class="hero">
        <div class="hero__inner container">
          <div class="hero__content slide-in">
            <span class="hero__tag">Loa xách tay karaoke Alokio chính hãng</span>
            <h1>Âm thanh đỉnh cao<br>cho mọi cuộc vui</h1>
            <p>Loa xách tay karaoke công suất tới 900W, tặng kèm combo
            2 micro không dây. Giao hàng miễn phí toàn quốc, bảo hành 12 tháng.</p>
            <div class="hero__cta">
              <a href="#/products" class="btn btn--accent btn--lg">Mua ngay</a>
              <a href="#/products" class="btn btn--outline btn--lg">Xem tất cả sản phẩm</a>
            </div>
          </div>
          <div class="hero__visual fade-in">
            <img src="src/assets/img/picture.jpg"
                 alt="Loa karaoke Alokio chính hãng" class="hero__image">
          </div>
        </div>
      </section>

      <!-- Sản phẩm nổi bật -->
      <section class="section container">
        <div class="section__head">
          <h2 class="section__title">Sản phẩm nổi bật</h2>
          <a href="#/products" class="section__link">Xem tất cả →</a>
        </div>
        <div class="product-grid" id="home-featured">
          ${ProductCard.skeleton(4)}
        </div>
      </section>

      <!-- Khuyến mãi -->
      <section class="section section--promo">
        <div class="container">
          <div class="section__head">
            <h2 class="section__title">🔥 Đang khuyến mãi</h2>
            <a href="#/products" class="section__link">Xem tất cả →</a>
          </div>
          <div class="product-grid" id="home-promo">
            ${ProductCard.skeleton(4)}
          </div>
        </div>
      </section>

      <!-- Video khách hàng trải nghiệm -->
      <section class="section container">
        <div class="section__head">
          <h2 class="section__title">Khách hàng hát thử tại cửa hàng</h2>
        </div>
        <div class="video-grid" id="home-videos"></div>
      </section>
    `;

    // Video khách hát (dữ liệu từ Business Layer)
    const videoEl = container.querySelector('#home-videos');
    if (videoEl) {
      videoEl.innerHTML = this.productService
        .getCustomerVideos()
        .map(
          (video) => `
          <figure class="video-card fade-in">
            <video src="${video.src}" controls preload="metadata" playsinline></video>
            <figcaption>${escapeHtml(video.title)}</figcaption>
          </figure>`
        )
        .join('');
    }

    // ---- 2. Lấy dữ liệu từ Business Layer rồi render thật ----
    const [featured, discounted] = await Promise.all([
      this.productService.getFeaturedProducts(),
      this.productService.getDiscountedProducts(),
    ]);

    // Sản phẩm nổi bật
    const featuredEl = container.querySelector('#home-featured');
    if (featuredEl) {
      featuredEl.innerHTML = featured.map((p) => ProductCard.html(p)).join('');
    }

    // Khuyến mãi: lấy 4 sản phẩm giảm sâu nhất
    const promoEl = container.querySelector('#home-promo');
    if (promoEl) {
      const topDeals = [...discounted]
        .sort((a, b) => b.discountPercent - a.discountPercent)
        .slice(0, 4);
      promoEl.innerHTML = topDeals.map((p) => ProductCard.html(p)).join('');
    }
  }
}
