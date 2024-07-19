using BusinessObjects.Models;
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
                RemainedDate = model.RemainedDate,
                UserId = model.UserId,
            //Price = model.Price,
              //  ProductQuantity = model.ProductQuantity,
                PromotionId = model.PromotionId,
                Status = model.Status,
            };
        }
        
        public static PromotionOrder ToPromotionOrderFromCreate(this CreatePromotionOrderRequestDto dto, int userId, int RemainedDate)
        {
            return new PromotionOrder
            {
                UserId = userId,
                PromotionId = dto.PromotionId,
                //            StartDate = startDate,
                RemainedDate = RemainedDate,
     //           Price = price, 
               // ProductQuantity = dto.ProductQuantity
               Status = dto.Status,

            };
        }

    }
}
