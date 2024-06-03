using BusinessObjects.Models;
using BusinessObjects.PromotionDto;
using Microsoft.AspNetCore.Http.HttpResults;
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
    public class PromotionRepository : IPromotionRepository
    {
        private readonly FufleaMarketContext _dbcontext;
        public PromotionRepository(FufleaMarketContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public async Task<Promotion> CreateAsync(Promotion promotionModel)
        {
            await _dbcontext.AddAsync(promotionModel);
            await _dbcontext.SaveChangesAsync();
            return promotionModel;
        }

        public async Task<Promotion?> DeleteAsync(int id)
        {
            var promotionModel = await _dbcontext.Promotions.FirstOrDefaultAsync(x => x.PromotionId == id);
            if (promotionModel == null)
            {
                return null;
            }
            _dbcontext.Promotions.Remove(promotionModel);
            await _dbcontext.SaveChangesAsync();
            return promotionModel;
        }

        public async Task<List<Promotion>> GetAllAsync()
        {
            return await _dbcontext.Promotions.ToListAsync();
        }

        public async Task<Promotion?> GetByIdAsync(int id)
        {
            return await _dbcontext.Promotions.FindAsync(id);
        }

        public async Task<Promotion?> UpdateAsync(int id, UpdatePromotionRequestDto promotionDto)
        {
            var existingPromotion = _dbcontext.Promotions.FirstOrDefault(x => x.PromotionId == id);
            if (existingPromotion == null)
            {
                return null;
            }
            existingPromotion.Name = promotionDto.Name;
            existingPromotion.Description = promotionDto.Description;
            existingPromotion.Period = promotionDto.Period;
            existingPromotion.ProductQuantity = promotionDto.ProductQuantity;
            existingPromotion.Price = promotionDto.Price;

            await _dbcontext.SaveChangesAsync();
            return existingPromotion;
        }
    }
}
