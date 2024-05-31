using BusinessObjects.Models;
using DTO.Helpers;
using DTO.ProductDto;
using DTO.UserDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public  interface IProductReposity
    {
        Task<List<Product>> GetALLAsync(QueryObject query);
        Task<Product?> GetByIdProductAsync(int id);

        Task<Product> CreateAsync(Product productModel);

        Task<Product?> UpdateAsync(int id, UpdateProductRequestDto productDto);

        Task<Product?> DeleteAsync(int id);

        Task<bool> ProductExist(int id);

    }

}
