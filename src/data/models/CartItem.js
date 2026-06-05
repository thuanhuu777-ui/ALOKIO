/**
 * ============================================================
 * DATA LAYER - Model: CartItem
 * Một dòng trong giỏ hàng = 1 sản phẩm + số lượng.
 * ============================================================
 */
class CartItem {
  /**
   * @param {import('./Product.js').Product} product - Sản phẩm
   * @param {number} quantity - Số lượng
   */
  constructor(product, quantity = 1) {
    this.product = product;
    this.quantity = quantity;
  }

  /** Thành tiền của dòng này */
  get total() {
    return this.product.price * this.quantity;
  }

  /** Chuyển về dạng gọn để lưu LocalStorage (chỉ lưu id + số lượng) */
  toJSON() {
    return { productId: this.product.id, quantity: this.quantity };
  }
}
