using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.PromotionDto
{
    public class UpdatePromotionRequestDto
    {
        public string Name { get; set; } = null!;

        public string Description { get; set; } = null!;

        public int ProductQuantityLimit { get; set; }

        public decimal Price { get; set; }

        public string ImageLink { get; set; } = null!;

        public bool IsDeleted { get;  } = false ;

    }
}
