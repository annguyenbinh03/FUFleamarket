using BusinessObjects;
using BusinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class TradingOrderDetailRepository : ITradingOrderDetailRepository
    {
        private readonly FufleaMarketContext _context;
        
        public TradingOrderDetailRepository(FufleaMarketContext context)
        {
            _context = context;
        }
        public async Task<TradingOrderDetail> CreateAsync(TradingOrderDetail tradingOrderDetail)
        {
            await _context.AddAsync(tradingOrderDetail);
            await _context.SaveChangesAsync();
            return tradingOrderDetail;
        }

        public async Task<List<TradingOrderDetail>> GetAllAsync()
        {
            return await _context.TradingOrderDetails.ToListAsync();
        }

        public async Task<TradingOrderDetail?> GetByIdAsync(int id)
        {
            return await _context.TradingOrderDetails.FindAsync(id);
        }

        public async Task<TradingOrderDetail> UpdateAsync(TradingOrderDetail tradingOrderDetail)
        {
            var existingTradingOrderDetail = await _context.TradingOrderDetails.FindAsync(tradingOrderDetail.TradingOrderDetailId);
            if (existingTradingOrderDetail != null)
            {
                existingTradingOrderDetail.Quantity = tradingOrderDetail.Quantity;

                await _context.SaveChangesAsync();
            }

            return existingTradingOrderDetail;
        }

        public async Task<IEnumerable<TradingOrderDetail>> GetByUserIdAsync(int userId)
        {
            return await _context.TradingOrderDetails
                                 .Where(detail => detail.OwnerId == userId)
                                 .ToListAsync();
        }

    }
}
