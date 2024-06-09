using BusinessObjects.Models;
using BusinessObjects.CategoryDto;
using BusinessObjects.ProductDto;
using BusinessObjects.UserDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Mappers
{
    public static class ProductMapper
    {
        public static ProductDTO ToProductDto(this Product productModel)
        {
            return new ProductDTO
            {
                ProductId = productModel.ProductId,
                ProductName = productModel.ProductName,
                Price = productModel.Price,
                IsNew = productModel.IsNew,
                Description = productModel.Description,
                Seller = productModel.Seller != null ? productModel.Seller.ToProfileUserDTO() : null,
                CategoryId = productModel.CategoryId,
                CategoryName = productModel.Category.Name,
                Status = productModel.Status,
                Categories = productModel.Category != null ? new List<CategoryDTO> { productModel.Category.ToCategoryDTO() } : null,
                ProductImages = productModel.ProductImages?.FirstOrDefault()?.ToProductImageDto()
            };
        }


        public static Product ToProductFromCreateDTO(this CreateProductRequestDto productDto, int sellerId)
        {
            return new Product
            {
                ProductName = productDto.ProductName,
                Price = productDto.Price,
                IsNew = true,
                Description = productDto.Description,
                SellerId = sellerId,
                CategoryId = productDto.CategoryId,
                Status = 0
            };
        }
    }
}
