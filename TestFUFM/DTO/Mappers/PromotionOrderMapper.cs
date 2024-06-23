using BusinessObjects.Models;
using BusinessObjects.AddressDto;
using BusinessObjects.PromotionOrderDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Mappers
{
    public static class PromotionOrderMapper
    {
        public static PromotionOrderDTO ToPromotionOrderDTO(this PromotionOrder model)
        {
            return new PromotionOrderDTO
            {
                PromoOrderId = model.PromoOrderId,
       //         StartDate = model.StartDate.ToString("yyyy-MM-dd"),
                EndDate = model.EndDate.ToString("yyyy-MM-dd"),
                UserId = model.UserId,
            //Price = model.Price,
              //  ProductQuantity = model.ProductQuantity,
                PromotionId = model.PromotionId,
            };
        }
        
        public static PromotionOrder ToPromotionOrderFromCreate(this CreatePromotionOrderRequestDto dto, int userId, DateTime startDate, DateTime endDate, decimal price)
        {
            return new PromotionOrder
            {
                UserId = userId,
                PromotionId = dto.PromotionId,
    //            StartDate = startDate,
                EndDate = endDate,
     //           Price = price, 
               // ProductQuantity = dto.ProductQuantity
            };
        }

    }
}
