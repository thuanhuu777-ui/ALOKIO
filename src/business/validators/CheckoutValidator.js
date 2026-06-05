/**
 * ============================================================
 * BUSINESS LAYER - Validator: CheckoutValidator
 * Kiểm tra dữ liệu form thanh toán: họ tên, SĐT, địa chỉ, email.
 * Trả về danh sách lỗi theo từng field để UI hiển thị.
 * ============================================================
 */
class CheckoutValidator {
  /**
   * @param {Object} data - Dữ liệu form
   * @param {string} data.fullName - Họ tên
   * @param {string} data.phone - Số điện thoại
   * @param {string} data.address - Địa chỉ
   * @param {string} data.email - Email
   * @returns {{valid: boolean, errors: Object<string, string>}}
   */
  validate({ fullName = '', phone = '', address = '', email = '' }) {
    const errors = {};

    // --- Họ tên: bắt buộc, tối thiểu 2 ký tự ---
    const name = fullName.trim();
    if (!name) {
      errors.fullName = 'Vui lòng nhập họ tên';
    } else if (name.length < 2) {
      errors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
    }

    // --- SĐT: bắt buộc, định dạng VN (0xxxxxxxxx hoặc +84xxxxxxxxx) ---
    const phoneTrim = phone.trim();
    const phonePattern = /^(0|\+84)\d{9,10}$/;
    if (!phoneTrim) {
      errors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phonePattern.test(phoneTrim.replace(/[\s.-]/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ (VD: 0912345678)';
    }

    // --- Địa chỉ: bắt buộc, tối thiểu 10 ký tự ---
    const addr = address.trim();
    if (!addr) {
      errors.address = 'Vui lòng nhập địa chỉ giao hàng';
    } else if (addr.length < 10) {
      errors.address = 'Địa chỉ quá ngắn, vui lòng nhập chi tiết hơn';
    }

    // --- Email: bắt buộc, đúng định dạng ---
    const emailTrim = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailTrim) {
      errors.email = 'Vui lòng nhập email';
    } else if (!emailPattern.test(emailTrim)) {
      errors.email = 'Email không hợp lệ (VD: ten@gmail.com)';
    }

    return { valid: Object.keys(errors).length === 0, errors };
  }
}
