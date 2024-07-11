using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IPromotionTransactionRepository
    {
        Task<IEnumerable<PromotionTransaction>> GetAllByPromotionOrderIdAsync(int promoOrderId);

        Task<IEnumerable<PromotionTransaction>> GetAllAsync();

        Task<PromotionTransaction> GetByIdAsync(int id);

        Task CreateAsync(PromotionTransaction entity);

        Task UpdateAsync(PromotionTransaction entity);

        Task DeleteAsync(PromotionTransaction entity);

        Task<IEnumerable<PromotionTransaction>> GetByPromotionOrdersAsync(IEnumerable<int> promoOrderIds);

        Task<PromotionTransaction?> GetByPromoOrderIdAsync(int promoOrderId);
    }
}
