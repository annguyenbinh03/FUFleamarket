using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.PromotionOrderDto
{
    public class CreatePromotionOrderRequestDto
    {
        public int PromotionId { get; set; }
        //public int ProductQuantity { get; set; }

        public string Status { get; set; } = null!;
    }
}
