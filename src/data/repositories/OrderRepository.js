/**
 * ============================================================
 * DATA LAYER - Repository: OrderRepository
 * Lưu đơn hàng vào database Supabase (bảng orders + order_items).
 * Khi chưa cấu hình Supabase: trả về offline=true, đơn vẫn
 * hiển thị thành công trên web (cửa hàng nhận tin qua chuyển khoản).
 * ============================================================
 */
/* global supabaseClient */

class OrderRepository {
  /**
   * Tạo đơn hàng mới.
   * @param {Object} order - { fullName, phone, email, address, total }
   * @param {Array}  items - CartItem[] (sản phẩm trong giỏ)
   * @returns {Promise<{success: boolean, orderId?: number, offline?: boolean, message?: string}>}
   */
  async create(order, items) {
    // Chưa kết nối database -> báo offline để UI xử lý nhẹ nhàng
    if (!supabaseClient) {
      return { success: false, offline: true };
    }

    try {
      // 1. Ghi đơn hàng, lấy về id vừa tạo
      const { data, error } = await supabaseClient
        .from('orders')
        .insert({
          full_name: order.fullName,
          phone: order.phone,
          email: order.email,
          address: order.address,
          total: order.total,
          payment_method: 'qr_transfer',
          status: 'pending_payment', // Chờ cửa hàng kiểm tra tiền
        })
        .select('id')
        .single();

      if (error) {
        return { success: false, message: error.message };
      }

      // 2. Ghi chi tiết từng sản phẩm trong đơn
      const rows = items.map((item) => ({
        order_id: data.id,
        product_id: item.product.id,
        product_name: item.product.name, // Lưu tên + giá tại thời điểm mua
        price: item.product.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabaseClient
        .from('order_items')
        .insert(rows);

      if (itemsError) {
        return { success: false, message: itemsError.message };
      }

      return { success: true, orderId: data.id };
    } catch (err) {
      return { success: false, message: String(err) };
    }
  }
}
