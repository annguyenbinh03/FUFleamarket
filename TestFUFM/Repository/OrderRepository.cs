using Api.orderDto;
using BusinessObjects.Models;
using BusinessObjects;
using BusinessObjects.OrderDto;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObjects.Mappers;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Repository
{
    public class OrderRepository : IOrderRepository
    {
        private readonly FufleaMarketContext _context;
        public OrderRepository(FufleaMarketContext context)
        {
            _context = context;
        }
        public async Task<List<Order>> GetAllOrderAsync()
        {
            return await _context.Orders.Include(add => add.Feedbacks).ToListAsync();

        }

        public async Task<Order?> GetByOrderIdAsync(int id)
        {
            return await _context.Orders.Include(c => c.Feedbacks).SingleOrDefaultAsync(i => i.OrderId == id);
        }

        public async Task<Order?> UpdateOrderAsync(int id, UpdateOrderRequestDto updateOrder)
        {
            var existingOrder = await _context.Orders.FirstOrDefaultAsync(u => u.OrderId == id);
            if (existingOrder == null)
            {
                return null;
            }
            existingOrder.OrderDate = updateOrder.OrderDate;
            existingOrder.PaymentMethod = updateOrder.PaymentMethod;
            existingOrder.Status = updateOrder.Status;
            existingOrder.Note = updateOrder.Note;
            existingOrder.Quantity = updateOrder.Quantity;
            existingOrder.ReceiverAddress = updateOrder.ReceiverAddress;

            await _context.SaveChangesAsync();
            return existingOrder;
        }

        public async Task<Order> CreateOrderAsync(Order orderModel)
        {
            await _context.Orders.AddAsync(orderModel);
            await _context.SaveChangesAsync();
            return orderModel;
        }
        public async Task<Order?> DeleteOrderAsync(int id)
        {
            var orderModel = await _context.Orders.FirstOrDefaultAsync(x => x.OrderId == id);
            if (orderModel == null)
            {
                return null;
            }
            orderModel.Status = 2;
            await _context.SaveChangesAsync();
            return orderModel;
        }

        public async Task<bool> OrderExistsAsync(int orderId)
        {
            return await _context.Orders.AnyAsync(o => o.OrderId == orderId);
        }
        public async Task<List<Order>> GetOrdersBySellerIdAsync(int sellerId, bool sortByDate = false, bool sortByPrice = false, bool descending = false)
        {
            IQueryable<Order> query = _context.Orders
                        .Where(order => order.SellerId == sellerId)
                        .Include(order => order.Product)
                        .Include(order => order.Buyer);
                        

           
            if (sortByDate)
            {
                query = descending ? query.OrderByDescending(order => order.OrderDate) : query.OrderBy(order => order.OrderDate);
            }
            else if (sortByPrice)
            {
                query = descending ? query.OrderByDescending(order => order.Price) : query.OrderBy(order => order.Price);
            }

            return await query.ToListAsync();
        }

        public async Task<List<Order>> GetOrdersByBuyerIdAsync(int buyerId, bool sortByDate = false, bool sortByPrice = false, bool descending = false)
        {
            IQueryable<Order> query = _context.Orders
                .Where(order => order.BuyerId == buyerId)
                .Include(order => order.Product)
                .Include(order => order.Seller);

            if (sortByDate)
            {
                query = descending ? query.OrderByDescending(order => order.OrderDate) : query.OrderBy(order => order.OrderDate);
            }
            else if (sortByPrice)
            {
                query = descending ? query.OrderByDescending(order => order.Price) : query.OrderBy(order => order.Price);
            }

            return await query.ToListAsync();

        }

        public async Task<bool> AcceptOrderAsync(int userId, int productId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return false;
            }
            var order = await _context.Orders.FindAsync(productId);
            if (userId == order?.SellerId)
            {
                order.Status = 1;
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }
        public async Task<bool> DenyOrderAsync(int userId, int productId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return false;
            }
            var order = await _context.Orders.FindAsync(productId);
            if (userId == order?.SellerId)
            {
                order.Status = 2;
                await _context.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
