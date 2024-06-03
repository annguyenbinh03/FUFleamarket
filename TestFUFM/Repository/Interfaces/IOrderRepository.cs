using BusinessObjects.Models;
using BusinessObjects.OrderDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IOrderRepository
    {
        Task<IEnumerable<Order>> GetAllOrderAsync();
        Task<Order?> GetByOrderIdAsync(int id);
        Task<Order> CreateOrderAsync(Order orderModel);
        Task<Order?> UpdateOrderAsync(int id, UpdateOrderRequestDto dto);
        Task<Order?> DeleteOrderAsync(int id);
        Task<bool> OrderExistsAsync(int orderId);
        Task<IEnumerable<Order>> GetOrdersBySellerIdAsync(int sellerId);
        Task<IEnumerable<Order>> GetOrdersByBuyerIdAsync(int buyerId);
    }
}
