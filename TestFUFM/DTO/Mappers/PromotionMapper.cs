using BusinessObjects.Models;
using BusinessObjects.PromotionDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Mappers
{
    public static class PromotionMapper
    {
        public static PromotionDTO ToPromotionDTO(this Promotion model)
        {
            return new PromotionDTO
            {
                PromotionId = model.PromotionId,
                Name = model.Name,
                Description = model.Description,
                //Period = model.Period,
                ProductQuantityLimit = model.ProductQuantityLimit,
                Price = model.Price,
                ImageLink = model.ImageLink,
                IsDeleted = model.IsDeleted,
            };
        }
        public static Promotion ToPromotionFromCreateDTO(this CreatePromotionRequestDto CreateModel)
        {
            return new Promotion
            {
                Name = CreateModel.Name,
                Description = CreateModel.Description,
                //Period = CreateModel.Period,
                ProductQuantityLimit = CreateModel.ProductQuantityLimit,
                Price = CreateModel.Price,
                ImageLink = CreateModel.ImageLink,
            };
        }
    }
}
