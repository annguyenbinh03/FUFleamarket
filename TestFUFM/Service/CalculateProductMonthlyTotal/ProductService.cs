using BusinessObjects;
using DTO.ProductDto;
using Microsoft.EntityFrameworkCore;
using Service.CalculateProductMonthlyTotal.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.CalculateProductMonthlyTotal
{
    public class ProductService : IProductService
    {
        private readonly FufleaMarketContext _context;

        public ProductService(FufleaMarketContext context)
        {
            _context = context;
        }

        public async Task<List<TopSellingProductDTO>> GetTop5BestSellingProductsAsync()
        {
            var top5Products = await _context.Orders
                .Where(o => o.Status == 1) 
                .GroupBy(o => o.ProductId)
                .Select(g => new
                {
                    ProductId = g.Key,
                    TotalQuantitySold = g.Sum(o => o.Quantity)
                })
                .OrderByDescending(g => g.TotalQuantitySold)
                .Take(5)
                .Join(_context.Products, o => o.ProductId, p => p.ProductId, (o, p) => new TopSellingProductDTO
                {
                    ProductId = p.ProductId,
                    ProductName = p.ProductName,
                    Quantity = o.TotalQuantitySold
                })
                .ToListAsync();

            return top5Products;
        }
    }
}
