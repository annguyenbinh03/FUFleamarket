using BusinessObjects.Models;
using BusinessObjects;
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

        public async Task<Product> DeleteAsync(int productId, string imageName)
        {
            var productImageModel = await _PIcontext.ProductImages
                .FirstOrDefaultAsync(pi => pi.ProductId == productId && pi.ImageName == imageName);

            if (productImageModel == null)
                return null;

            _PIcontext.ProductImages.Remove(productImageModel);
            await _PIcontext.SaveChangesAsync();

            var product = await _PIcontext.Products
                .Include(p => p.ProductImages)
                .FirstOrDefaultAsync(p => p.ProductId == productId);

            return product;
        }

        public async Task<List<ProductImage>> GetAllByProductIdAsync(int productId)
        {
            return await _PIcontext.ProductImages.Where(pi => pi.ProductId == productId).ToListAsync();
        }


        public async Task<ProductImage> GetByIdAsync(int productId)
        {
            return await _PIcontext.ProductImages
                .FirstOrDefaultAsync(pi => pi.ProductId == productId);
        }


        public async Task<bool> ExistsByNameOrLink(int productId, string imageName, string imageLink)
        {
            return await _PIcontext.ProductImages.AnyAsync(pi => pi.ProductId == productId && (pi.ImageName == imageName || pi.ImageLink == imageLink));
        }



        public async Task<Product> UpdateAsync(int productId, string imageName, ProductImage productImageModel)
        {
            var existingProductImage = await _PIcontext.ProductImages
                .FirstOrDefaultAsync(pi => pi.ProductId == productId && pi.ImageName == imageName);

            if (existingProductImage == null)
                return null;

            _PIcontext.ProductImages.Remove(existingProductImage);
            await _PIcontext.SaveChangesAsync();

            var newProductImage = new ProductImage
            {
                ProductId = productId,
                ImageName = productImageModel.ImageName,
                ImageLink = productImageModel.ImageLink
            };

            await _PIcontext.ProductImages.AddAsync(newProductImage);
            await _PIcontext.SaveChangesAsync();

            var product = await _PIcontext.Products
                .Include(p => p.ProductImages)
                .FirstOrDefaultAsync(p => p.ProductId == productId);

            return product;
        }
        public async Task<bool> ProductExist(int productId)
        {
            return await _PIcontext.Products.AnyAsync(p => p.ProductId == productId);
        }
        public async Task<Product> GetProductByIdAsync(int productId)
        {
            return await _PIcontext.Products.FirstOrDefaultAsync(p => p.ProductId == productId);
        }

        public async Task<List<ProductImage>> GetALLAsync()
        {
            return await _PIcontext.ProductImages.ToListAsync();
        }
    }
}
