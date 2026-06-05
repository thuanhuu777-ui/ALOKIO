/**
 * ============================================================
 * DATA LAYER - Model: Product
 * Định nghĩa cấu trúc dữ liệu của một sản phẩm loa.
 * Model thuần túy, KHÔNG chứa logic nghiệp vụ hay logic UI.
 * ============================================================
 */
class Product {
  /**
   * @param {Object} data - Dữ liệu thô từ datasource
   */
  constructor({
    id,
    name,
    brand,
    category = '',
    price,
    oldPrice = null,
    description = '',
    specs = {},
    images = [],
    rating = 0,
    stock = 0,
    featured = false,
  }) {
    this.id = id;
    this.name = name;
    this.brand = brand;
    this.category = category;  // Dòng sản phẩm (hiện tại: 'Loa xách tay')
    this.price = price;        // Giá hiện tại (VNĐ)
    this.oldPrice = oldPrice;  // Giá gốc trước khuyến mãi (nếu có)
    this.description = description;
    this.specs = specs;        // Thông số kỹ thuật { label: value }
    this.images = images;      // Mảng ảnh mô tả sản phẩm
    this.rating = rating;      // Điểm đánh giá 0 - 5
    this.stock = stock;        // Số lượng tồn kho
    this.featured = featured;  // Sản phẩm nổi bật
  }

  /** Ảnh đại diện = ảnh đầu tiên trong gallery */
  get image() {
    return this.images[0] || '';
  }

  /** Sản phẩm có đang được khuyến mãi không */
  get hasDiscount() {
    return this.oldPrice !== null && this.oldPrice > this.price;
  }

  /** Phần trăm giảm giá, ví dụ: 15 (%) */
  get discountPercent() {
    if (!this.hasDiscount) return 0;
    return Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100);
  }

  /** Còn hàng hay không */
  get inStock() {
    return this.stock > 0;
  }

  /** Factory: tạo Product từ object thô */
  static fromJSON(json) {
    return new Product(json);
  }
}
