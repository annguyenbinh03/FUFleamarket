using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.PromotionTransactionDto
{
    public class CreatePromotionTransactionRequestDto
    {
       

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int PromoOrderId { get; set; }

        public decimal Price { get; set; }

        public string PaymentMethod { get; set; } = null!;

        public string TransactionCode { get; set; } = null!;

        public string TransactionStatus { get; set; } = null!;
        
    }
}

