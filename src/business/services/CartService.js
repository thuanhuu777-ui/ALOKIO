class CartService {
  /**
   * @param {import('../../data/repositories/CartRepository.js').CartRepository} cartRepository
   * @param {import('../../data/repositories/ProductRepository.js').ProductRepository} productRepository
   */
  constructor(cartRepository, productRepository) {
    this.cartRepo = cartRepository;
    this.productRepo = productRepository;
    /** @type {CartItem[]} */
    this.items = [];
    /** @type {Function[]} Danh sách callback lắng nghe thay đổi */
    this._listeners = [];
  }

  /** Khôi phục giỏ hàng từ LocalStorage (gọi 1 lần khi app khởi động) */
  async init() {
    const saved = this.cartRepo.load();
    const products = await this.productRepo.getAll();
    this.items = saved
      .map((row) => {
        const product = products.find((p) => p.id === row.productId);
        return product ? new CartItem(product, row.quantity) : null;
      })
      .filter(Boolean); // Bỏ sản phẩm không còn tồn tại
    this._notify();
  }

  /** Đăng ký lắng nghe thay đổi giỏ hàng */
  subscribe(callback) {
    this._listeners.push(callback);
  }

  /** Thông báo cho tất cả listener + lưu LocalStorage */
  _notify() {
    this.cartRepo.save(this.items.map((item) => item.toJSON()));
    this._listeners.forEach((cb) => cb(this));
  }

  /**
   * Thêm sản phẩm vào giỏ.
   * @returns {{success: boolean, message: string}}
   */
  add(product, quantity = 1) {
    // Chặn số lượng không hợp lệ
    if (!Number.isFinite(quantity) || quantity <= 0) {
      return { success: false, message: 'Số lượng không hợp lệ' };
    }

    const existing = this.items.find((i) => i.product.id === product.id);
    const currentQty = existing ? existing.quantity : 0;

    // Nghiệp vụ: không cho đặt vượt tồn kho
    if (currentQty + quantity > product.stock) {
      return {
        success: false,
        message: `Chỉ còn ${product.stock} sản phẩm trong kho`,
      };
    }

    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push(new CartItem(product, quantity));
    }
    this._notify();
    return { success: true, message: `Đã thêm "${product.name}" vào giỏ hàng` };
  }

  /** Xóa hẳn 1 sản phẩm khỏi giỏ */
  remove(productId) {
    this.items = this.items.filter((i) => i.product.id !== productId);
    this._notify();
  }

  /**
   * Cập nhật số lượng. Nếu về 0 thì xóa khỏi giỏ.
   * @returns {{success: boolean, message?: string}}
   */
  updateQuantity(productId, quantity) {
    const item = this.items.find((i) => i.product.id === productId);
    if (!item) return { success: false, message: 'Sản phẩm không có trong giỏ' };

    if (quantity <= 0) {
      this.remove(productId);
      return { success: true };
    }
    if (quantity > item.product.stock) {
      return {
        success: false,
        message: `Chỉ còn ${item.product.stock} sản phẩm trong kho`,
      };
    }
    item.quantity = quantity;
    this._notify();
    return { success: true };
  }

  /** Xóa toàn bộ giỏ (sau khi đặt hàng thành công) */
  clear() {
    this.items = [];
    this.cartRepo.clear();
    this._listeners.forEach((cb) => cb(this));
  }

  /** Tổng số lượng sản phẩm (hiện trên badge icon giỏ hàng) */
  get count() {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  }

  /** Tổng tiền toàn giỏ */
  get total() {
    return this.items.reduce((sum, i) => sum + i.total, 0);
  }

  /** Giỏ hàng trống? */
  get isEmpty() {
    return this.items.length === 0;
  }
}
