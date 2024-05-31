using BusinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repository.Interfaces
{
    public interface IWishlistRepository
    {
        public  Task<List<Product>> GetWishlistAsync(int userid);
        Task<Product> GetProductInWishlistAsync(int userid, int productid);
        Task<Product> CreateWishlistAsync(Product product);
      
        Task<Product> GetProductInWishlistAsync(object userId, int productid);
    }
}
