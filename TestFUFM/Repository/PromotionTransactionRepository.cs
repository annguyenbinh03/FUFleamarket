using BusinessObjects;
using BusinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repository
{
    public class PromotionTransactionRepository : IPromotionTransactionRepository
    {
        private readonly FufleaMarketContext _context;

        public PromotionTransactionRepository(FufleaMarketContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PromotionTransaction>> GetAllAsync()
        {
            return await _context.Set<PromotionTransaction>().ToListAsync();
        }

        public async Task<IEnumerable<PromotionTransaction>> GetAllByPromotionOrderIdAsync(int promoOrderId)
        {
            return await _context.PromotionTransactions
                .Where(pt => pt.PromoOrderId == promoOrderId)
                .ToListAsync();
        }

        public async Task<PromotionTransaction> GetByIdAsync(int id)
        {
            return await _context.PromotionTransactions
                .FirstOrDefaultAsync(pt => pt.PromoTransactionId == id);
        }

        public async Task CreateAsync(PromotionTransaction entity)
        {
            await _context.PromotionTransactions.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(PromotionTransaction entity)
        {
            _context.PromotionTransactions.Update(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(PromotionTransaction entity)
        {
            _context.PromotionTransactions.Remove(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<PromotionTransaction>> GetByPromotionOrdersAsync(IEnumerable<int> promoOrderIds)
        {
            return await _context.Set<PromotionTransaction>()
                                 .Where(pt => promoOrderIds.Contains(pt.PromoOrderId))
                                 .ToListAsync();
        }
    }
}
