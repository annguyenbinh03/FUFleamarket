using BusinessObjects.Models;
using BusinessObjects.UserDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IPromotionOrderRepository
    {
        Task<List<PromotionOrder>> GetAllAsync();
        Task<List<PromotionOrder>> GetMyPromotionAsync(int userId);
        Task<PromotionOrder?> GetByIdAsync(int id);
        Task<PromotionOrder> CreateAsync(PromotionOrder PromotionOrderModel);
        Task<bool> PromotionExists(int id);
        Task<IEnumerable<PromotionOrder>> GetAllByUserIdAsync(int userId);
        Task<PromotionOrder> UpdateAsync(PromotionOrder PromotionOrderModel);

        Task<PromotionOrder?> GetByUserIdAndPromotionIdAsync(int userId, int promotionId);

        Task<IEnumerable<PromotionOrder>> GetByUserIdAsync(int userId);

        Task<List<PromotionOrder>> UpdatePromotionPackagesAsync();
    }
}
