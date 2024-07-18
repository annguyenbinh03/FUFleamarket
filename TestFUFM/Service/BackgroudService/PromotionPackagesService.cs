using Microsoft.Extensions.DependencyInjection; // Thư viện cung cấp khả năng tiêm phụ thuộc (Dependency Injection)
using Microsoft.Extensions.Hosting; // Thư viện hỗ trợ việc tạo các dịch vụ nền (background services)
using Repository.Interfaces; // Thư viện chứa các giao diện của repository
using System; // Thư viện cơ bản của .NET
using System.Threading; // Thư viện hỗ trợ làm việc với đa luồng
using System.Threading.Tasks; // Thư viện hỗ trợ làm việc với các tác vụ bất đồng bộ (async tasks)

namespace Service.BackgroudService
{
    public class PromotionPackagesService : BackgroundService
    {
        // Biến lưu trữ dịch vụ tạo phạm vi (scope)
        private readonly IServiceScopeFactory _serviceScopeFactory;

        // Constructor nhận vào một IServiceScopeFactory để khởi tạo
        public PromotionPackagesService(IServiceScopeFactory serviceScopeFactory)
        {
            _serviceScopeFactory = serviceScopeFactory;
        }

        // Phương thức chính của dịch vụ nền, chạy khi dịch vụ được khởi động
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // Vòng lặp chính, chạy cho đến khi dịch vụ bị hủy
            while (!stoppingToken.IsCancellationRequested)
            {
                // Lấy thời gian hiện tại
                var now = DateTimeOffset.Now;

                // Thiết lập thời gian mục tiêu ban đầu 
                var nextTargetTime = new DateTimeOffset(now.Year, now.Month, now.Day, 0, 5, 0 , now.Offset);

                // Nếu thời gian hiện tại đã qua thời gian mục tiêu, chuyển sang thời gian mục tiêu của ngày tiếp theo
                if (now > nextTargetTime)
                {
                    nextTargetTime = nextTargetTime.AddDays(1);
                }

                // Tính toán khoảng thời gian chờ cho đến thời gian mục tiêu tiếp theo
                var delay = nextTargetTime - now;

                // Chờ đến thời gian mục tiêu
                await Task.Delay(delay, stoppingToken);

                // Gọi phương thức LogAsync để thực hiện công việc
                await LogAsync();

                // In ra thời gian hiện tại để ghi nhận hoạt động của dịch vụ
                Console.WriteLine($"Background service is running at: {DateTimeOffset.Now}");

                // Thiết lập thời gian mục tiêu tiếp theo là 10 giây sau thời gian hiện tại
                nextTargetTime = nextTargetTime.AddSeconds(30);

                //// Vòng lặp phụ, chạy liên tục mỗi 10 giây cho đến khi dịch vụ bị hủy
                while (!stoppingToken.IsCancellationRequested)
                {
                    now = DateTimeOffset.Now;
                    delay = nextTargetTime - now;

                    // chờ đến thời gian mục tiêu tiếp theo
                    await Task.Delay(delay, stoppingToken);

                    // gọi phương thức logasync để thực hiện công việc
                    await LogAsync();

                    // in ra thời gian hiện tại để ghi nhận hoạt động của dịch vụ
                    Console.WriteLine($"background service is running at: {DateTimeOffset.Now}");

                    // thiết lập thời gian mục tiêu tiếp theo là 3h sau thời gian hiện tại
                    nextTargetTime = nextTargetTime.AddSeconds(30);
                }
            }
        }

        // Phương thức LogAsync thực hiện công việc cần thiết
        public async Task LogAsync()
        {
            // Tạo một phạm vi dịch vụ mới
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                // Lấy IPromotionOrderRepository từ dịch vụ cung cấp (service provider) của phạm vi dịch vụ
                var promotionOrderRepo = scope.ServiceProvider.GetRequiredService<IPromotionOrderRepository>();

                // Gọi phương thức UpdatePromotionPackagesAsync từ repository để cập nhật các gói khuyến mãi
                var updatedPackages = await promotionOrderRepo.UpdatePromotionPackagesAsync();

                // In ra thông tin của các gói khuyến mãi được cập nhật
                foreach (var package in updatedPackages)
                {
                    Console.WriteLine($"Promotion ID: {package.PromoOrderId}, User ID: {package.UserId}, RemainDate: {package.RemainedDate}, Status: {package.Status}");
                }
            }
        }

    }
}
