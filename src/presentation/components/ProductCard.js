/**
 * ============================================================
 * PRESENTATION LAYER - Component: ProductCard
 * Card sản phẩm dùng chung cho Trang chủ & Danh sách sản phẩm.
 * Chỉ tạo chuỗi HTML - sự kiện "thêm giỏ hàng" được bắt
 * toàn cục bằng event delegation trong app.js (data-add-to-cart).
 * ============================================================
 */
/* global formatPrice, escapeHtml, renderStars, imgTag */

class ProductCard {
  /**
   * @param {import('../../data/models/Product.js').Product} product
   * @returns {string} HTML của card
   */
  static html(product) {
    const discountBadge = product.hasDiscount
      ? `<span class="product-card__badge">-${product.discountPercent}%</span>`
      : '';

    const oldPrice = product.hasDiscount
      ? `<span class="product-card__old-price">${formatPrice(product.oldPrice)}</span>`
      : '';

    const stockState = product.inStock
      ? `<button class="btn btn--primary product-card__add" data-add-to-cart="${product.id}">
           Thêm vào giỏ
         </button>`
      : `<button class="btn btn--disabled" disabled>Hết hàng</button>`;

    return `
      <article class="product-card fade-in">
        <a href="#/product/${product.id}" class="product-card__image-wrap">
          ${discountBadge}
          ${imgTag(product.image, product.name, 'product-card__image')}
        </a>
        <div class="product-card__body">
          <span class="product-card__brand">${escapeHtml(product.brand)}</span>
          <h3 class="product-card__name">
            <a href="#/product/${product.id}">${escapeHtml(product.name)}</a>
          </h3>
          <div class="product-card__rating">${renderStars(product.rating)}</div>
          <div class="product-card__prices">
            <span class="product-card__price">${formatPrice(product.price)}</span>
            ${oldPrice}
          </div>
          ${stockState}
        </div>
      </article>
    `;
  }

  /**
   * Skeleton placeholder hiển thị khi đang tải dữ liệu.
   * @param {number} count - Số skeleton card
   * @returns {string} HTML
   */
  static skeleton(count = 4) {
    const one = `
      <div class="product-card skeleton-card">
        <div class="skeleton skeleton--image"></div>
        <div class="product-card__body">
          <div class="skeleton skeleton--text skeleton--w40"></div>
          <div class="skeleton skeleton--text skeleton--w90"></div>
          <div class="skeleton skeleton--text skeleton--w60"></div>
          <div class="skeleton skeleton--button"></div>
        </div>
      </div>
    `;
    return one.repeat(count);
  }
}
