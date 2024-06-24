using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.PromotionTransactionDto
{
    public class UpdatePromotionTransactionRequestDto
    {


        public decimal Price { get; set; }

        public string PaymentMethod { get; set; } = null!;


    }
}
