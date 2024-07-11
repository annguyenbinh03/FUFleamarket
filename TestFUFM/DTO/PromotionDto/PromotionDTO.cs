using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.PromotionDto
{
    public class PromotionDTO
    {       
        public int PromotionId { get; set; }

        public string Name { get; set; } = null!;

        public string Description { get; set; } = null!;

        public int ProductQuantityLimit { get; set; }

        public decimal Price { get; set; }

        public string ImageLink { get; set; } = null!;

        public bool IsDeleted { get; set; }

    }
}
