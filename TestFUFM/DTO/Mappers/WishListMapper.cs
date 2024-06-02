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


            };
        }

        public static Product ToCreateWishlistDTO(this CreateWishlistDto createWishlist)
        {
            return new Product
            {
                ProductId = createWishlist.ProductId


            };


        }
    }
}
