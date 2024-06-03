using BusinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObjects;

namespace Repository
{
    public class PromotionOrderRepository : IPromotionOrderRepository
    {
        public readonly FufleaMarketContext _dbcontext;

        public PromotionOrderRepository(FufleaMarketContext dbcontext)
        {
            _dbcontext = dbcontext;
        }
        public async Task<PromotionOrder> CreateAsync(PromotionOrder promotionOrderModel)
        {
            await _dbcontext.AddAsync(promotionOrderModel);
            await _dbcontext.SaveChangesAsync();
            return promotionOrderModel;          
        }
       
        public async Task<List<PromotionOrder>> GetAllAsync()
        {
            return await _dbcontext.PromotionOrders.ToListAsync();
        }

        public async Task<PromotionOrder?> GetByIdAsync(int id)
        {
            return await _dbcontext.PromotionOrders.FindAsync(id);
        }

        public async Task<bool> PromotionExists(int id)
        {
            return await _dbcontext.Promotions.AnyAsync(x => x.PromotionId == id);
        }
    }
}
