using BusinessObjects.Models;
using BusinessObjects.AddressDto;
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
                Period = model.Period,
               ProductQuantity = model.ProductQuantityLimit,
                Price = model.Price,
                IsDeleted = model.IsDeleted,
            };
        }
        public static Promotion ToPromotionFromCreateDTO(this CreatePromotionRequestDto CreateModel)
        {
            return new Promotion
            {
                Name = CreateModel.Name,
                Description = CreateModel.Description,
                Period = CreateModel.Period,
              //  ProductQuantity = CreateModel.ProductQuantityLimit,
                Price = CreateModel.Price,
            };
        }
    }
}
