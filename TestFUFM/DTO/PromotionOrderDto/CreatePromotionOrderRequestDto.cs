using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.PromotionOrderDto
{
    public class CreatePromotionOrderRequestDto
    {
        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }       
        public decimal Price { get; set; }

        public int ProductQuantity { get; set; }

        public int PromotionId { get; set; }
    }
}
