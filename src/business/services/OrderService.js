class OrderService {
  /**
   * @param {Object} orderRepository - OrderRepository (Data Layer)
   */
  constructor(orderRepository) {
    this.repo = orderRepository;
  }

  /**
   * Đặt đơn hàng mới.
   * @param {Object} customer - { fullName, phone, email, address } (đã validate)
   * @param {Array} items - CartItem[] trong giỏ
   * @param {number} total - Tổng tiền
   * @returns {Promise<{success: boolean, orderId?: number, offline?: boolean, message?: string}>}
   */
  async placeOrder(customer, items, total) {
    if (!items || items.length === 0) {
      return { success: false, message: 'Giỏ hàng trống' };
    }

    return this.repo.create(
      {
        fullName: customer.fullName.trim(),
        phone: customer.phone.trim(),
        email: customer.email.trim(),
        address: customer.address.trim(),
        total,
      },
      items
    );
  }
}
