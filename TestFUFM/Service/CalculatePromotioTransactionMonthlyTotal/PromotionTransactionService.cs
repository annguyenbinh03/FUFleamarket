using BusinessObjects;
using Microsoft.EntityFrameworkCore;
using Service.CalculatePromotioTransactionMonthlyTotal.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.CalculatePromotioTransactionMonthlyTotal
{
    public class PromotionTransactionService : IPromotionTransactionService
    {
        private readonly FufleaMarketContext _context;

        public PromotionTransactionService(FufleaMarketContext context)
        {
            _context = context;
        }

        public async Task<MonthlyTotal> GetMonthlyTotalForCurrentMonthAsync()
        {
            int year = DateTime.Now.Year;
            int month = DateTime.Now.Month;

            var monthlyTotal = await _context.PromotionTransactions
                .Where(t => t.TransactionStatus == "Completed"
                            && t.CreatedDate.Year == year
                            && t.CreatedDate.Month == month)
                .GroupBy(t => new { t.CreatedDate.Year, t.CreatedDate.Month })
                .Select(g => new MonthlyTotal
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    TotalPrice = g.Sum(t => t.Price)
                })
                .FirstOrDefaultAsync(); 
            return monthlyTotal ?? new MonthlyTotal { Year = year, Month = month, TotalPrice = 0 };
        }

        public async Task<List<PackageMonthlyData>> GetPackageMonthlyDataAsync()
        {
            var packageMonthlyData = await _context.PromotionTransactions
                .Include(t => t.PromoOrder)
                .Where(t => t.TransactionStatus == "Completed")
                .GroupBy(t => new { t.PromoOrder.PromotionId, t.CreatedDate.Year, t.CreatedDate.Month })
                .Select(g => new PackageMonthlyData
                {
                    PromotionId = g.Key.PromotionId,
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    TotalQuantity = g.Count(),
                    TotalPrice = g.Sum(t => t.Price)
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ThenBy(x => x.PromotionId)
                .ToListAsync();

            return packageMonthlyData;
        }
    }
}

