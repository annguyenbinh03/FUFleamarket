using Microsoft.AspNetCore.Mvc;
using Service.CalculateOrderMonthlyTotal.Interfaces;
using Service.CalculateProductMonthlyTotal;
using Service.CalculateProductMonthlyTotal.Interfaces;
using Service.CalculatePromotioTransactionMonthlyTotal;
using Service.CalculatePromotioTransactionMonthlyTotal.Interfaces;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashBoardController : ControllerBase
    {
        private readonly IPromotionTransactionService _promotionTransactionService;
        private readonly IProductService _productService;
        private readonly IOrderService _orderService;

        public DashBoardController(IPromotionTransactionService promotionTransactionService, IProductService productService, IOrderService orderService)
        {
            _promotionTransactionService = promotionTransactionService;
            _productService = productService;
            _orderService = orderService;
        }

        [HttpGet("monthly-totals")]
        public async Task<ActionResult> GetMonthlyTotals()
        {
            var monthlyTotals = await _promotionTransactionService.GetMonthlyTotalForCurrentMonthAsync();
            return Ok(monthlyTotals);
        }

        [HttpGet("package-monthly-data")]
        public async Task<ActionResult> GetPackageMonthlyData()
        {
            var packageMonthlyData = await _promotionTransactionService.GetPackageMonthlyDataAsync();
            return Ok(packageMonthlyData);
        }

        [HttpGet("top-selling-products")]
        public async Task<ActionResult> GetTopSellingProducts()
        {
            var top5Products = await _productService.GetTop5BestSellingProductsAsync();
            return Ok(top5Products);
        }

        [HttpGet("count/currentmonth")]
        public async Task<ActionResult> GetOrderCountForCurrentMonth()
        {
            var orderCount = await _orderService.GetOrderCountForCurrentMonthAsync();
            return Ok(orderCount);
        }
    }
}
