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

      <!-- Video khách hàng trải nghiệm (carousel: 3 video / lần) -->
      <section class="section container">
        <div class="section__head">
          <h2 class="section__title">Khách hàng hát thử tại cửa hàng</h2>
        </div>
        <div class="video-carousel" id="video-carousel">
          <button class="video-carousel__btn" id="video-prev"
                  aria-label="Video trước">‹</button>
          <div class="video-carousel__viewport">
            <div class="video-carousel__track" id="video-track"></div>
          </div>
          <button class="video-carousel__btn" id="video-next"
                  aria-label="Video sau">›</button>
        </div>
        <div class="video-carousel__dots" id="video-dots"></div>
      </section>
    `;

    // Carousel video khách hát (dữ liệu từ Business Layer)
    this._initVideoCarousel(container, this.productService.getCustomerVideos());

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

  /**
   * Carousel video: hiển thị 3 video / lần (tablet 2, mobile 1),
   * tự động trượt sang phải theo vòng lặp vô tận; tạm dừng khi
   * người dùng rê chuột hoặc đang phát video.
   * @param {HTMLElement} container
   * @param {{id:number, title:string, src:string}[]} videos
   */
  _initVideoCarousel(container, videos) {
    const carousel = container.querySelector('#video-carousel');
    const track = container.querySelector('#video-track');
    const dotsWrap = container.querySelector('#video-dots');
    const prevBtn = container.querySelector('#video-prev');
    const nextBtn = container.querySelector('#video-next');
    if (!carousel || videos.length === 0) return;

    // Dừng timer cũ nếu trang chủ được render lại
    clearInterval(this._videoTimer);

    const cardHtml = (video) => `
      <div class="video-slide">
        <figure class="video-card">
          <video src="${video.src}" controls preload="metadata" playsinline></video>
          <figcaption>${escapeHtml(video.title)}</figcaption>
        </figure>
      </div>`;

    /** Số video hiển thị cùng lúc theo độ rộng màn hình */
    const perView = () =>
      window.innerWidth <= 640 ? 1 : window.innerWidth <= 1024 ? 2 : 3;

    /** Có đủ video để trượt không */
    const canSlide = () => videos.length > perView();

    let index = 0;
    let videoPlaying = false;

    // Nhân bản vài video đầu nối vào cuối -> trượt tới cuối là
    // nối liền về đầu (vòng lặp vô tận, không bị giật)
    const renderTrack = () => {
      const clones = canSlide() ? videos.slice(0, perView()) : [];
      track.innerHTML = [...videos, ...clones].map(cardHtml).join('');
      prevBtn.style.display = canSlide() ? '' : 'none';
      nextBtn.style.display = canSlide() ? '' : 'none';
      dotsWrap.innerHTML = canSlide()
        ? videos
            .map(
              (_, i) =>
                `<button data-dot="${i}" aria-label="Xem video ${i + 1}"></button>`
            )
            .join('')
        : '';
    };

    /** Trượt tới vị trí i (animate = false: nhảy ngay, không hiệu ứng) */
    const goTo = (i, animate = true) => {
      index = i;
      track.style.transition = animate ? 'transform .55s ease' : 'none';
      track.style.transform = `translateX(-${(100 / perView()) * i}%)`;
      const active = index % videos.length;
      dotsWrap
        .querySelectorAll('[data-dot]')
        .forEach((dot, di) => dot.classList.toggle('active', di === active));
    };

    /** Dừng mọi video đang phát trước khi trượt */
    const pauseVideos = () =>
      track.querySelectorAll('video').forEach((v) => v.pause());

    const next = () => {
      if (!canSlide()) return;
      pauseVideos();
      goTo(index + 1);
    };

    const prev = () => {
      if (!canSlide()) return;
      pauseVideos();
      if (index === 0) {
        goTo(videos.length, false); // Nhảy tới dải clone cuối
        void track.offsetWidth;     // Ép trình duyệt áp dụng ngay
        goTo(videos.length - 1);    // Rồi trượt lùi mượt mà
      } else {
        goTo(index - 1);
      }
    };

    // Trượt hết dải clone -> nhảy ngầm về đầu (người xem không nhận ra)
    track.addEventListener('transitionend', () => {
      if (index >= videos.length) goTo(index - videos.length, false);
    });

    // ---- Tự động trượt 4 giây / lần ----
    const stop = () => {
      clearInterval(this._videoTimer);
      this._videoTimer = null;
    };
    const start = () => {
      if (!this._videoTimer && canSlide() && !videoPlaying) {
        this._videoTimer = setInterval(next, 4000);
      }
    };

    // Đang xem video -> dừng tự trượt; xem xong -> chạy tiếp
    track.addEventListener('play', () => { videoPlaying = true; stop(); }, true);
    track.addEventListener('pause', () => { videoPlaying = false; start(); }, true);
    track.addEventListener('ended', () => { videoPlaying = false; start(); }, true);

    // Rê chuột vào carousel -> tạm dừng
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);

    // Nút điều hướng + chấm tròn
    prevBtn.addEventListener('click', () => { stop(); prev(); start(); });
    nextBtn.addEventListener('click', () => { stop(); next(); start(); });
    dotsWrap.addEventListener('click', (e) => {
      const dot = e.target.closest('[data-dot]');
      if (!dot) return;
      stop();
      pauseVideos();
      goTo(Number(dot.dataset.dot));
      start();
    });

    // Đổi kích thước màn hình -> tính lại số video / khung nhìn
    if (this._videoResizeHandler) {
      window.removeEventListener('resize', this._videoResizeHandler);
    }
    this._videoResizeHandler = () => {
      renderTrack();
      goTo(0, false);
    };
    window.addEventListener('resize', this._videoResizeHandler);

    // Khởi động
    renderTrack();
    goTo(0, false);
    start();
  }
}
