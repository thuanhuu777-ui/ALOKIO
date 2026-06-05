/**
 * ============================================================
 * PRESENTATION LAYER - Page: CheckoutPage (Thanh toán)
 * Form thông tin khách hàng (họ tên, SĐT, địa chỉ, email)
 * + tóm tắt đơn hàng. Validate qua Business Layer
 * (CheckoutValidator), hiển thị lỗi ngay dưới từng ô nhập.
 * ============================================================
 */
/* global Toast, formatPrice, escapeHtml */

class CheckoutPage {
  /**
   * @param {Object} deps
   * @param {import('../../business/services/CartService.js').CartService} deps.cartService
   * @param {import('../../business/validators/CheckoutValidator.js').CheckoutValidator} deps.validator
   */
  constructor({ cartService, validator }) {
    this.cartService = cartService;
    this.validator = validator;
  }

  /**
   * @param {HTMLElement} container
   */
  async render(container) {
    // Giỏ trống -> mời quay lại mua sắm
    if (this.cartService.isEmpty) {
      container.innerHTML = `
        <div class="container section empty-state">
          <p>🛒 Giỏ hàng của bạn đang trống.</p>
          <a href="#/products" class="btn btn--primary">Tiếp tục mua sắm</a>
        </div>
      `;
      return;
    }

    const rows = this.cartService.items
      .map(
        (item) => `
        <div class="summary-row">
          <span>${escapeHtml(item.product.name)} × ${item.quantity}</span>
          <strong>${formatPrice(item.total)}</strong>
        </div>`
      )
      .join('');

    container.innerHTML = `
      <div class="container section fade-in">
        <h1 class="page-title">Thanh toán</h1>

        <div class="checkout-layout">
          <!-- Form thông tin khách hàng -->
          <form class="checkout-form" id="checkout-form" novalidate>
            <h3>Thông tin giao hàng</h3>

            <div class="form-group">
              <label for="fullName">Họ và tên *</label>
              <input type="text" id="fullName" name="fullName"
                     placeholder="Nguyễn Văn A" autocomplete="name">
              <span class="form-error" data-error="fullName"></span>
            </div>

            <div class="form-group">
              <label for="phone">Số điện thoại *</label>
              <input type="tel" id="phone" name="phone"
                     placeholder="0912345678" autocomplete="tel">
              <span class="form-error" data-error="phone"></span>
            </div>

            <div class="form-group">
              <label for="email">Email *</label>
              <input type="email" id="email" name="email"
                     placeholder="ten@gmail.com" autocomplete="email">
              <span class="form-error" data-error="email"></span>
            </div>

            <div class="form-group">
              <label for="address">Địa chỉ giao hàng *</label>
              <textarea id="address" name="address" rows="3"
                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                        autocomplete="street-address"></textarea>
              <span class="form-error" data-error="address"></span>
            </div>

            <button type="submit" class="btn btn--accent btn--lg btn--block">
              Đặt hàng
            </button>
          </form>

          <!-- Tóm tắt đơn hàng -->
          <aside class="checkout-summary">
            <h3>Đơn hàng của bạn</h3>
            ${rows}
            <div class="summary-row summary-row--total">
              <span>Tổng cộng</span>
              <strong>${formatPrice(this.cartService.total)}</strong>
            </div>
            <p class="summary-note">Miễn phí giao hàng toàn quốc 🚚</p>
          </aside>
        </div>
      </div>
    `;

    this._bindForm(container);
  }

  /** Validate khi submit, hiển thị lỗi từng field */
  _bindForm(container) {
    const form = container.querySelector('#checkout-form');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Thu thập dữ liệu form
      const data = {
        fullName: form.fullName.value,
        phone: form.phone.value,
        email: form.email.value,
        address: form.address.value,
      };

      // Gọi Business Layer kiểm tra
      const { valid, errors } = this.validator.validate(data);

      // Hiển thị / xóa lỗi dưới từng ô nhập
      container.querySelectorAll('[data-error]').forEach((el) => {
        const field = el.dataset.error;
        el.textContent = errors[field] || '';
        form[field].classList.toggle('input-error', Boolean(errors[field]));
      });

      if (!valid) {
        Toast.show('Vui lòng kiểm tra lại thông tin', 'error');
        return;
      }

      // Đặt hàng thành công (demo: chưa có backend)
      const total = formatPrice(this.cartService.total);
      this.cartService.clear();
      Toast.show('Đặt hàng thành công!', 'success');

      container.innerHTML = `
        <div class="container section empty-state fade-in">
          <p style="font-size:3rem">🎉</p>
          <h2>Cảm ơn ${escapeHtml(data.fullName.trim())}!</h2>
          <p>Đơn hàng trị giá <strong>${total}</strong> đã được ghi nhận.</p>
          <p>Chúng tôi sẽ liên hệ qua số <strong>${escapeHtml(data.phone.trim())}</strong>
             để xác nhận giao hàng.</p>
          <a href="#/products" class="btn btn--primary btn--lg">Tiếp tục mua sắm</a>
        </div>
      `;
    });
  }
}
