using BusinessObjects.Models;
using DTO.WishlistDto;

namespace DTO.Mappers
{
    public static class WishListMapper
    {
        public static WishlistDTO ToWishListDTO(this Product model)
        {
            return new WishlistDTO
            {
                ProductId = model.ProductId,
                ProductName = model.ProductName,
                Description = model.Description,
                Price = model.Price,
                IsNew = model.IsNew,
                SellerId = model.SellerId,
                CategoryId = model.CategoryId,
               
            };
        }

        public static Product ToCreateWishlistDTO(this CreateWishlistDto createWishlist)
        {
            return new Product
            {
                ProductName = createWishlist.ProductName,
                Description = createWishlist.Description,
                Price = createWishlist.Price,
                IsNew = createWishlist.IsNew,
                SellerId = createWishlist.SellerId,
                CategoryId = createWishlist.CategoryId,
                

            };


        }
    }
}
