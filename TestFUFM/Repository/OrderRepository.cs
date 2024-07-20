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
using DTO.Helpers;

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
            return await _context.Orders.ToListAsync();

        }

        public async Task<Order?> GetByOrderIdAsync(int id)
        {
            return await _context.Orders.SingleOrDefaultAsync(i => i.OrderId == id);
        }

        public async Task<Order?> UpdateOrderAsync(int id, UpdateOrderRequestDto updateOrder)
        {
            var existingOrder = await _context.Orders.FirstOrDefaultAsync(u => u.OrderId == id);
            if (existingOrder == null)
            {
                return null;
            }
            existingOrder.PaymentMethod = updateOrder.PaymentMethod;
            existingOrder.Status = updateOrder.Status;
            existingOrder.Note = updateOrder.Note;
            existingOrder.Quantity = updateOrder.Quantity;
            existingOrder.ReceiverAddress = updateOrder.ReceiverAddress;
            existingOrder.CreatedDate = DateTime.Now.AddHours(7);

            await _context.SaveChangesAsync();
            return existingOrder;
        }

        public async Task<Order> CreateOrderAsync(Order orderModel)
        {
            orderModel.CreatedDate = SEATimeZone.GetCurrentSEATime();
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

        public async Task<List<Order>> GetMyOrdersRequestBySellerIdAsync(int sellerId, bool sortByDate = false, bool sortByPrice = false, bool descending = false)
        {
            IQueryable<Order> query = _context.Orders
                        .Where(order => order.SellerId == sellerId && order.Status == 0)
                        .Include(order => order.Product)
                        .Include(order => order.Buyer) ;



            if (sortByDate)
            {
                query = descending ? query.OrderByDescending(order => order.CreatedDate) : query.OrderByDescending(order => order.CreatedDate);
            }
            else if (sortByPrice)
            {
                query = descending ? query.OrderByDescending(order => order.Price) : query.OrderBy(order => order.Price);
            }

            return await query.ToListAsync();
        }


        public async Task<List<Order>> GetOrdersBySellerIdAsync(int sellerId, bool sortByDate = false, bool sortByPrice = false, bool descending = false)
        {
            IQueryable<Order> query = _context.Orders
                        .Where(order => order.SellerId == sellerId)
                        .Include(order => order.Product)
                        .Include(order => order.Buyer);
                        

           
            if (sortByDate)
            {
                query = descending ? query.OrderByDescending(order => order.CreatedDate) : query.OrderBy(order => order.CreatedDate);
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
                .Include(order => order.Seller)
                .OrderByDescending(order => order.CreatedDate);
            query.OrderByDescending(order => order.CreatedDate);
            if (sortByDate)
            {
                query = descending ? query.OrderByDescending(order => order.CreatedDate) : query.OrderByDescending(order => order.CreatedDate);
            }
            else if (sortByPrice)
            {
                query = descending ? query.OrderByDescending(order => order.Price) : query.OrderBy(order => order.Price);
            }

            return await query.ToListAsync();

        }

        public async Task<bool> AcceptOrderAsync(int userId, int orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null || order.SellerId != userId || order.Status != 0) return false;

            order.Status = 1;
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DenyOrderAsync(int userId, int orderId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return false;
            }
            var order = await _context.Orders.FindAsync(orderId);
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

        public async Task<Order> GetOrderByProductIdAsync(int userId, int productId)
        {
            return await _context.Orders
                         .FirstOrDefaultAsync(o => o.BuyerId == userId && o.ProductId == productId);
        }

        public async Task UpdateBuyerRatingAsync(int buyerId, int rating)
        {
            var buyer = await _context.Users.FindAsync(buyerId);
            if (buyer != null)
            {
                buyer.BuyRating = rating;
                _context.Users.Update(buyer);
                await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateSellerRatingAsync(int sellerId, int rating)
        {
            var seller = await _context.Users.FindAsync(sellerId);
            if (seller != null)
            {
                seller.SellRating = rating;
                _context.Users.Update(seller);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> CompleteOrderAsync(int userId, int orderId)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == orderId && o.SellerId == userId);
            if (order == null)
            {
                return false;
            }

            order.Status = 3; // Update status to 3 (completed)
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectOrderAsync(int userId, int orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null || order.SellerId != userId)
            {
                return false;
            }

            order.Status = 2; // Status 2 for rejected orders
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateOrderAsync(int orderId, Order order)
        {
            var existingOrder = await _context.Orders.FindAsync(orderId);
            if (existingOrder == null)
            {
                return false;
            }

            existingOrder.Status = order.Status;
            _context.Orders.Update(existingOrder);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Order>> GetOrdersByUserId(int userId)
        {
            return await _context.Orders
       .Include(o => o.Product)  // Include related Product entity
       .Include(o => o.Buyer)    // Include related Buyer entity
       .Where(o => o.SellerId == userId)
       .ToListAsync();
        }

        public async Task<Order> GetOrderByProductIdAsync( int productId)
        {
            return await _context.Orders
                         .FirstOrDefaultAsync(o => o.ProductId == productId);
        }
        public async Task<bool> CheckProductHasAnyActiveOrder(int productId)
        {
            return await _context.Orders
                         .Where(o => o.ProductId == productId)
                         .AnyAsync(o => o.Status == 0 || o.Status == 1);
        }

    }
}
