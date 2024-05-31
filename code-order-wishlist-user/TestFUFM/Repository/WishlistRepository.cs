using BusinessObjects.Models;
using DTO;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repository
{
    public class WishlistRepository : IWishlistRepository
    {
        private readonly FufleaMarketContext _dbcontext;

        public WishlistRepository(FufleaMarketContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public async Task<Product> CreateWishlistAsync(Product product)
        {
            try
            {
                _dbcontext.Products.Add(product);
                await _dbcontext.SaveChangesAsync();
                return product;
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while creating the wishlist", ex);
            }
        }

        public async Task<Product> GetProductInWishlistAsync(int userid, int productid)
        {
            User user = await _dbcontext.Users.Include(u => u.ProductsNavigation)
                                              .FirstOrDefaultAsync(u => u.UserId == userid);
            if (user == null)
                return null;

            Product product = user.ProductsNavigation.FirstOrDefault(p => p.ProductId == productid);
            return product;
        }

        public Task<Product> GetProductInWishlistAsync(object userId, int productid)
        {
            throw new NotImplementedException();
        }

        public async Task<List<Product>> GetWishlistAsync(int userid)
        {
            User user = await _dbcontext.Users.Include(u => u.ProductsNavigation)
                                              .FirstOrDefaultAsync(u => u.UserId == userid);

            return user?.ProductsNavigation?.ToList() ?? new List<Product>();
        }

        
    }
}
