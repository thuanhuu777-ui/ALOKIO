/**
 * ============================================================
 * PRESENTATION LAYER - Component: CartSidebar
 * Giỏ hàng trượt từ bên phải với animation mượt.
 * Tự re-render khi CartService thay đổi (Observer pattern).
 * ============================================================
 */
/* global formatPrice, escapeHtml, imgTag, Toast */

class CartSidebar {
  /**
   * @param {import('../../business/services/CartService.js').CartService} cartService
   */
  constructor(cartService) {
    this.cartService = cartService;
    this._build();

    // Giỏ thay đổi -> vẽ lại danh sách
    this.cartService.subscribe(() => this._renderItems());
  }

  /** Tạo khung sidebar + overlay (1 lần duy nhất) */
  _build() {
    // Lớp phủ mờ phía sau
    this.overlay = document.createElement('div');
    this.overlay.className = 'cart-overlay';
    this.overlay.addEventListener('click', () => this.close());

    // Sidebar
    this.el = document.createElement('aside');
    this.el.className = 'cart-sidebar';
    this.el.innerHTML = `
      <div class="cart-sidebar__header">
        <h3>Giỏ hàng của bạn</h3>
        <button class="cart-sidebar__close" aria-label="Đóng giỏ hàng">✕</button>
      </div>
      <div class="cart-sidebar__items" id="cart-items"></div>
      <div class="cart-sidebar__footer">
        <div class="cart-sidebar__total">
          <span>Tổng tiền:</span>
          <strong id="cart-total">0đ</strong>
        </div>
        <a href="#/checkout" class="btn btn--accent btn--block" id="checkout-btn">
          Tiến hành thanh toán
        </a>
      </div>
    `;

    document.body.appendChild(this.overlay);
    document.body.appendChild(this.el);

    this.el
      .querySelector('.cart-sidebar__close')
      .addEventListener('click', () => this.close());

    // Bấm "Thanh toán" thì đóng sidebar (nếu giỏ trống thì chặn lại)
    this.el.querySelector('#checkout-btn').addEventListener('click', (e) => {
      if (this.cartService.isEmpty) {
        e.preventDefault();
        Toast.show('Giỏ hàng đang trống', 'info');
        return;
      }
      this.close();
    });

    // Event delegation cho nút tăng / giảm / xóa từng dòng
    this.el.querySelector('#cart-items').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;

      const productId = Number(btn.dataset.id);
      const item = this.cartService.items.find((i) => i.product.id === productId);
      if (!item) return;

      switch (btn.dataset.action) {
        case 'increase': {
          const result = this.cartService.updateQuantity(productId, item.quantity + 1);
          if (!result.success) Toast.show(result.message, 'error');
          break;
        }
        case 'decrease':
          this.cartService.updateQuantity(productId, item.quantity - 1);
          break;
        case 'remove':
          this.cartService.remove(productId);
          Toast.show('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
          break;
      }
    });

    this._renderItems();
  }

  /** Vẽ danh sách sản phẩm trong giỏ + tổng tiền */
  _renderItems() {
    const wrap = this.el.querySelector('#cart-items');
    const totalEl = this.el.querySelector('#cart-total');

    if (this.cartService.isEmpty) {
      wrap.innerHTML = `
        <div class="cart-sidebar__empty">
          <p>🛒</p>
          <p>Giỏ hàng đang trống</p>
          <a href="#/products" class="btn btn--secondary" id="cart-empty-shop">Mua sắm ngay</a>
        </div>
      `;
      wrap.querySelector('#cart-empty-shop')
          .addEventListener('click', () => this.close());
    } else {
      wrap.innerHTML = this.cartService.items
        .map(
          (item) => `
        <div class="cart-item">
          ${imgTag(item.product.image, item.product.name, 'cart-item__image')}
          <div class="cart-item__info">
            <a href="#/product/${item.product.id}" class="cart-item__name">
              ${escapeHtml(item.product.name)}
            </a>
            <div class="cart-item__price">${formatPrice(item.product.price)}</div>
            <div class="cart-item__controls">
              <button data-action="decrease" data-id="${item.product.id}" aria-label="Giảm">−</button>
              <span>${item.quantity}</span>
              <button data-action="increase" data-id="${item.product.id}" aria-label="Tăng">+</button>
              <button class="cart-item__remove" data-action="remove"
                      data-id="${item.product.id}" aria-label="Xóa">Xóa</button>
            </div>
          </div>
          <div class="cart-item__total">${formatPrice(item.total)}</div>
        </div>
      `
        )
        .join('');
    }

    totalEl.textContent = formatPrice(this.cartService.total);
  }

  /** Mở sidebar (trượt vào từ bên phải) */
  open() {
    this.el.classList.add('open');
    this.overlay.classList.add('show');
    document.body.style.overflow = 'hidden'; // Khóa scroll nền
  }

  /** Đóng sidebar */
  close() {
    this.el.classList.remove('open');
    this.overlay.classList.remove('show');
    document.body.style.overflow = '';
  }
}
