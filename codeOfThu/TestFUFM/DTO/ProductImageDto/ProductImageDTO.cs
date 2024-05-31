using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.ProductImageDto
{
    public class ProductImageDTO
    {
        public int ProductId { get; set; }
        public string ImageName { get; set; } = null!;
        public string ImageLink { get; set; } = null!;

    }
}
