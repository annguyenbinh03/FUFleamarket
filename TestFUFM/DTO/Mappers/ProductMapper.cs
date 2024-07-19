using BusinessObjects.Models;
using BusinessObjects.CategoryDto;
using BusinessObjects.ProductDto;
using BusinessObjects.UserDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DTO.Helpers;

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
                DealType = productModel.DealType,
                Description = productModel.Description,
                Seller = productModel.Seller != null ? productModel.Seller.ToProfileUserDTO() : null,
                CategoryId = productModel.CategoryId,
                CategoryName = productModel.Category.Name,
                Status = productModel.Status,
                CreatedDate = productModel.CreatedDate.HasValue ? DateTimeExtensions.ToRelativeTime(productModel.CreatedDate) : "No Date",
                Categories = productModel.Category != null ? new List<CategoryDTO> { productModel.Category.ToCategoryDTO() } : null,
                ProductImages = productModel.ImageLink,
                StoredQuantity = productModel.StoredQuantity

            };
        }


        public static Product ToProductFromCreateDTO(this CreateProductRequestDto productDto, int sellerId)
        {
            return new Product
            {
                ProductName = productDto.ProductName,
                Price = productDto.Price,
                IsNew = productDto.IsNew,
                DealType = productDto.DealType,
                Description = productDto.Description,
                SellerId = sellerId,
                CategoryId = productDto.CategoryId,
                Status = 0,
                CreatedDate = DateTime.Now,
                ImageLink = productDto.ImageLink,
                StoredQuantity = productDto.StoredQuantity
            };
        }


    }
}
