using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.PromotionTransactionDto
{
    public class PromotionTransactionDTO
    {
        public int PromoTransactionId { get; set; }

        //public DateTime StartDate { get; set; }

        //public DateTime EndDate { get; set; }

        public int PromoOrderId { get; set; }

        public decimal Price { get; set; }

        public string PaymentMethod { get; set; } = null!;

        public string TransactionCode { get; set; } = null!;

        public string TransactionStatus { get; set; } = null!;

        public int Quantity { get; set; }

        public DateTime CreatedDate { get; set; }
    }
}
