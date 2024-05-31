using BusinessObjects.Models;
using DTO;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public  class ProductImageRepository : IProductImageRepository
    {
        private readonly FufleaMarketContext _PIcontext;
        public ProductImageRepository(FufleaMarketContext PIcontext)
        {
            _PIcontext = PIcontext;
        }

        public async Task<ProductImage> CreateAsync(ProductImage productImageModel)
        {
            await _PIcontext.ProductImages.AddAsync(productImageModel);
            await _PIcontext.SaveChangesAsync();
            return productImageModel;
        }

        public async Task<ProductImage?> DeleteAsync(int id)
        {
            var productImageModel = await _PIcontext.ProductImages.FirstOrDefaultAsync(x => x.ProductId == id);
           if(productImageModel == null)
            {
                return null;
            }       

           _PIcontext.ProductImages.Remove(productImageModel);
            await _PIcontext.SaveChangesAsync();
            return productImageModel;
        }
            
        public async Task<List<ProductImage>> GetALLAsync()
        {
            return await _PIcontext.ProductImages.ToListAsync();
        }

        public async Task<ProductImage?> GetByIDAsync(int id)
        {
            return await _PIcontext.ProductImages
                .FirstOrDefaultAsync(pi => pi.ProductId == id);
        }

        public async Task<ProductImage?> UpdateAsync(int id, ProductImage productImageModel)
        {
            var exstingProductImage = await _PIcontext.ProductImages.FindAsync(id);

            if (exstingProductImage == null)
            {
                return null;
            }
            exstingProductImage.ImageName = productImageModel.ImageName;
            exstingProductImage.ImageLink= productImageModel.ImageLink;

           await _PIcontext.SaveChangesAsync();
            return exstingProductImage;
        }
    }
}
