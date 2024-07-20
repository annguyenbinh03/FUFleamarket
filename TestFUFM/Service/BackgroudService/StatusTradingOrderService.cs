using BusinessObjects;
using BusinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Repository.Interfaces;
using System;
using System.Threading.Tasks;
namespace Service.BackgroudService
{
    public class StatusTradingOrderService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;

        public StatusTradingOrderService(IServiceScopeFactory serviceScopeFactory)
        {
            _serviceScopeFactory = serviceScopeFactory;
        }

        public async Task RunBackgroundJobForTradingOrder(int orderId, DateTime acceptTime)
        {
            // Wait for 1 minute (example delay)
            await Task.Delay(TimeSpan.FromDays(3));

            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var tradingOrderRepository = scope.ServiceProvider.GetRequiredService<ITradingOrderRepository>();

                try
                {
                    var updatedOrder = await tradingOrderRepository.UpdateStatusAsync(orderId);
                    var _context = scope.ServiceProvider.GetRequiredService<FufleaMarketContext>(); // Add this line to get the DbContext instance
                    var tradingOrder = await _context.TradingOrders
                                                 .Include(to => to.TradingOrderDetails)
                                                 .FirstOrDefaultAsync(to => to.TradingOrderId == orderId);
                    if (updatedOrder != null)
                    {
                        // Không cần cập nhật lại trạng thái
                        if (tradingOrder.TradingOrderDetails == null || !tradingOrder.TradingOrderDetails.Any())
                        {
                            Console.WriteLine("No order details found for the order.");
                            return;
                        }

                        foreach (var detail in tradingOrder.TradingOrderDetails)
                        {
                            var product = await _context.Products.FindAsync(detail.ProductId);
                            if (product != null)
                            {
                                product.StoredQuantity += detail.Quantity;
                                Console.WriteLine($"Product ID {product.ProductId} stock updated. Current stock: {product.StoredQuantity}");
                            }
                            else
                            {
                                Console.WriteLine($"Product ID {detail.ProductId} not found.");
                            }
                        }
                        // Thông tin User1
                        var user1 = await _context.Users
                                          .Where(u => u.UserId == tradingOrder.User1)
                                          .FirstOrDefaultAsync();
                        if (user1 == null)
                        {
                            Console.WriteLine($"UserId1: {tradingOrder.User1} not found.");
                        }
                        else
                        {
                            // Tính toán avg BuyRating và số lần mua thành công của User1
                            var buyRatingUser1 = (user1.BuyTimes * user1.BuyRating) / (user1.BuyTimes + 1);
                            var buyTimesUser1 = user1.BuyTimes + 1;

                            // Cập nhật thông tin của User1 và lưu BuyRating
                            user1.BuyRating = buyRatingUser1;
                            user1.BuyTimes = buyTimesUser1;
                        }
                        await _context.SaveChangesAsync();
                        Console.WriteLine($"Order with ID {updatedOrder.TradingOrderId} status updated to 2.");
                        Console.WriteLine($"Order ID: {updatedOrder.TradingOrderId}, User1: {updatedOrder.User1}, User2: {updatedOrder.User2}, Status: {updatedOrder.Status}");
                        Console.WriteLine($"Background service (TradingOrder) is running at: {DateTimeOffset.Now}");
                    }
                }
                catch (KeyNotFoundException)
                {
                    Console.WriteLine($"Error: Order with ID {orderId} was not found.");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"An unexpected error occurred: {ex.Message}");
                }
            }
        }
    }
}