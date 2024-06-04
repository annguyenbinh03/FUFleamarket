using System.Threading.Tasks;

using BusinessObjects.Models;
using BusinessObjects.WishlistDto;

public interface IWishlistRepository
{
    Task<Product> GetProductByIdAsync(int productId);
    Task<bool> CreateWishlistAsync(WishlistDTO wishlistDto);
    Task<bool> WishlistItemExistsAsync(int userId, int productId);
    Task<IEnumerable<Product>> GetWishlistByUserIdAsync(int userId);
    Task<bool> DeleteWishlistAsync(WishlistDTO wishlistDto);
}
