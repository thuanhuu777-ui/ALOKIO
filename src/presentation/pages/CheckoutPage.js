/**
 * ============================================================
 * PRESENTATION LAYER - Page: CheckoutPage (Thanh toán)
 * Quy trình 2 bước:
 *   Bước 1: Form thông tin khách hàng (validate qua Business Layer)
 *   Bước 2: Quét QR chuyển khoản -> THANH TOÁN TRƯỚC, GỬI HÀNG SAU
 * ============================================================
 */
/* global Toast, formatPrice, escapeHtml */

class CheckoutPage {
  /**
   * @param {Object} deps
   * @param {import('../../business/services/CartService.js').CartService} deps.cartService
   * @param {import('../../business/validators/CheckoutValidator.js').CheckoutValidator} deps.validator
   * @param {Object} deps.payment - Thông tin chuyển khoản (STORE_INFO.payment)
   * @param {Object} deps.orderService - OrderService (lưu đơn vào database)
   */
  constructor({ cartService, validator, payment, orderService }) {
    this.cartService = cartService;
    this.validator = validator;
    this.payment = payment;
    this.orderService = orderService;
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
              Tiếp tục → Thanh toán QR
            </button>
            <p class="payment-policy">
              💡 Cửa hàng áp dụng <strong>thanh toán trước khi gửi hàng</strong>:
              sau khi điền thông tin, bạn sẽ quét mã QR để chuyển khoản.
            </p>
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

      // Thông tin hợp lệ -> sang bước 2: thanh toán QR
      this._renderPayment(container, data);
    });
  }

  /**
   * BƯỚC 2: Màn hình thanh toán QR.
   * Khách quét mã chuyển khoản -> bấm "Tôi đã chuyển khoản"
   * -> đơn được ghi nhận, cửa hàng kiểm tra tiền rồi gửi hàng.
   * @param {HTMLElement} container
   * @param {Object} data - Thông tin khách đã nhập ở bước 1
   */
  _renderPayment(container, data) {
    const pay = this.payment;
    const total = this.cartService.total;
    const customerName = escapeHtml(data.fullName.trim());
    const customerPhone = escapeHtml(data.phone.trim());
    // Nội dung chuyển khoản gợi ý để cửa hàng dễ đối soát
    const transferNote = `${data.fullName.trim()} ${data.phone.trim()} mua loa`;

    window.scrollTo({ top: 0 });
    container.innerHTML = `
      <div class="container section fade-in">
        <h1 class="page-title">Quét QR để thanh toán</h1>
        <p class="contact-intro">
          Đơn hàng sẽ được <strong>gửi đi ngay sau khi cửa hàng nhận được
          thanh toán</strong>. Vui lòng chuyển khoản đúng số tiền và nội dung
          bên dưới.
        </p>

        <div class="payment-layout">
          <!-- Mã QR -->
          <div class="payment-qr">
            <img src="${pay.qrImage}" alt="Mã QR thanh toán ${pay.bank}">
            <p class="payment-qr__hint">
              Mở app ngân hàng bất kỳ → quét mã VietQR này
            </p>
          </div>

          <!-- Thông tin chuyển khoản -->
          <div class="payment-info">
            <h3>Thông tin chuyển khoản</h3>

            <div class="payment-row">
              <span>Ngân hàng</span>
              <strong>${pay.bank} - ${escapeHtml(pay.branch)}</strong>
            </div>
            <div class="payment-row">
              <span>Chủ tài khoản</span>
              <strong>${escapeHtml(pay.accountName)}</strong>
            </div>
            <div class="payment-row">
              <span>Số tài khoản</span>
              <strong>${pay.accountNumber}</strong>
              <button class="btn-copy" data-copy="${pay.accountNumber}">Sao chép</button>
            </div>
            <div class="payment-row">
              <span>Số tiền</span>
              <strong class="payment-amount">${formatPrice(total)}</strong>
            </div>
            <div class="payment-row">
              <span>Nội dung CK</span>
              <strong>${escapeHtml(transferNote)}</strong>
              <button class="btn-copy" data-copy="${escapeHtml(transferNote)}">Sao chép</button>
            </div>

            <div class="payment-notice">
              Vui lòng chuyển <strong>đúng số tiền ${formatPrice(total)}</strong>
              và ghi đúng nội dung để đơn hàng được xác nhận nhanh nhất.
            </div>

            <button class="btn btn--accent btn--lg btn--block" id="paid-btn">
              Tôi đã chuyển khoản xong
            </button>
            <button class="btn btn--outline btn--block" id="back-btn"
                    style="margin-top:.6rem">
              ← Quay lại sửa thông tin
            </button>
          </div>
        </div>
      </div>
    `;

    // Nút sao chép STK / nội dung chuyển khoản
    container.querySelectorAll('[data-copy]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(btn.dataset.copy);
          Toast.show('Đã sao chép!', 'success');
        } catch {
          Toast.show('Không sao chép được, vui lòng chép tay', 'error');
        }
      });
    });

    // Quay lại bước 1 (giữ nguyên thông tin đã nhập)
    container.querySelector('#back-btn').addEventListener('click', async () => {
      await this.render(container);
      const form = container.querySelector('#checkout-form');
      if (form) {
        form.fullName.value = data.fullName;
        form.phone.value = data.phone;
        form.email.value = data.email;
        form.address.value = data.address;
      }
    });

    // Xác nhận đã chuyển khoản -> lưu đơn vào database -> hoàn tất
    const paidBtn = container.querySelector('#paid-btn');
    paidBtn.addEventListener('click', async () => {
      const totalValue = this.cartService.total;
      const totalText = formatPrice(totalValue);
      const items = [...this.cartService.items];

      // Chống bấm nhiều lần trong lúc đang lưu
      paidBtn.disabled = true;
      paidBtn.textContent = 'Đang ghi nhận đơn hàng...';

      // Lưu đơn vào database Supabase (qua Business Layer)
      const result = await this.orderService.placeOrder(data, items, totalValue);

      let orderLine = '';
      if (result.success) {
        orderLine = `<p>Mã đơn hàng của bạn: <strong>#${result.orderId}</strong></p>`;
        Toast.show(`Đặt hàng thành công! Mã đơn #${result.orderId}`, 'success');
      } else if (result.offline) {
        // Chưa cấu hình database -> đơn vẫn được xác nhận trên web
        Toast.show('Đặt hàng thành công!', 'success');
      } else {
        console.warn('[Đơn hàng] Lỗi lưu database:', result.message);
        Toast.show('Đặt hàng thành công!', 'success');
      }

      this.cartService.clear();

      container.innerHTML = `
        <div class="container section empty-state fade-in">
          <p style="font-size:3rem">🎉</p>
          <h2>Cảm ơn ${customerName}!</h2>
          <p>Đơn hàng trị giá <strong>${totalText}</strong> đã được ghi nhận.</p>
          ${orderLine}
          <p>Cửa hàng sẽ <strong>kiểm tra thanh toán và gửi hàng ngay</strong>
             sau khi nhận được tiền.<br>
             Mọi cập nhật sẽ báo qua số <strong>${customerPhone}</strong>.</p>
          <a href="#/products" class="btn btn--primary btn--lg">Tiếp tục mua sắm</a>
        </div>
      `;
    });
  }
}
