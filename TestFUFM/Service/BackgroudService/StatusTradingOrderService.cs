using Microsoft.Extensions.DependencyInjection;
using Repository.Interfaces;
using System;
using System.Threading.Tasks;

public class StatusTradingOrderService
{
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public StatusTradingOrderService(IServiceScopeFactory serviceScopeFactory)
    {
        _serviceScopeFactory = serviceScopeFactory;
    }

    public async Task RunBackgroundJobAsync(int orderId, DateTime acceptTime)
    {
        // Wait for 1 minute (example delay)
        await Task.Delay(TimeSpan.FromSeconds(20));

        using (var scope = _serviceScopeFactory.CreateScope())
        {
            var tradingOrderRepository = scope.ServiceProvider.GetRequiredService<ITradingOrderRepository>();

            try
            {
                // Update status
                var updatedOrder = await tradingOrderRepository.UpdateStatusAsync(orderId);
                if (updatedOrder != null)
                {
                    updatedOrder.Status = 2; // Assuming status 2 means completed                   

                    Console.WriteLine($"Order with ID {updatedOrder.TradingOrderId} status updated to 2.");
                    Console.WriteLine($"Order ID: {updatedOrder.TradingOrderId}, User1: {updatedOrder.User1}, User2: {updatedOrder.User2}, Status: {updatedOrder.Status}");
                    Console.WriteLine($"Background service is running at: {DateTimeOffset.Now}");
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
