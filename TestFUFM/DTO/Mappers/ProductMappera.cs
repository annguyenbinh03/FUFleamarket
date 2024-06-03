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
    //public static class ProductMapper
    //{
    //    public static ProductDTO ToProductDto(this Product productModel)
    //    {
    //        return new ProductDTO
    //        {
    //            ProductId = productModel.ProductId,
    //            ProductName = productModel.ProductName,
    //            Price = productModel.Price,
    //            IsNew = productModel.IsNew,
    //            Description = productModel.Description,
    //            SellerId = productModel.SellerId,
    //            CategoryId = productModel.CategoryId,
    //            Status = productModel.Status,
    //            Categories = new List<CategoryDTO> { productModel.Category.ToCategoryDTO() },
    //            ProductImages = productModel.ProductImages.Select(p => p.ToProductImageDto()).ToList()
    //        };
    //    }


    //    public static Product ToProductFromCreateDTO(this CreateProductRequestDto productDto)
    //    {
    //        return new Product
    //        {
    //            ProductName = productDto.ProductName,
    //            Price = productDto.Price,
    //            IsNew = true,
    //            Description = productDto.Description,
    //            SellerId = productDto.SellerId,
    //            CategoryId = productDto.CategoryId,
    //            Status = 0//productDto.Status,
    //        };
    //    }
    //}

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
                SellerId = productModel.SellerId != null ? productModel.Users.Select(s => s.ToProfileUserDTO()).ToList() : null,
                CategoryId = productModel.CategoryId,
                Status = productModel.Status,
                Categories = productModel.Category != null ? new List<CategoryDTO> { productModel.Category.ToCategoryDTO() } : null,
                ProductImages = productModel.ProductImages?.Select(p => p.ToProductImageDto()).ToList()
            };
        }

        public static Product ToProductFromCreateDTO(this CreateProductRequestDto productDto)
        {
            return new Product
            {
                ProductName = productDto.ProductName,
                Price = productDto.Price,
                IsNew = true,
                Description = productDto.Description,
                SellerId = productDto.SellerId,
                CategoryId = productDto.CategoryId,
                Status = 0
            };
        }
    }
}
