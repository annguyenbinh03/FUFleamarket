using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.PromotionDto
{
    public class UpdatePromotionRequestDto
    {
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int Period { get; set; }
        public int ProductQuantity { get; set; }
        public decimal Price { get; set; }
    }
}
