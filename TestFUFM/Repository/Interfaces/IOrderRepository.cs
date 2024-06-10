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
        Task<List<Order>> GetAllOrderAsync();
        Task<Order?> GetByOrderIdAsync(int id);
        Task<Order> CreateOrderAsync(Order orderModel);
        Task<Order?> UpdateOrderAsync(int id, UpdateOrderRequestDto dto);
        Task<Order?> DeleteOrderAsync(int id);
        Task<bool> OrderExistsAsync(int orderId);
        Task<List<Order>> GetOrdersBySellerIdAsync(int sellerId, bool sortByDate = false, bool sortByPrice = false, bool descending = false);
        Task<List<Order>> GetOrdersByBuyerIdAsync(int buyerId, bool sortByDate = false, bool sortByPrice = false, bool descending = false);

        Task<bool> AcceptOrderAsync(int userId,int productId);
        Task<bool> DenyOrderAsync(int userId, int productId);
    }
}
