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

        public int RemainedDate { get; set; }

        public int UserId { get; set; }

        public string? FullName { get; set; }

        public string? Avarta { get; set; }

        public DateTime CreatedDate { get; set; }

        public string Email { get; set; } = null!;

        public int PromotionId { get; set; }

        public string Status { get; set; } = null!;

        public string PromotionName { get; set; } = null!;

        public string PromotionDescription { get; set; } = null!;

        //public int PromotionPeriod { get; set; }

        public string ImageLink { get; set; } = null!;

        public int PromotionProductQuantityLimit { get; set; }

        public decimal PromotionPrice { get; set; }

    }
}
