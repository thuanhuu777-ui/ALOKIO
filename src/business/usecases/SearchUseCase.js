/**
 * ============================================================
 * BUSINESS LAYER - UseCase: SearchUseCase
 * Tìm kiếm sản phẩm theo TÊN hoặc THƯƠNG HIỆU.
 * Hỗ trợ tìm không dấu (ví dụ: "may" vẫn khớp "máy").
 * ============================================================
 */
class SearchUseCase {
  /**
   * Chuẩn hóa chuỗi: thường hóa + bỏ dấu tiếng Việt.
   * @param {string} str
   */
  _normalize(str) {
    // normalize('NFD') tách dấu khỏi ký tự gốc, sau đó loại bỏ
    // các ký tự dấu (combining marks, mã Unicode 0x0300 - 0x036F)
    const decomposed = String(str).toLowerCase().normalize('NFD');
    let result = '';
    for (const ch of decomposed) {
      const code = ch.charCodeAt(0);
      const isCombiningMark = code >= 0x0300 && code <= 0x036f;
      if (!isCombiningMark) result += ch;
    }
    return result.replace(/đ/g, 'd').trim();
  }

  /**
   * Thực thi tìm kiếm.
   * @param {Array} products - Danh sách sản phẩm gốc
   * @param {string} keyword - Từ khóa người dùng nhập
   * @returns {Array} Danh sách khớp từ khóa
   */
  execute(products, keyword) {
    const query = this._normalize(keyword || '');
    if (!query) return products; // Không có từ khóa -> trả nguyên danh sách

    return products.filter((p) => {
      const name = this._normalize(p.name);
      const brand = this._normalize(p.brand);
      return name.includes(query) || brand.includes(query);
    });
  }
}
