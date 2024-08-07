﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.PromotionTransactionDto
{
    public class DetailedPromotionTransactionDTO
    {
        public int PromoTransactionId { get; set; }

        public int UserId { get; set; }

        public string? FullName { get; set; }

        public string? Avarta { get; set; }

        public DateTime CreatedDate { get; set; }

        public string Email { get; set; } = null!;

        //public DateTime StartDate { get; set; }

        //public DateTime EndDate { get; set; }

        public int PromoOrderId { get; set; }

        public int RemainedDate { get; set; }

        public decimal Price { get; set; }

        public string PaymentMethod { get; set; } = null!;

        public string TransactionCode { get; set; } = null!;

        public string TransactionStatus { get; set; } = null!;

        public int Quantity { get; set; }

        public DateTime TransactionCreatedDate { get; set; }

        public int PromotionId { get; set; }

        public string PromotionName { get; set; } = null!;

        public string PromotionDescription { get; set; } = null!;

        public int PromotionProductQuantityLimit { get; set; }

        public decimal PromotionPrice { get; set; }

        public string ImageLink { get; set; } = null!;

        public string PromotionOrderStatus { get; set; } = null!;

        
    }
}