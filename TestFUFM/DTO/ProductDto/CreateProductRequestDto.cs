using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.ProductDto
{

    public class CreateProductRequestDto
    {

        [Required(ErrorMessage = "ProductName is required")]
        [MinLength(5, ErrorMessage = "ProductName must be at least 5 characters")]
        [MaxLength(280, ErrorMessage = "ProductName must not exceed 280 characters")]
        public string ProductName { get; set; }
        [Required]

        public decimal Price { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [MinLength(5, ErrorMessage = "Description must be at least 5 characters")]
        [MaxLength(2000, ErrorMessage = "Description must not exceed 2000 characters")]
        public string Description { get; set; }


        [Required(ErrorMessage = "CategoryId is required.")]
        public int CategoryId { get; set; }

        [Required(ErrorMessage = "Conditon is required.")]
        public bool IsNew { get; set; }

    }


}