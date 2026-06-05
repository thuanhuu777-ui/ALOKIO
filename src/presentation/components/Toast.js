/**
 * ============================================================
 * PRESENTATION LAYER - Component: Toast
 * Thông báo nổi góc màn hình (thành công / lỗi / thông tin).
 * Tự biến mất sau 3 giây, click để đóng ngay.
 * ============================================================
 */
const ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

class Toast {
  /** Lấy (hoặc tạo) container chứa các toast */
  static _getContainer() {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  /**
   * Hiển thị một toast.
   * @param {string} message - Nội dung thông báo
   * @param {'success'|'error'|'info'} type - Loại thông báo
   */
  static show(message, type = 'success') {
    const container = Toast._getContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `
      <span class="toast__icon">${ICONS[type] || ICONS.info}</span>
      <span class="toast__message">${message}</span>
    `;

    container.appendChild(toast);

    // Click để đóng ngay
    toast.addEventListener('click', () => Toast._dismiss(toast));

    // Tự đóng sau 3 giây
    setTimeout(() => Toast._dismiss(toast), 3000);
  }

  /** Đóng toast với animation fade-out */
  static _dismiss(toast) {
    if (toast.classList.contains('toast--hide')) return;
    toast.classList.add('toast--hide');
    toast.addEventListener('animationend', () => toast.remove());
  }
}
