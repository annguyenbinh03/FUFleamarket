using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;
using BusinessObjects.Models;
using BusinessObjects;
using BusinessObjects.WishlistDto;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistController : ControllerBase
    {
        private readonly IWishlistRepository _wishlistRepo;

        public WishlistController(IWishlistRepository wishlistRepo)
        {
            _wishlistRepo = wishlistRepo;
        }

        [HttpPost]
        public async Task<IActionResult> CreateWishlist([FromBody] WishlistDTO wishlistDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirstValue("UserId");
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user ID format");
            }

            wishlistDto.UserId = userId;

            var existingProduct = await _wishlistRepo.GetProductByIdAsync(wishlistDto.ProductId);
            if (existingProduct == null)
            {
                return NotFound("Product not found with the provided ProductId.");
            }

            var exists = await _wishlistRepo.WishlistItemExistsAsync(userId, wishlistDto.ProductId);
            if (exists)
            {
                return Conflict("This item is already in the wishlist.");
            }

            var result = await _wishlistRepo.CreateWishlistAsync(wishlistDto);
            if (!result)
            {
                return StatusCode(500, "A problem happened while handling your request.");
            }

            return CreatedAtAction(nameof(GetById), new { userid = wishlistDto.UserId, productid = wishlistDto.ProductId }, wishlistDto);
        }

        [HttpGet("{userid}/{productid}")]
        public async Task<IActionResult> GetById(int userid, int productid)
        {
            var exists = await _wishlistRepo.WishlistItemExistsAsync(userid, productid);

            if (!exists)
            {
                return NotFound();
            }

            return Ok(new WishlistDTO { UserId = userid, ProductId = productid });
        }

        [HttpGet("user/{userid}")] // New endpoint to get all wishlist items for a user
        public async Task<IActionResult> GetWishlistByUserId(int userid)
        {
            var wishlistItems = await _wishlistRepo.GetWishlistByUserIdAsync(userid);

            if (wishlistItems == null || !wishlistItems.Any())
            {
                return NotFound("No items found in the wishlist.");
            }

            return Ok(wishlistItems);
        }
        [HttpDelete("{productid}")]
        public async Task<IActionResult> DeleteWishlist(int productid)
        {
            // Lấy userId từ thông tin người dùng đã đăng nhập
            var userId = int.Parse(User.FindFirstValue("UserId"));

            var wishlistDto = new WishlistDTO
            {
                UserId = userId,
                ProductId = productid
            };

            var result = await _wishlistRepo.DeleteWishlistAsync(wishlistDto);

            if (!result)
            {
                return NotFound("Item not found in the wishlist.");
            }

            return NoContent();
        }
        [HttpGet("user")]
        public async Task<IActionResult> GetWishlistForCurrentUser()
        {
            // Lấy userId từ thông tin người dùng đã đăng nhập
            var userId = int.Parse(User.FindFirstValue("UserId"));

            var wishlistItems = await _wishlistRepo.GetWishlistByUserIdAsync(userId);

            if (wishlistItems == null || !wishlistItems.Any())
            {
                return NotFound("No items found in the wishlist.");
            }

            return Ok(wishlistItems);
        }
    }
}
