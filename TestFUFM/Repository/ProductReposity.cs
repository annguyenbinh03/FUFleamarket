using BusinessObjects.Models;
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
using System.Diagnostics.CodeAnalysis;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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
            productModel.CreatedDate = DateTime.Now.AddHours(7);
            await _context.Products.AddAsync(productModel);
            await _context.SaveChangesAsync();
            return productModel;
        }


        public async Task<Product?> DeleteAdminAsync(int id)
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
            productModel.Status = 4;
            productModel.CreatedDate = DateTime.Now.AddHours(7);

            await _context.SaveChangesAsync(); // Lưu thay đổi trạng thái vào cơ sở dữ liệu
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
            productModel.Status = 3;
            productModel.CreatedDate = DateTime.Now.AddHours(7);

            await _context.SaveChangesAsync(); // Lưu thay đổi trạng thái vào cơ sở dữ liệu
            return productModel;
        }

        public async Task<bool> AcceptProductRequest(int productId)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                return false;
            }
            product.Status = 1;
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> RejectProductRequest(int productId)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                return false;
            }
            product.Status = 2;
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> DeleteProduct(int productId)
        {
            var product = await _context.Products.FindAsync(productId);
            if (product == null)
            {
                return false;
            }
            product.Status = 4;
            product.IsNew = false;
            product.CreatedDate = DateTime.Now.AddHours(7);
            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<List<Product>> AdminGetAllAsync(QueryObject query)
        {
            var products = _context.Products
                .Include(p => p.ProductImages)
                .Include(p => p.Category)
                .Include(p => p.Seller)
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
            if (query.DealType.HasValue)
            {
                products = products.Where(s => s.DealType == query.DealType.Value);
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

            products = products.OrderByDescending(s => s.CreatedDate);
            return await products.ToListAsync();
        }



        /// <summary>
        /// không cần tìm trạng thái 3 nưã 
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        public async Task<List<Product>> GetALLAsync(QueryObject query)
        {
            var products = _context.Products
                .Include(p => p.ProductImages)
                .Include(p => p.Category)
                .Where(p => p.Status == 1)
                .Where(p => p.StoredQuantity > 0)
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
            if (query.DealType.HasValue)
            {
                products = products.Where(s => s.DealType == query.DealType.Value);
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
            products = products.OrderByDescending(s => s.CreatedDate);
            return await products.ToListAsync();
        }




        public async Task<List<Product>> GetProductsByDealTypeAsync(bool dealType)
        {
            var products = _context.Products
                .Include(p => p.ProductImages)
                .Include(p => p.Category)
                .Include(p => p.Seller)
                .Where(p => p.DealType == dealType && (p.Status == 1))
                .OrderByDescending(p => p.CreatedDate).ToListAsync();

            return await products;
        }


        public async Task<Product?> GetByIdProductAsync(int id)
        {
            return await _context.Products
                .Include(p => p.ProductImages)
                .Include(p => p.Category)
                .Include(p => p.Seller) // Include Seller
                .OrderByDescending(p => p.CreatedDate)
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
            existingProduct.CreatedDate = DateTime.Now.AddHours(7);
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
            existingProduct.CreatedDate = DateTime.Now.AddHours(7);

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

        public async Task<string?> getSellerAddress(int sellerId)
        {
            User user = await _context.Users.Include(x => x.Addresses).FirstOrDefaultAsync(x => x.UserId == sellerId);
            Address address = user?.Addresses.FirstOrDefault();
            if (address != null)
            {
                return address.SpecificAddress;
            }
            else
            {
                return "";
            }

        }

        public async Task<List<Product>?> GetProductByUserIdAsync(int userId)
        {
            return await _context.Products.Where(x => x.SellerId == userId)
                .Include(p => p.Category)
                .Include(p => p.Seller)
                .OrderByDescending(p => p.CreatedDate)
                .ToListAsync();
        }
        public async Task<Product?> UpdateStoredQuantityAsync(int productId, int quantityChange)
        {
            var product = await _context.Products.FirstOrDefaultAsync(p => p.ProductId == productId);
            if (product == null)
            {
                return null;
            }

            product.StoredQuantity += quantityChange;

            if (product.StoredQuantity < 0)
            {
                return null;
            }

            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<bool> UpdateProductQuantityAsync(int productId, int orderQuantity)
        {
            var product = await _context.Products.FindAsync(productId);

            if (product == null)
            {
                return false; // Handle case where product is not found
            }

            // Check if there is enough quantity to fulfill the order
            if (orderQuantity > product.StoredQuantity)
            {
                return false; // Not enough quantity
            }

            // Subtract the order quantity from the stored quantity
            product.StoredQuantity -= orderQuantity;

            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                // Log the exception
                // Example: _logger.LogError(ex, "Error updating product quantity for product {ProductId}", productId);
                return false;
            }
        }

        public async Task<IEnumerable<Product>> GetInforProductBuyRequestAsync(string userId)
        {
            var user = await _context.Users.FindAsync(int.Parse(userId));
            if (user == null)
                return null;

            var products = await _context.Products
                .Where(p => p.SellerId == user.UserId)
                .ToListAsync();

            return products;
        }
         public async Task<int> CountProduct(int userId)
        {
            int number = 0;
            User? user = await _context.Users.FindAsync(userId);
            if (user != null)
                number = _context.Products.Count((p => p.SellerId == userId));
            return number;
        }

        public async Task<List<Product>> GetProductsByIdsAsync(IEnumerable<int> productIds)
        {
            return await _context.Products
                                   .Where(product => productIds.Contains(product.ProductId))
                                   .ToListAsync();
        }
    }
}
