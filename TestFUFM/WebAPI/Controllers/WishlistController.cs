using BusinessObjects.Models;
using Microsoft.AspNetCore.Mvc;
using Repository.Interfaces;
using DTO.Mappers;
using DTO.WishlistDto;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Controllers
{
    [Route("api/wishlist")]
    [ApiController]
    public class WishlistController : ControllerBase
    {
        private readonly IWishlistRepository _wishlistRepo;

        public WishlistController(IWishlistRepository wishlistRepo)
        {
            _wishlistRepo = wishlistRepo;
        }

        [HttpGet("{userid}")]
        public async Task<IActionResult> GetAllOrder([FromRoute] int userid)
        {
            List<Product> products = await _wishlistRepo.GetWishlistAsync(userid);

            if (products == null || !products.Any())
            {
                return NotFound();
            }

            var productModels = products.Select(x => x.ToWishListDTO()).ToList();

            return Ok(productModels);
        }

        [HttpGet("{userid}/{productid}")]
        public async Task<IActionResult> GetById([FromRoute] int userid, [FromRoute] int productid)
        {
            Product product = await _wishlistRepo.GetProductInWishlistAsync(userid, productid);

            if (product == null)
            {
                return NotFound();
            }

            var productModel = product.ToWishListDTO();

            return Ok(productModel);
        }

        [HttpPost]
        public async Task<IActionResult> CreateWishlist([FromBody] CreateWishlistDto wishlistDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Tạo một đối tượng Product từ dữ liệu DTO
            var product = new Product
            {
                ProductName = wishlistDto.ProductName,
                Description = wishlistDto.Description,
                Price = wishlistDto.Price,
                IsNew = wishlistDto.IsNew,
                SellerId = wishlistDto.SellerId,
                CategoryId = wishlistDto.CategoryId,
               
            };

            // Gọi phương thức CreateWishlistAsync của repository để tạo mới sản phẩm trong danh sách mong muốn
            var createdProduct = await _wishlistRepo.CreateWishlistAsync(product);

            // Kiểm tra xem sản phẩm đã được tạo thành công hay không
            if (createdProduct == null)
            {
                // Nếu không, trả về lỗi 500
                return StatusCode(500, "A problem happened while handling your request.");
            }

            // Nếu sản phẩm đã được tạo thành công, trả về mã trạng thái 201 Created
            // và URL của sản phẩm được tạo
            return CreatedAtAction(nameof(GetById), new { userid = createdProduct.Users, productid = createdProduct.ProductId }, createdProduct);
        }

    }
}
