using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DTO.ProductDto
{

    public class CreateProductRequestDto
    {
        //[Required(ErrorMessage = "ProductName is required")]
        //[MinLength(5, ErrorMessage = "ProductName must be at least 5 characters")]
        //[MaxLength(280, ErrorMessage = "ProductName must not exceed 280 characters")]
        //public string ProductName { get; set; }



        //public decimal Price { get; set; }


        //[Required(ErrorMessage = "ProductName is required")]
        //[MinLength(5, ErrorMessage = "ProductName must be at least 5 characters")]
        //[MaxLength(280, ErrorMessage = "ProductName must not exceed 280 characters")]
        //public string Description { get; set; }


        //[Required(ErrorMessage = "SellerId is required.")]
        //public int SellerId { get; set; }

        //public int CategoryId { get; set; }


        // public int Status { get; set; }

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
        public int SellerId { get; set; }
        [Required(ErrorMessage = "CategoryId is required.")]
        public int CategoryId { get; set; }


    }


}