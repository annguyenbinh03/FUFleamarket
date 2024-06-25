using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.PromotionOrderDto
{
    public class DetailedPromotionOrderDTO
    {
        public int PromoOrderId { get; set; }

        public string EndDate { get; set; }

        public int UserId { get; set; }

        public int PromotionId { get; set; }

        public string Status { get; set; } = null!;

        public string PromotionName { get; set; } = null!;

        public string PromotionDescription { get; set; } = null!;

        public int PromotionPeriod { get; set; }

        public int PromotionProductQuantityLimit { get; set; }

        public decimal PromotionPrice { get; set; }

    }
}
