using BusinessObjects.Models;
using BusinessObjects.PromotionDto;
using BusinessObjects.UserDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IPromotionRepository
    {
        Task<List<Promotion>> GetAllAsync();
        Task<Promotion?> GetByIdAsync(int id);
        Task<Promotion> CreateAsync(Promotion PromotionModel);
        Task<Promotion?> UpdateAsync(int id, UpdatePromotionRequestDto PromotionDto);
        Task<Promotion?> DeleteAsync(int id);

    }
}
