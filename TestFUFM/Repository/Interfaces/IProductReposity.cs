using BusinessObjects.Models;
using BusinessObjects.Helpers;
using BusinessObjects.ProductDto;
using BusinessObjects.UserDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IProductReposity
    {
        Task<List<Product>> GetALLAsync(QueryObject query);

        Task<List<Product>> AdminGetAllAsync(QueryObject query);

        Task<List<Product>> GetProductsByDealTypeAsync(bool dealType);
        Task<bool> AcceptProductRequest(int productId);

        Task<bool> RejectProductRequest(int productId);

        Task<bool> DeleteProduct(int productId);

        Task<Product?> GetByIdProductAsync(int id);

        Task<List<Product>?> GetProductByUserIdAsync(int userId);

        Task<Product> CreateAsync(Product productModel);

        Task<Product?> UpdateAsync(int sellerId, int productId, UpdateProductRequestDto productDto);

        Task<Product?> DeleteAsync(int id);

        Task<Product?> DeleteAdminAsync(int id);

        Task<bool> ProductExist(int id);

        Task<Product> GetProductById(int productId);

        Task<List<Product>> GetProductsByStatusAsync(int status);
        Task<Product?> GetProductByIdAsync(int productId);
        Task<IEnumerable<Product>> GetInforProductBuyRequestAsync(string userId);

        Task<List<Product>> GetProductsByUserIdAsync(int userId);

        Task<string?> getSellerAddress(int sellerId);

        Task<Product?> UpdateStoredQuantityAsync(int productId, int quantityChange);
        Task<bool> UpdateProductQuantityAsync(int productId, int orderQuantity);

        Task<int> CountProduct(int userId);

        Task<List<Product>> GetProductsByIdsAsync(IEnumerable<int> productIds);
    }

}
