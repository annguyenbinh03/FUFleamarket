﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using BusinessObjects.Models;
using BusinessObjects;
using DTO.WishlistDto;

public class WishlistRepository : IWishlistRepository
{
    private readonly FufleaMarketContext _context;

    public WishlistRepository(FufleaMarketContext context)
    {
        _context = context;
    }

    public async Task<Product> GetProductByIdAsync(int productId)
    {
        return await _context.Products.FindAsync(productId);
    }

    public async Task<bool> CreateWishlistAsync(WishlistDTO wishlistDto)
    {
        var sql = "INSERT INTO Wishlist (userId, productId) VALUES (@p0, @p1)";
        var result = await _context.Database.ExecuteSqlRawAsync(sql, wishlistDto.UserId, wishlistDto.ProductId);
        return result > 0;
    }

    public async Task<bool> WishlistItemExistsAsync(int userId, int productId)
    {
        var sql = "SELECT COUNT(*) FROM Wishlist WHERE userId = @p0 AND productId = @p1";
        var count = await _context.Database.ExecuteSqlRawAsync(sql, userId, productId);
        return count > 0;
    }

    public async Task<IEnumerable<Product>> GetWishlistByUserIdAsync(int userId)
    {
        var sql = @"SELECT p.* FROM Wishlist w
                    JOIN Product p ON w.ProductId = p.ProductId
                    WHERE w.UserId = @p0";
        return await _context.Products.FromSqlRaw(sql, userId).ToListAsync();
    }
}
