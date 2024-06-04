using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.ProductDto
{
    public class UpdateProductRequestDto
    {
        [Required(ErrorMessage = "ProductName is required")]
        [MinLength(5, ErrorMessage = "ProductName must be at least 5 characters")]
        [MaxLength(280, ErrorMessage = "ProductName must not exceed 280 characters")]
        public string ProductName { get; set; }

        public decimal Price { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [MinLength(5, ErrorMessage = "Description must be at least 5 characters")]
        [MaxLength(280, ErrorMessage = "Description must not exceed 280 characters")]
        public string Description { get; set; }

        [Required(ErrorMessage = "SellerId is required.")]

        public int CategoryId { get; set; }

    }
}
