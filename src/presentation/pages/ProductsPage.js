/**
 * ============================================================
 * PRESENTATION LAYER - Page: ProductsPage (Danh sách sản phẩm)
 * Grid sản phẩm + Tìm kiếm + Lọc (dòng loa, giá) + Sắp xếp
 * + Phân trang. Mọi xử lý dữ liệu đều gọi xuống Business Layer.
 * ============================================================
 */
/* global ProductCard, PRICE_RANGES, SORT_OPTIONS, escapeHtml */

const PER_PAGE = 6; // Số sản phẩm mỗi trang

class ProductsPage {
  /**
   * @param {Object} deps - Các dependency từ Business Layer
   */
  constructor({ productService, searchUseCase, filterUseCase, sortUseCase }) {
    this.productService = productService;
    this.searchUseCase = searchUseCase;
    this.filterUseCase = filterUseCase;
    this.sortUseCase = sortUseCase;
  }

  /**
   * Render trang danh sách.
   * @param {HTMLElement} container
   * @param {URLSearchParams} query - Tham số từ URL (?q=...&cat=...)
   */
  async render(container, query) {
    // ---- State của trang (đọc từ URL nếu có) ----
    this.state = {
      keyword: query.get('q') || '',
      categories: query.getAll('cat'), // Hỗ trợ nhiều ?cat= trên URL
      priceRangeId: 'all',
      sortType: 'default',
      page: 1,
    };

    // ---- Khung trang ----
    container.innerHTML = `
      <div class="container section">
        <h1 class="page-title">Tất cả sản phẩm</h1>

        <div class="products-layout">
          <!-- Bộ lọc -->
          <aside class="filters" id="filters">
            <div class="filters__group">
              <h4>Mức giá</h4>
              <div id="filter-prices"></div>
            </div>
            <button class="btn btn--outline btn--block" id="filter-reset">
              Xóa bộ lọc
            </button>
          </aside>

          <!-- Danh sách -->
          <div class="products-main">
            <div class="products-toolbar">
              <span id="products-count" class="products-count"></span>
              <label class="sort-box">
                Sắp xếp:
                <select id="sort-select">
                  ${SORT_OPTIONS.map(
                    (o) => `<option value="${o.id}">${o.label}</option>`
                  ).join('')}
                </select>
              </label>
            </div>
            <div class="product-grid product-grid--page" id="products-grid">
              ${ProductCard.skeleton(PER_PAGE)}
            </div>
            <nav class="pagination" id="pagination" aria-label="Phân trang"></nav>
          </div>
        </div>
      </div>
    `;

    this.container = container;

    // ---- Tải dữ liệu (Skeleton hiển thị trong lúc chờ) ----
    this.allProducts = await this.productService.getProducts();

    this._renderFilters();
    this._bindEvents();
    this._renderProducts();
  }

  /** Render radio chọn mức giá */
  _renderFilters() {
    this.container.querySelector('#filter-prices').innerHTML = PRICE_RANGES.map(
      (range) => `
        <label class="filters__option">
          <input type="radio" name="price" value="${range.id}"
                 ${range.id === this.state.priceRangeId ? 'checked' : ''}>
          ${range.label}
        </label>`
    ).join('');
  }

  /** Gắn sự kiện lọc / sắp xếp / phân trang */
  _bindEvents() {
    const filters = this.container.querySelector('#filters');

    // Thay đổi bất kỳ bộ lọc nào -> reset về trang 1 và render lại
    filters.addEventListener('change', () => {
      this.state.priceRangeId =
        filters.querySelector('input[name="price"]:checked')?.value || 'all';
      this.state.page = 1;
      this._renderProducts();
    });

    // Nút xóa bộ lọc
    this.container.querySelector('#filter-reset').addEventListener('click', () => {
      this.state.categories = [];
      this.state.priceRangeId = 'all';
      this.state.keyword = '';
      this.state.page = 1;
      this._renderFilters();
      this._renderProducts();
    });

    // Sắp xếp
    this.container.querySelector('#sort-select').addEventListener('change', (e) => {
      this.state.sortType = e.target.value;
      this.state.page = 1;
      this._renderProducts();
    });

    // Phân trang (event delegation)
    this.container.querySelector('#pagination').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-page]');
      if (!btn) return;
      this.state.page = Number(btn.dataset.page);
      this._renderProducts();
      // Cuộn lên đầu danh sách cho dễ xem
      this.container.querySelector('.products-toolbar')
        .scrollIntoView({ behavior: 'smooth' });
    });
  }

  /**
   * Pipeline xử lý dữ liệu (toàn bộ nằm ở Business Layer):
   * Search -> Filter -> Sort -> Paginate -> Render
   */
  _renderProducts() {
    const { keyword, categories, priceRangeId, sortType, page } = this.state;

    let result = this.searchUseCase.execute(this.allProducts, keyword);
    result = this.filterUseCase.execute(result, { categories, priceRangeId });
    result = this.sortUseCase.execute(result, sortType);

    const paged = this.productService.paginate(result, page, PER_PAGE);

    // Số kết quả + từ khóa đang tìm
    const countEl = this.container.querySelector('#products-count');
    countEl.innerHTML = keyword
      ? `Tìm thấy <strong>${paged.totalItems}</strong> kết quả cho
         "<strong>${escapeHtml(keyword)}</strong>"`
      : `<strong>${paged.totalItems}</strong> sản phẩm`;

    // Grid sản phẩm
    const grid = this.container.querySelector('#products-grid');
    grid.innerHTML = paged.items.length
      ? paged.items.map((p) => ProductCard.html(p)).join('')
      : `<div class="empty-state">
           <p>😔 Không tìm thấy sản phẩm phù hợp.</p>
           <p>Hãy thử từ khóa khác hoặc xóa bộ lọc.</p>
         </div>`;

    this._renderPagination(paged);
  }

  /** Render các nút phân trang */
  _renderPagination({ page, totalPages }) {
    const nav = this.container.querySelector('#pagination');
    if (totalPages <= 1) {
      nav.innerHTML = '';
      return;
    }

    const btn = (p, label, opts = {}) => `
      <button data-page="${p}"
              class="pagination__btn ${opts.active ? 'active' : ''}"
              ${opts.disabled ? 'disabled' : ''}>${label}</button>`;

    let html = btn(page - 1, '‹', { disabled: page === 1 });
    for (let p = 1; p <= totalPages; p++) {
      html += btn(p, p, { active: p === page });
    }
    html += btn(page + 1, '›', { disabled: page === totalPages });

    nav.innerHTML = html;
  }
}
