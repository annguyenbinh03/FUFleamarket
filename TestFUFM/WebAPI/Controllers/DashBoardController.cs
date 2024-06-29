using BusinessObjects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;
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
        private readonly IUserRepository _userRepository;
        private readonly FufleaMarketContext _context;

        public DashBoardController(IPromotionTransactionService promotionTransactionService, IProductService productService, IOrderService orderService, FufleaMarketContext context)
        {
            _promotionTransactionService = promotionTransactionService;
            _productService = productService;
            _orderService = orderService;
            _context = context;
        }

        //[HttpGet("monthly-totals")]
        //public async Task<ActionResult> GetMonthlyTotals()
        //{
        //    var monthlyTotals = await _promotionTransactionService.GetMonthlyTotalForCurrentMonthAsync();
        //    return Ok(monthlyTotals);
        //}

        [HttpGet("packagemonthlydata")]
        public async Task<ActionResult> GetPackageMonthlyData()
        {
            var packageMonthlyData = await _promotionTransactionService.GetPackageMonthlyDataAsync();
            return Ok(packageMonthlyData);
        }

        [HttpGet("topsellingproducts")]
        public async Task<ActionResult> GetTopSellingProducts()
        {
            var top5Products = await _productService.GetTop5BestSellingProductsAsync();
            return Ok(top5Products);
        }

        //[HttpGet("count/currentmonth")]
        //public async Task<ActionResult> GetOrderCountForCurrentMonth()
        //{
        //    var orderCount = await _orderService.GetOrderCountForCurrentMonthAsync();
        //    return Ok(orderCount);
        //}

        //[HttpGet("count")]
        //public async Task<IActionResult> GetTotalUserCount()
        //{
        //    var userCount = await _context.Users.CountAsync();
        //    return Ok(userCount);
        //}

        [HttpGet("dashboardsummary")]
        public async Task<ActionResult> GetDashboardSummary()
        {
            var totalRevenue = await _context.PromotionTransactions
                .Where(t => t.TransactionStatus == "Completed")
                .SumAsync(t => t.Price);


            var totalOrderCount = await _context.Orders
                .Where(o => o.Status == 1)
                .CountAsync();


            var totalUserCount = await _context.Users.CountAsync();


            var dashboardSummary = new
            {
                TotalRevenue = totalRevenue,
                TotalOrderCount = totalOrderCount,
                TotalUserCount = totalUserCount
            };

            return Ok(dashboardSummary);
        }

        [HttpGet("totalamountbycategory")]
        public async Task<ActionResult> GetQuantityByCategory()
        {
            var quantityByCategory = await _context.Orders
                .Where(o => o.Status == 1) 
                .Join(_context.Products, o => o.ProductId, p => p.ProductId, (o, p) => new { o.Quantity, p.CategoryId })
                .Join(_context.Categories, op => op.CategoryId, c => c.CategoryId, (op, c) => new { op.Quantity, c.CategoryId, c.Name })
                .GroupBy(x => new { x.CategoryId, x.Name })
                .Select(g => new
                {
                    CategoryName = g.Key.Name,
                    TotalQuantity = g.Sum(x => x.Quantity)
                })
                .ToListAsync();

            return Ok(quantityByCategory);
        }

        [HttpGet("topsellers")]
        public async Task<ActionResult> GetTopSellers()
        {
            var topSellers = await _context.Orders
                .Where(o => o.Status == 1) 
                .GroupBy(o => o.SellerId)
                .Select(g => new
                {
                    SellerId = g.Key,
                    TotalRevenue = g.Sum(o => o.Price),
                    TotalOrders = g.Count() 
                })
                .OrderByDescending(g => g.TotalRevenue)
                .Take(5) 
                .Join(_context.Users, o => o.SellerId, u => u.UserId, (o, u) => new
                {
                    SellerName = u.FullName,
                    TotalRevenue = o.TotalRevenue,
                    TotalOrders = o.TotalOrders
                })
                .ToListAsync();

            return Ok(topSellers);
        }





    }
}