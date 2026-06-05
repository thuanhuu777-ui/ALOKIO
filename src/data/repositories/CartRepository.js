/**
 * ============================================================
 * DATA LAYER - Repository: CartRepository
 * Chịu trách nhiệm LƯU / ĐỌC giỏ hàng từ LocalStorage.
 * Chỉ lưu dạng gọn [{ productId, quantity }] để tránh
 * dữ liệu sản phẩm bị lỗi thời.
 * ============================================================
 */
const STORAGE_KEY = 'soundhub_cart';

class CartRepository {
  /**
   * Đọc giỏ hàng đã lưu.
   * @returns {{productId: number, quantity: number}[]}
   */
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      // Dữ liệu hỏng -> coi như giỏ rỗng
      return [];
    }
  }

  /**
   * Lưu giỏ hàng.
   * @param {{productId: number, quantity: number}[]} items
   */
  save(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  /** Xóa toàn bộ giỏ hàng đã lưu */
  clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
}
