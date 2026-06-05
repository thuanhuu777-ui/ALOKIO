/**
 * ============================================================
 * BUSINESS LAYER - UseCase: SortUseCase
 * Sắp xếp sản phẩm: giá tăng dần / giá giảm dần / đánh giá cao.
 * ============================================================
 */

/** Các kiểu sắp xếp hỗ trợ (dùng cho <select> ở UI) */
const SORT_OPTIONS = [
  { id: 'default', label: 'Mặc định' },
  { id: 'price-asc', label: 'Giá tăng dần' },
  { id: 'price-desc', label: 'Giá giảm dần' },
  { id: 'rating-desc', label: 'Đánh giá cao nhất' },
];

class SortUseCase {
  /**
   * Thực thi sắp xếp. KHÔNG mutate mảng gốc (trả về bản sao).
   * @param {Array} products - Danh sách sản phẩm
   * @param {string} sortType - 'price-asc' | 'price-desc' | 'rating-desc' | 'default'
   * @returns {Array}
   */
  execute(products, sortType = 'default') {
    const sorted = [...products];

    switch (sortType) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating-desc':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted; // Giữ thứ tự gốc
    }
  }
}
