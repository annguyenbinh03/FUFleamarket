﻿using BusinessObjects.Models;
using BusinessObjects;
using BusinessObjects.Helpers;
using BusinessObjects.ProductDto;
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
            var productModel = await _context.Products
                                             .Include(p => p.Seller)
                                             .Include(p => p.Category)
                                             .Include(p => p.ProductImages) // Bao gồm các hình ảnh sản phẩm
                                             .FirstOrDefaultAsync(x => x.ProductId == id);
            if (productModel == null)
            {
                return null;
            }

            // Cập nhật trạng thái sản phẩm trước khi xóa
            productModel.IsNew = false;
            productModel.Status = 2;

            await _context.SaveChangesAsync(); // Lưu thay đổi trạng thái vào cơ sở dữ liệu
            return productModel;
        }





        public async Task<List<Product>> GetALLAsync(QueryObject query)
        {
            var products = _context.Products
                .Include(p => p.ProductImages)
                .Include(p => p.Category)
                .Include(p => p.Seller) // Include Seller
                .AsQueryable();

            if (query.CategoryId.HasValue)
            {
                products = products.Where(s => s.CategoryId == query.CategoryId);
            }
            // thêm chức năng search name
            if (!string.IsNullOrWhiteSpace(query.ProductName))
            {
                products = products.Where(s => s.ProductName.Contains(query.ProductName));
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
                .Include(p => p.Seller) // Include Seller
                .FirstOrDefaultAsync(p => p.ProductId == id);
        }

        public Task<bool> ProductExist(int id)
        {
            return _context.Products.AnyAsync(s => s.ProductId == id);
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
            existingProduct.CategoryId = productDto.CategoryId;
            //existingProduct.Status = productDto.Status;

            await _context.SaveChangesAsync();
            return existingProduct;
        }

        public async Task<Product?> UpdateAsync(int sellerId, int productId, UpdateProductRequestDto productDto)
        {
            var existingProduct = await _context.Products.FirstOrDefaultAsync(x => x.SellerId == sellerId && x.ProductId == productId);
            if (existingProduct == null)
            {
                return null;
            }

            existingProduct.ProductName = productDto.ProductName;
            existingProduct.Price = productDto.Price;
            existingProduct.Description = productDto.Description;
            existingProduct.CategoryId = productDto.CategoryId;

            await _context.SaveChangesAsync();
            return existingProduct;
        }



        public async Task<Product> GetProductById(int productId)
        {
            return await _context.Products.FindAsync(productId);
        }



        // Trong repository
        public async Task<List<Product>> GetProductsByStatusAsync(int status)
        {
            return await _context.Products
                .Include(p => p.Seller) // Bao gồm thông tin người bán
                .Include(p => p.Category)
                .Include(p => p.ProductImages) // Bao gồm thông tin hình ảnh sản phẩm
                .Where(p => p.Status == status)
                .ToListAsync();
        }

        public async Task<Product?> GetProductByIdAsync(int productId)  // Updated method implementation
        {
            return await _context.Products
               .Include(p => p.ProductImages)
               .Include(p => p.Category)
               .Include(p => p.Seller)
               .FirstOrDefaultAsync(p => p.ProductId == productId);
        }

        public async Task<List<Product>> GetProductsByUserIdAsync(int userId)
        {
            return await _context.Products
                .Where(p => p.SellerId == userId)
                .ToListAsync();
        }

    }
}
