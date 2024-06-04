﻿using BusinessObjects.Models;
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
    public  interface IProductReposity
    {
        Task<List<Product>> GetALLAsync(QueryObject query);

        Task<Product?> GetByIdProductAsync(int id);

        Task<Product> CreateAsync(Product productModel);

        Task<Product?> UpdateAsync(int sellerId, int productId, UpdateProductRequestDto productDto);

        Task<Product?> DeleteAsync(int id);

        Task<bool> ProductExist(int id);

        Task<Product> GetProductById(int productId);

        Task<List<Product>> GetProductsByStatusAsync(int status);
        Task<Product?> GetProductByIdAsync(int productId);

        Task<List<Product>> GetProductsByUserIdAsync(int userId);

    }

}
