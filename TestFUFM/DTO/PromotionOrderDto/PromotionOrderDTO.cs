using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.PromotionOrderDto
{
    public class PromotionOrderDTO
    {      
        public int PromoOrderId { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public int? UserId { get; set; }

        public decimal Price { get; set; }

        public int ProductQuantity { get; set; }

        public int PromotionId { get; set; }

    }
}
