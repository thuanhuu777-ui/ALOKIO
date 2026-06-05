/**
 * ============================================================
 * DATA LAYER - Repository: ProductRepository
 * Cầu nối giữa Business Layer và nguồn dữ liệu (datasource).
 * Business Layer KHÔNG truy cập trực tiếp productData,
 * chỉ làm việc qua Repository -> dễ thay bằng API thật sau này.
 * ============================================================
 */
/* global productData, customerVideos, Product */

class ProductRepository {
  constructor() {
    /** @type {Product[]} Cache danh sách sản phẩm đã map sang Model */
    this._products = productData.map((item) => Product.fromJSON(item));
  }

  /**
   * Lấy toàn bộ sản phẩm.
   * Trả về Promise + delay nhỏ để giả lập gọi API
   * (nhờ đó UI có thể hiển thị Skeleton Loading).
   * @returns {Promise<Product[]>}
   */
  getAll() {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this._products]), 400);
    });
  }

  /**
   * Tìm sản phẩm theo id.
   * @param {number} id
   * @returns {Promise<Product|null>}
   */
  getById(id) {
    return new Promise((resolve) => {
      const found = this._products.find((p) => p.id === Number(id)) || null;
      setTimeout(() => resolve(found), 200);
    });
  }

  /**
   * Lấy danh sách thương hiệu (không trùng lặp).
   * @returns {string[]}
   */
  getBrands() {
    return [...new Set(this._products.map((p) => p.brand))];
  }

  /**
   * Lấy danh sách dòng loa (không trùng lặp).
   * @returns {string[]}
   */
  getCategories() {
    return [...new Set(this._products.map((p) => p.category))];
  }

  /**
   * Lấy danh sách video khách hàng trải nghiệm.
   * @returns {{id: number, title: string, src: string}[]}
   */
  getCustomerVideos() {
    return [...customerVideos];
  }
}
