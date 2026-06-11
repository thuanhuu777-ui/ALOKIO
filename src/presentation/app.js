/**
 * ============================================================
 * PRESENTATION LAYER - app.js (Composition Root + Router)
 *
 * Đây là điểm khởi động duy nhất của ứng dụng:
 * 1. Khởi tạo Data Layer (repositories)
 * 2. Tiêm (inject) vào Business Layer (services, usecases)
 * 3. Tiêm Business Layer vào Presentation Layer (pages, components)
 * 4. Router dạng hash (#/, #/products, #/product/:id, #/checkout)
 *
 * Luồng phụ thuộc 1 chiều: Presentation -> Business -> Data.
 *
 * Các file được nạp bằng <script> thường theo đúng thứ tự phụ thuộc
 * trong index.html (không dùng ES Module để có thể mở trực tiếp
 * index.html mà không cần web server).
 * ============================================================
 */

/* global ProductRepository, CartRepository, OrderRepository,
   ProductService, CartService, OrderService,
   SearchUseCase, FilterUseCase, SortUseCase, CheckoutValidator,
   Header, Footer, CartSidebar, ChatBubbles, Toast, FALLBACK_IMAGE,
   STORE_INFO, STORE_MAP_EMBED_URL, STORE_MAP_LINK,
   HomePage, ProductsPage, ProductDetailPage, CheckoutPage, ContactPage */

class App {
  constructor() {
    // ===== 1. Data Layer =====
    const productRepository = new ProductRepository();
    const cartRepository = new CartRepository();
    const orderRepository = new OrderRepository();
    const articleRepository = new ArticleRepository();

    // ===== 2. Business Layer =====
    this.productService = new ProductService(productRepository);
    this.cartService = new CartService(cartRepository, productRepository);
    this.orderService = new OrderService(orderRepository);
    this.articleService = new ArticleService(articleRepository);
    this.searchUseCase = new SearchUseCase();
    this.filterUseCase = new FilterUseCase();
    this.sortUseCase = new SortUseCase();
    this.checkoutValidator = new CheckoutValidator();

    // ===== 3. Presentation Layer =====
    this.cartSidebar = new CartSidebar(this.cartService);
    this.header = new Header({
      cartService: this.cartService,
      onCartOpen: () => this.cartSidebar.open(),
      storeInfo: STORE_INFO,
    });
    this.footer = new Footer({
      storeInfo: STORE_INFO,
      mapLink: STORE_MAP_LINK,
    });
    this.chatBubbles = new ChatBubbles({ socials: STORE_INFO.socials });

    // Bảng định tuyến: path -> page instance
    this.pages = {
      home: new HomePage({ 
        productService: this.productService,
        articleService: this.articleService 
      }),
      products: new ProductsPage({
        productService: this.productService,
        searchUseCase: this.searchUseCase,
        filterUseCase: this.filterUseCase,
        sortUseCase: this.sortUseCase,
      }),
      productDetail: new ProductDetailPage({
        productService: this.productService,
        cartService: this.cartService,
      }),
      articles: new ArticlesPage({
        articleService: this.articleService,
      }),
      articleDetail: new ArticleDetailPage({
        articleService: this.articleService,
      }),
      checkout: new CheckoutPage({
        cartService: this.cartService,
        validator: this.checkoutValidator,
        payment: STORE_INFO.payment,
        orderService: this.orderService,
      }),
      contact: new ContactPage({
        storeInfo: STORE_INFO,
        mapEmbedUrl: STORE_MAP_EMBED_URL,
        mapLink: STORE_MAP_LINK,
      }),
    };

    this.main = document.getElementById('app');
  }

  /** Khởi động ứng dụng */
  async start() {
    this._applySavedTheme();
    this._bindGlobalEvents();

    this.header.render();
    this.footer.render();
    this.chatBubbles.render();

    // Khôi phục giỏ hàng từ LocalStorage
    await this.cartService.init();

    // Render trang đầu tiên + lắng nghe đổi route
    window.addEventListener('hashchange', () => this._route());
    this._route();
  }

  /** Áp dụng Dark Mode đã lưu (mặc định theo hệ điều hành) */
  _applySavedTheme() {
    const saved = localStorage.getItem('soundhub_theme');
    if (saved) {
      document.documentElement.dataset.theme = saved;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.dataset.theme = 'dark';
    }
  }

  /** Các sự kiện toàn cục (event delegation) */
  _bindGlobalEvents() {
    // Nút "Thêm vào giỏ" trên mọi ProductCard, ở bất kỳ trang nào
    document.addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-add-to-cart]');
      if (!btn) return;
      e.preventDefault();

      const product = await this.productService.getProductById(
        btn.dataset.addToCart
      );
      if (!product) return;

      const result = this.cartService.add(product, 1);
      Toast.show(result.message, result.success ? 'success' : 'error');
    });

    // Ảnh lỗi / chưa tồn tại -> thay bằng ảnh placeholder
    // (dùng capture vì sự kiện 'error' của <img> không bubble)
    document.addEventListener(
      'error',
      (e) => {
        const img = e.target;
        if (img.tagName === 'IMG' && !img.dataset.fallbackApplied) {
          img.dataset.fallbackApplied = '1';
          img.src = FALLBACK_IMAGE;
        }
      },
      true
    );
  }

  /**
   * Router: phân tích hash hiện tại và render trang tương ứng.
   * Định dạng hỗ trợ:
   *   #/                  -> Trang chủ
   *   #/products?q=&cat=  -> Danh sách sản phẩm
   *   #/product/3         -> Chi tiết sản phẩm id=3
   *   #/checkout          -> Thanh toán
   *   #/contact           -> Liên hệ + bản đồ
   */
  async _route() {
    const hash = location.hash.slice(1) || '/'; // bỏ dấu '#'
    const [path, queryString] = hash.split('?');
    const query = new URLSearchParams(queryString || '');

    // Cuộn lên đầu trang mỗi khi đổi trang
    window.scrollTo({ top: 0 });
    this.header.setActive(path);

    // So khớp route
    const detailMatch = path.match(/^\/product\/(\d+)$/);
    const articleMatch = path.match(/^\/article\/(\d+)$/);

    if (path === '/' || path === '') {
      await this.pages.home.render(this.main);
    } else if (path === '/products') {
      await this.pages.products.render(this.main, query);
    } else if (detailMatch) {
      await this.pages.productDetail.render(this.main, query, detailMatch[1]);
    } else if (path === '/articles') {
      await this.pages.articles.render(this.main);
    } else if (articleMatch) {
      await this.pages.articleDetail.render(this.main, query, articleMatch[1]);
    } else if (path === '/checkout') {
      await this.pages.checkout.render(this.main);
    } else if (path === '/contact') {
      await this.pages.contact.render(this.main);
    } else {
      // 404
      this.main.innerHTML = `
        <div class="container section empty-state">
          <p style="font-size:3rem">404</p>
          <p>Trang bạn tìm không tồn tại.</p>
          <a href="#/" class="btn btn--primary">Về trang chủ</a>
        </div>
      `;
    }
  }
}

// ===== Khởi chạy =====
const app = new App();
app.start();
