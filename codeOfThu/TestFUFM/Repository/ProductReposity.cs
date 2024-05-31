using BusinessObjects.Models;
using DTO;
using DTO.Helpers;
using DTO.ProductDto;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository
{
    public class ProductReposity : IProductReposity
    {
        private readonly FufleaMarketContext _context;
        public ProductReposity(FufleaMarketContext context)
        {
            _context = context; 
        }

        public async Task<Product> CreateAsync(Product productModel)
        {
           await _context.Products.AddAsync(productModel);
           await _context.SaveChangesAsync();
           return productModel;
        }

        public async Task<Product?> DeleteAsync(int id)
        {
            var productModel = await _context.Products.FirstOrDefaultAsync(x => x.ProductId == id);
            if (productModel == null)
            {
                return null;
            }

            _context.Products.Remove(productModel);
            await _context.SaveChangesAsync();
            return productModel;

        }

        public async Task<List<Product>> GetALLAsync()
        {
            
                return await _context.Products
                    .Include(p => p.ProductImages)
                    .Include(p => p.Category)
                    .ToListAsync();
        }
        public async Task<List<Product>> GetALLAsync(QueryObject query)
        {
            var products = _context.Products
                .Include(p => p.ProductImages)
                .Include(p => p.Category)
                .AsQueryable();

            if (query.CategoryId.HasValue)
            {
                products = products.Where(s => s.CategoryId == query.CategoryId);
            }

            if (query.Price.HasValue)
            {
                products = products.Where(s => s.Price == query.Price);
            }

            if (!string.IsNullOrWhiteSpace(query.SortBy) && query.SortBy.Equals("price", StringComparison.OrdinalIgnoreCase))
            {
                if (query.IsDecsending)
                {
                    products = products.OrderByDescending(s => s.Price);
                }
                else
                {
                    products = products.OrderBy(s => s.Price);
                }
            }

            return await products.ToListAsync();
        }

        public async Task<Product?> GetByIdProductAsync(int id)
        {
            return await _context.Products
                .Include(p => p.ProductImages)
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.ProductId == id);
        }

        public  Task<bool> ProductExist(int id)
        {
            return  _context.Products.AnyAsync(s => s.ProductId == id);
        }

        public async Task<Product?> UpdateAsync(int id, UpdateProductRequestDto productDto)
        {
            var existingProduct = await _context.Products.FirstOrDefaultAsync(x => x.ProductId == id);
            if (existingProduct == null)
            {
                return null;
            }

            existingProduct.ProductName = productDto.ProductName;
            existingProduct.Price = productDto.Price;
            existingProduct.Description = productDto.Description;
            existingProduct.SellerId = productDto.SellerId;
            existingProduct.CategoryId = productDto.CategoryId;
            //existingProduct.Status = productDto.Status;

            await _context.SaveChangesAsync();
            return existingProduct;
        }
    }
}
