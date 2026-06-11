/**
 * ============================================================
 * DATA LAYER - Repository: ProductRepository
 * Cầu nối giữa Business Layer và nguồn dữ liệu.
 *
 * Nguồn dữ liệu theo thứ tự ưu tiên:
 * 1. Database Supabase (bảng products + product_images + customer_videos)
 * 2. Dữ liệu local trong productData.js (khi chưa cấu hình
 *    Supabase hoặc mất mạng) -> website luôn chạy được.
 * ============================================================
 */
/* global productData, customerVideos, Product, supabaseClient, mediaUrl */

class ProductRepository {
  constructor() {
    /** @type {Promise<Product[]>|null} Cache: chỉ tải dữ liệu 1 lần */
    this._productsPromise = null;
    /** @type {Promise<Array>|null} */
    this._videosPromise = null;
  }

  // ==================== SẢN PHẨM ====================

  /**
   * Lấy toàn bộ sản phẩm (có cache).
   * @returns {Promise<Product[]>}
   */
  async getAll() {
    if (!this._productsPromise) {
      this._productsPromise = this._loadProducts();
    }
    return [...(await this._productsPromise)];
  }

  /** Tải sản phẩm: thử Supabase trước, lỗi thì dùng dữ liệu local */
  async _loadProducts() {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('products')
          .select('*, product_images(url, sort_order)')
          .order('id');

        if (!error && data && data.length > 0) {
          return data.map((row) => Product.fromJSON(this._mapRow(row)));
        }
        if (error) console.warn('[Supabase] Lỗi tải sản phẩm:', error.message);
      } catch (err) {
        console.warn('[Supabase] Không kết nối được, dùng dữ liệu local:', err);
      }
    }
    // Fallback: dữ liệu local
    return productData.map((item) => Product.fromJSON(item));
  }

  /**
   * Chuyển 1 dòng database (snake_case) -> dữ liệu cho Product model.
   * Ảnh được sắp theo sort_order, đổi path Storage thành URL đầy đủ.
   */
  _mapRow(row) {
    const images = (row.product_images || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((img) => mediaUrl(img.url));

    return {
      id: row.id,
      name: row.name,
      brand: row.brand,
      category: row.category,
      price: Number(row.price),
      oldPrice: row.old_price !== null ? Number(row.old_price) : null,
      description: row.description || '',
      specs: row.specs || {},
      images,
      rating: Number(row.rating) || 0,
      stock: row.stock ?? 0,
      featured: Boolean(row.featured),
    };
  }

  /**
   * Tìm sản phẩm theo id.
   * @returns {Promise<Product|null>}
   */
  async getById(id) {
    const products = await this.getAll();
    return products.find((p) => p.id === Number(id)) || null;
  }

  /** Danh sách thương hiệu (không trùng lặp) */
  async getBrands() {
    const products = await this.getAll();
    return [...new Set(products.map((p) => p.brand))];
  }

  /** Danh sách dòng loa (không trùng lặp) */
  async getCategories() {
    const products = await this.getAll();
    return [...new Set(products.map((p) => p.category))];
  }

  // ==================== VIDEO KHÁCH HÀNG ====================

  /**
   * Video khách hàng trải nghiệm (có cache).
   * @returns {Promise<{id:number, title:string, src:string}[]>}
   */
  async getCustomerVideos() {
    if (!this._videosPromise) {
      this._videosPromise = this._loadVideos();
    }
    return [...(await this._videosPromise)];
  }

  async _loadVideos() {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('customer_videos')
          .select('*')
          .order('sort_order');

        if (!error && data && data.length > 0) {
          return data.map((row) => ({
            id: row.id,
            title: row.title,
            src: mediaUrl(row.url),
          }));
        }
        if (error) console.warn('[Supabase] Lỗi tải video:', error.message);
      } catch (err) {
        console.warn('[Supabase] Không kết nối được, dùng video local:', err);
      }
    }
    return [...customerVideos];
  }
}
