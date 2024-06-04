using BusinessObjects.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IProductImageRepository
    {
        Task<List<ProductImage>> GetAllByProductIdAsync(int productId);
        Task<ProductImage> GetByIdAsync(int productId);
        Task<ProductImage> CreateAsync(ProductImage productImageModel);
        Task<Product> UpdateAsync(int productId, string imageName, ProductImage productImageModel);
        Task<Product> DeleteAsync(int productId, string imageName);
        Task<bool> ExistsByNameOrLink(int productId, string imageName, string imageLink);
        Task<bool> ProductExist(int productId);
        Task<Product> GetProductByIdAsync(int productId);

        Task<List<ProductImage>> GetALLAsync();
    }
}
