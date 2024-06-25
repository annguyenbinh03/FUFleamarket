using System;
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

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int PromoOrderId { get; set; }

        public decimal Price { get; set; }

        public string PaymentMethod { get; set; } = null!;

        public string TransactionCode { get; set; } = null!;

        public string TransactionStatus { get; set; } = null!;

        public string PromotionName { get; set; } = null!;

        public string PromotionDescription { get; set; } = null!;

        public int PromotionPeriod { get; set; }

        public int PromotionProductQuantityLimit { get; set; }

        public decimal PromotionPrice { get; set; }

        public string PromotionOrderStatus { get; set; } = null!;

    }
}