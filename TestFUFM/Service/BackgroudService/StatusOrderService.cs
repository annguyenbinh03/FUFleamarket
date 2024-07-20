using BusinessObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Repository.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;


namespace Service.BackgroudService
{


    public class StatusOrderService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;

        public StatusOrderService(IServiceScopeFactory serviceScopeFactory)
        {
            _serviceScopeFactory = serviceScopeFactory;
        }

        public async Task RunBackgroundJobForOrder(int orderId, DateTime acceptTime)
        {

            await Task.Delay(TimeSpan.FromDays(3));

            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var orderRepository = scope.ServiceProvider.GetRequiredService<IOrderRepository>();
                var _context = scope.ServiceProvider.GetRequiredService<FufleaMarketContext>();

                try
                {
                    var findOrder = await orderRepository.GetByOrderIdAsync(orderId);

                    if (findOrder == null)
                    {
                        Console.WriteLine($"Order with ID {orderId} not found.");
                        return;
                    }

                    if (findOrder.Status != 1)
                    {
                        Console.WriteLine($"Order with ID {orderId} has status != 1");
                        return;
                    }

                    var product = await _context.Products.FindAsync(findOrder.ProductId);
                    if (product != null)
                    {
                        product.StoredQuantity += findOrder.Quantity;
                        Console.WriteLine($"Product ID {product.ProductId} stock updated. Current stock: {product.StoredQuantity}");
                    }
                    else
                    {
                        Console.WriteLine($"Product ID {findOrder.ProductId} not found.");
                    }

                    var user1 = await _context.Users.FirstOrDefaultAsync(u => u.UserId == findOrder.BuyerId);
                    if (user1 == null)
                    {
                        Console.WriteLine($"UserId1: {findOrder.BuyerId} not found.");
                    }
                    else
                    {
                        var buyRatingUser1 = (user1.BuyTimes * user1.BuyRating) / (user1.BuyTimes + 1);
                        var buyTimesUser1 = user1.BuyTimes + 1;

                        user1.BuyRating = buyRatingUser1;
                        user1.BuyTimes = buyTimesUser1;
                    }

                    findOrder.Status = 2;
                    await _context.SaveChangesAsync();

                    Console.WriteLine($"Order with ID {findOrder.OrderId} status updated to 2.");
                    Console.WriteLine($"Order ID: {findOrder.OrderId}, User1: {findOrder.BuyerId}, User2: {findOrder.SellerId}, Status: {findOrder.Status}");
                    Console.WriteLine($"Background service (Order) is running at: {DateTimeOffset.Now}");
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