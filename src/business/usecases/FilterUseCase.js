const PRICE_RANGES = [
  { id: 'all', label: 'Tất cả mức giá', min: 0, max: Infinity },
  { id: 'under-3m', label: 'Dưới 3 triệu', min: 0, max: 3000000 },
  { id: '3m-4m', label: '3 - 4 triệu', min: 3000000, max: 4000000 },
];

class FilterUseCase {
  /**
   * Thực thi lọc.
   * @param {Array} products - Danh sách sản phẩm
   * @param {Object} criteria - Tiêu chí lọc
   * @param {string[]} [criteria.brands] - Thương hiệu được chọn (rỗng = tất cả)
   * @param {string[]} [criteria.categories] - Dòng loa được chọn (rỗng = tất cả)
   * @param {string} [criteria.priceRangeId] - id khoảng giá trong PRICE_RANGES
   * @returns {Array}
   */
  execute(products, { brands = [], categories = [], priceRangeId = 'all' } = {}) {
    let result = products;

    // 1. Lọc theo thương hiệu (nếu có chọn)
    if (brands.length > 0) {
      result = result.filter((p) => brands.includes(p.brand));
    }

    // 2. Lọc theo dòng loa (nếu có chọn)
    if (categories.length > 0) {
      result = result.filter((p) => categories.includes(p.category));
    }

    // 3. Lọc theo khoảng giá
    const range = PRICE_RANGES.find((r) => r.id === priceRangeId);
    if (range && range.id !== 'all') {
      result = result.filter((p) => p.price >= range.min && p.price < range.max);
    }

    return result;
  }
}
