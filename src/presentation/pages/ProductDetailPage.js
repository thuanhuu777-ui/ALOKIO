/**
 * ============================================================
 * PRESENTATION LAYER - Page: ProductDetailPage (Chi tiết sản phẩm)
 * Gallery ảnh lớn + thumbnail, thông số kỹ thuật, mô tả,
 * chọn số lượng và thêm vào giỏ hàng. Kèm sản phẩm liên quan.
 * ============================================================
 */
/* global ProductCard, Toast, formatPrice, escapeHtml, renderStars, imgTag */

class ProductDetailPage {
  /**
   * @param {Object} deps
   * @param {import('../../business/services/ProductService.js').ProductService} deps.productService
   * @param {import('../../business/services/CartService.js').CartService} deps.cartService
   */
  constructor({ productService, cartService }) {
    this.productService = productService;
    this.cartService = cartService;
  }

  /**
   * @param {HTMLElement} container
   * @param {URLSearchParams} query
   * @param {string} id - id sản phẩm lấy từ URL #/product/:id
   */
  async render(container, query, id) {
    // Skeleton trong lúc tải
    container.innerHTML = `
      <div class="container section">
        <div class="detail-skeleton">
          <div class="skeleton skeleton--image-lg"></div>
          <div>
            <div class="skeleton skeleton--text skeleton--w60"></div>
            <div class="skeleton skeleton--text skeleton--w90"></div>
            <div class="skeleton skeleton--text skeleton--w40"></div>
            <div class="skeleton skeleton--button"></div>
          </div>
        </div>
      </div>
    `;

    const product = await this.productService.getProductById(id);

    // Không tìm thấy sản phẩm
    if (!product) {
      container.innerHTML = `
        <div class="container section empty-state">
          <p>😔 Không tìm thấy sản phẩm.</p>
          <a href="#/products" class="btn btn--primary">Quay lại danh sách</a>
        </div>
      `;
      return;
    }

    const specsRows = Object.entries(product.specs)
      .map(
        ([label, value]) => `
        <tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`
      )
      .join('');

    const thumbs = product.images
      .map(
        (src, i) => `
        <button class="detail__thumb ${i === 0 ? 'active' : ''}" data-index="${i}">
          ${imgTag(src, `${product.name} - ảnh ${i + 1}`)}
        </button>`
      )
      .join('');

    container.innerHTML = `
      <div class="container section fade-in">
        <nav class="breadcrumb">
          <a href="#/">Trang chủ</a> ›
          <a href="#/products">Sản phẩm</a> ›
          <span>${escapeHtml(product.name)}</span>
        </nav>

        <div class="detail">
          <!-- Gallery ảnh -->
          <div class="detail__gallery">
            <div class="detail__image-wrap">
              ${
                product.hasDiscount
                  ? `<span class="product-card__badge">-${product.discountPercent}%</span>`
                  : ''
              }
              ${imgTag(product.images[0], product.name, 'detail__image')}
            </div>
            <div class="detail__thumbs">${thumbs}</div>
          </div>

          <!-- Thông tin -->
          <div class="detail__info">
            <span class="product-card__brand">${escapeHtml(product.category)}</span>
            <h1 class="detail__name">${escapeHtml(product.name)}</h1>
            <div class="detail__rating">
              ${renderStars(product.rating)}
              <span class="detail__stock ${product.inStock ? 'in' : 'out'}">
                ${product.inStock ? `Còn hàng (${product.stock})` : 'Hết hàng'}
              </span>
            </div>

            <div class="detail__prices">
              <span class="detail__price">${formatPrice(product.price)}</span>
              ${
                product.hasDiscount
                  ? `<span class="product-card__old-price">${formatPrice(product.oldPrice)}</span>`
                  : ''
              }
            </div>

            <p class="detail__description">${escapeHtml(product.description)}</p>

            <!-- Số lượng + Thêm giỏ -->
            <div class="detail__actions">
              <div class="qty-box" id="qty-box">
                <button id="qty-decrease" aria-label="Giảm">−</button>
                <input type="number" id="qty-input" value="1" min="1"
                       max="${product.stock}" aria-label="Số lượng">
                <button id="qty-increase" aria-label="Tăng">+</button>
              </div>
              <button class="btn btn--accent btn--lg" id="add-to-cart-btn"
                      ${product.inStock ? '' : 'disabled'}>
                ${product.inStock ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
              </button>
            </div>

            <!-- Thông số kỹ thuật -->
            <h3 class="detail__subtitle">Thông số kỹ thuật</h3>
            <table class="specs-table">${specsRows}</table>
          </div>
        </div>

        <!-- Sản phẩm liên quan -->
        <section class="section">
          <h2 class="section__title">Sản phẩm liên quan</h2>
          <div class="product-grid" id="related-products"></div>
        </section>
      </div>
    `;

    this._bindEvents(container, product);
    this._renderRelated(container, product);
  }

  /** Sự kiện: đổi ảnh gallery, tăng giảm số lượng, thêm giỏ */
  _bindEvents(container, product) {
    // --- Gallery: bấm thumbnail đổi ảnh lớn ---
    const mainImage = container.querySelector('.detail__image');
    container.querySelector('.detail__thumbs').addEventListener('click', (e) => {
      const thumb = e.target.closest('[data-index]');
      if (!thumb) return;
      const index = Number(thumb.dataset.index);
      mainImage.src = product.images[index];
      container
        .querySelectorAll('.detail__thumb')
        .forEach((t) => t.classList.toggle('active', t === thumb));
    });

    // --- Số lượng ---
    const qtyInput = container.querySelector('#qty-input');
    const clampQty = (value) =>
      Math.min(Math.max(1, value || 1), product.stock);

    container.querySelector('#qty-decrease').addEventListener('click', () => {
      qtyInput.value = clampQty(Number(qtyInput.value) - 1);
    });
    container.querySelector('#qty-increase').addEventListener('click', () => {
      qtyInput.value = clampQty(Number(qtyInput.value) + 1);
    });
    qtyInput.addEventListener('change', () => {
      qtyInput.value = clampQty(Number(qtyInput.value));
    });

    // --- Thêm vào giỏ hàng (gọi Business Layer) ---
    container.querySelector('#add-to-cart-btn').addEventListener('click', () => {
      const quantity = clampQty(Number(qtyInput.value));
      const result = this.cartService.add(product, quantity);
      Toast.show(result.message, result.success ? 'success' : 'error');
    });
  }

  /** Sản phẩm liên quan = cùng dòng loa, khác id */
  async _renderRelated(container, product) {
    const all = await this.productService.getProducts();
    const related = all
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);

    const grid = container.querySelector('#related-products');
    if (grid) {
      grid.innerHTML = related.length
        ? related.map((p) => ProductCard.html(p)).join('')
        : '<p class="empty-state">Chưa có sản phẩm liên quan.</p>';
    }
  }
}
