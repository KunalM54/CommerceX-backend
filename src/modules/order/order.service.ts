import { Order } from "./order.model.js";

/**
 * Get order history for a specific customer
 * Supports filtering by status (e.g. pending, paid, failed, cancelled)
 */
export const getOrderHistory = async (userId: string, status?: string) => {
  const query: any = { user: userId };

  if (status) {
    query.status = status;
  }

  // Find orders, sort by newest first
  return await Order.find(query)
    .populate({
      path: "items.product",
      select: "name price images",
    })
    .sort({ createdAt: -1 });
};
