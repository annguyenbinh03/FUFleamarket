﻿using BusinessObjects.Models;
using BusinessObjects.CategoryDto;
using BusinessObjects.Mappers;
using BusinessObjects.ProductImageDto;
using BusinessObjects.UserDto;
using System.Collections.Generic;

namespace BusinessObjects.ProductDto
{
    public class ProductDTO
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = null!;
        public decimal Price { get; set; }
        public bool IsNew { get; set; }
        public string Description { get; set; } = null!;
        public ProfileUserDTO Seller { get; set; } // Thay thế SellerId bằng Seller
        public int CategoryId { get; set; }

        public string CategoryName { get; set; } = null!;
        public int Status { get; set; }
        public List<CategoryDTO> Categories { get; set; }
        public ProductImageDTO ProductImages { get; set; }

        public ProductDTO()
        {
            Categories = new List<CategoryDTO>();
            
        }
    }
}