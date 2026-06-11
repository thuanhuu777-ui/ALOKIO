class ProductService {
  /**
   * @param {import('../../data/repositories/ProductRepository.js').ProductRepository} productRepository
   */
  constructor(productRepository) {
    this.repo = productRepository;
  }

  /** Lấy toàn bộ sản phẩm */
  async getProducts() {
    return this.repo.getAll();
  }

  /** Lấy sản phẩm nổi bật (hiển thị trang chủ) */
  async getFeaturedProducts() {
    const products = await this.repo.getAll();
    return products.filter((p) => p.featured);
  }

  /** Lấy sản phẩm đang khuyến mãi (có giá gốc cao hơn giá bán) */
  async getDiscountedProducts() {
    const products = await this.repo.getAll();
    return products.filter((p) => p.hasDiscount);
  }

  /** Lấy chi tiết 1 sản phẩm theo id */
  async getProductById(id) {
    return this.repo.getById(id);
  }

  /** Danh sách thương hiệu (không trùng lặp) */
  async getBrands() {
    return this.repo.getBrands();
  }

  /** Danh sách dòng loa (không trùng lặp) */
  async getCategories() {
    return this.repo.getCategories();
  }

  /** Video khách hàng trải nghiệm (carousel trang chủ) */
  async getCustomerVideos() {
    return this.repo.getCustomerVideos();
  }

  /**
   * Phân trang một mảng sản phẩm.
   * @param {Array} products - Danh sách sau khi đã search/filter/sort
   * @param {number} page - Trang hiện tại (bắt đầu từ 1)
   * @param {number} perPage - Số sản phẩm mỗi trang
   * @returns {{items: Array, page: number, totalPages: number, totalItems: number}}
   */
  paginate(products, page = 1, perPage = 8) {
    const totalItems = products.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * perPage;
    return {
      items: products.slice(start, start + perPage),
      page: safePage,
      totalPages,
      totalItems,
    };
  }
}
