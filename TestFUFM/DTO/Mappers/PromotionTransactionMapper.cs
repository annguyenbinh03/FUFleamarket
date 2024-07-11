using BusinessObjects.Models;
using DTO.PromotionTransactionDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace DTO.Mappers
{
    public static class PromotionTransactionMapper
    {
        public static PromotionTransactionDTO ToPromotionTransactionDTO(this PromotionTransaction model)
        {
            return new PromotionTransactionDTO
            {
                PromoTransactionId = model.PromoTransactionId,
                //StartDate = model.StartDate,
                //EndDate = model.EndDate,
                CreatedDate = model.CreatedDate,
                PromoOrderId = model.PromoOrderId,
                Price = model.Price,
                Quantity = model.Quantity,
                PaymentMethod = model.PaymentMethod,
                TransactionCode = model.TransactionCode,
                TransactionStatus = model.TransactionStatus,
            };
        }
        
        public static PromotionTransaction ToPromotionTransactionFromCreate(this CreatePromotionTransactionRequestDto promotionTransactionDto, int promotionOrderId)
        {
            return new PromotionTransaction
            {
                //StartDate = promotionTransactionDto.StartDate,
                //EndDate = promotionTransactionDto.EndDate,
                CreatedDate = promotionTransactionDto.CreatedDate,
                PromoOrderId = promotionOrderId,
                Price = promotionTransactionDto.Price,
                Quantity = promotionTransactionDto.Quantity,
                PaymentMethod = promotionTransactionDto.PaymentMethod,
                TransactionCode = promotionTransactionDto.TransactionCode,
                TransactionStatus = promotionTransactionDto.TransactionStatus,
            };
        }

        public static PromotionTransaction ToPromotionTransactionFromUpdate(this UpdatePromotionTransactionRequestDto model)
        {
            return new PromotionTransaction
            {
                Price = model.Price,
                PaymentMethod = model.PaymentMethod,
            };
        }
    }

 
}
