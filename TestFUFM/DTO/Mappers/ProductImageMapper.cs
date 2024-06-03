using BusinessObjects.Models;
using BusinessObjects.ProductImageDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObjects.Mappers
{
    public static class ProductImageMapper
    {
        public static ProductImageDTO ToProductImageDto(this ProductImage productImageModel)
        {
            return new ProductImageDTO
            {
                ProductId = productImageModel.ProductId,
                ImageName = productImageModel.ImageName,
                ImageLink = productImageModel.ImageLink,
            };

        }
        public static ProductImage ToProductImageFromCreate(this CreateProductImageDTO productImageDTO, int productId)
        {
            return new ProductImage
            {
                ImageName = productImageDTO.ImageName,
                ImageLink = productImageDTO.ImageLink,
                ProductId = productId
            };

        }

        public static ProductImage ToProductImageFromUpdate(this UpdateProductImageRequestDTO productImageDTO)
        {
            return new ProductImage
            {
                ImageName = productImageDTO.ImageName,
                ImageLink = productImageDTO.ImageLink,
               
            };

        }
    }

}