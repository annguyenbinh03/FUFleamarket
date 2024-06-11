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
                CreatedDate = productModel.CreatedDate.HasValue ? productModel.CreatedDate.Value.ToRelativeTime() : null,
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

        public static string ToRelativeTime(this DateTime dateTime)
        {
            var timeSpan = DateTime.Now - dateTime;

            if (timeSpan <= TimeSpan.FromSeconds(60))
                return $"{timeSpan.Seconds} giây trước";
            if (timeSpan <= TimeSpan.FromMinutes(60))
                return $"{timeSpan.Minutes} phút trước";
            if (timeSpan <= TimeSpan.FromHours(24))
                return $"{timeSpan.Hours} giờ trước";
            if (timeSpan <= TimeSpan.FromDays(30))
                return $"{timeSpan.Days} ngày trước";
            if (timeSpan <= TimeSpan.FromDays(365))
                return $"{timeSpan.Days / 30} tháng trước";

            return $"{timeSpan.Days / 365} năm trước";
        }
    }
}
