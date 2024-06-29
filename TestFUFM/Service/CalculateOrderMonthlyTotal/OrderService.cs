using BusinessObjects;
using Microsoft.EntityFrameworkCore;
using Service.CalculateOrderMonthlyTotal.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.CalculateOrderMonthlyTotal
{
    public class OrderService : IOrderService
    {
        private readonly FufleaMarketContext _context;

        public OrderService(FufleaMarketContext context)
        {
            _context = context;
        }

        public async Task<int> GetOrderCountForCurrentMonthAsync()
        {
            var currentMonth = DateTime.Now.Month;
            var currentYear = DateTime.Now.Year;

            var orderCount = await _context.Orders
                .Where(o => o.OrderDate.Month == currentMonth && o.OrderDate.Year == currentYear)
                .CountAsync();

            return orderCount;
        }
    }
}
