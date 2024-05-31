using BusinessObjects.Models;
using DTO.AddressDto;
using DTO.PromotionOrderDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Mappers
{
    public static class PromotionOrderMapper
    {
        public static PromotionOrderDTO ToPromotionOrderDTO(this PromotionOrder model)
        {
            return new PromotionOrderDTO
            {
                PromoOrderId = model.PromoOrderId,
                StartDate = model.StartDate,
                EndDate = model.EndDate,
                UserId = model.UserId,
                Price = model.Price,
                ProductQuantity = model.ProductQuantity,
                PromotionId = model.PromotionId,
            };
        }
        public static PromotionOrder ToPromotionOrderFromCreate(this CreatePromotionOrderRequestDto PromotionOrderDto, int UserId)
        {
            return new PromotionOrder
            {   
                StartDate = PromotionOrderDto.StartDate,
                EndDate = PromotionOrderDto.EndDate,
                Price = PromotionOrderDto.Price,
                ProductQuantity = PromotionOrderDto.ProductQuantity,
                PromotionId = PromotionOrderDto.PromotionId,
                UserId = UserId,
            };
        }
        
    }
}
