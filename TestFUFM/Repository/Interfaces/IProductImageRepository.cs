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
        Task<List<ProductImage>> GetALLAsync();
        Task<ProductImage?> GetByIDAsync(int id);

        Task<ProductImage> CreateAsync(ProductImage productImageModel);

        Task<ProductImage?> UpdateAsync(int id, ProductImage productImageModel);
        Task<ProductImage?> DeleteAsync(int  id);   
    }
}
