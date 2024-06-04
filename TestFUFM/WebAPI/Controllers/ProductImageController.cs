using BusinessObjects.Mappers;
using BusinessObjects.ProductDto;
using BusinessObjects.ProductImageDto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Interfaces;
using System.Security.Claims;

namespace WebAPI.Controllers
{
    [Route("api/productimage")]
    [ApiController]

    public class ProductImageController : ControllerBase
    {
        private readonly IProductImageRepository _productImageRepo;
        private readonly IProductReposity _productRepo;

        public ProductImageController(IProductImageRepository productImageRepo, IProductReposity productRepo)
        {
            _productImageRepo = productImageRepo;
            _productRepo = productRepo;
        }

        private async Task<bool> IsUserSellerOfProduct(int productId)
        {
            var product = await _productRepo.GetProductByIdAsync(productId);
            return product != null && product.SellerId == GetLoggedInUserId();
        }

        private int GetLoggedInUserId()
        {
            var userIdClaim = User.FindFirstValue("UserId");
            if (userIdClaim == null || !int.TryParse(userIdClaim, out var userId))
            {
                throw new Exception("Invalid user ID format or user ID claim not found");
            }
            return userId;
        }

        [HttpGet("listproductimage")]
        public async Task<IActionResult> GetAll()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var productImages = await _productImageRepo.GetALLAsync();
            var productImagesDTO = productImages.Select(pi => pi.ToProductImageDto()).ToList();
            return Ok(productImagesDTO);
        }




        [HttpGet("searchproductimage/{productId:int}")]
        public async Task<IActionResult> GetById1(int productId)
        {
            var productImages = await _productImageRepo.GetAllByProductIdAsync(productId);
            if (productImages == null || !productImages.Any())
                return NotFound("Product images not found");

            var productImagesDTO = productImages.Select(pi => pi.ToProductImageDto()).ToList();
            return Ok(productImagesDTO);
        }





        [HttpGet("searchproductimagesforsellers/{productId:int}")]
        [Authorize]
        public async Task<IActionResult> GetById(int productId)
        {
            if (!await IsUserSellerOfProduct(productId))
                return Unauthorized("You are not the seller of this product");

            var productImages = await _productImageRepo.GetAllByProductIdAsync(productId);
            if (productImages == null || !productImages.Any())
                return NotFound("Product images not found");

            var productImagesDTO = productImages.Select(pi => pi.ToProductImageDto()).ToList();
            return Ok(productImagesDTO);
        }


        [HttpPost("createproductimagesforsellers/{productId:int}")]
        [Authorize]
        public async Task<IActionResult> Create([FromRoute] int productId, [FromBody] CreateProductImageDTO productImageDTO)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await _productRepo.ProductExist(productId))
                return BadRequest("Product does not exist");

            if (!await IsUserSellerOfProduct(productId))
                return Unauthorized("You are not the seller of this product");

            if (await _productImageRepo.ExistsByNameOrLink(productId, productImageDTO.ImageName, productImageDTO.ImageLink))
                return BadRequest("Image name or link already exists");

            var productImageModel = productImageDTO.ToProductImageFromCreate(productId);
            await _productImageRepo.CreateAsync(productImageModel);
            return CreatedAtAction(nameof(GetById), new { productId = productImageModel.ProductId, imageName = productImageModel.ImageName }, productImageModel.ToProductImageDto());
        }



        [HttpPut("updateproductimagesforsellers/{productId:int}/{imageName}")]
        [Authorize]
        public async Task<IActionResult> Update([FromRoute] int productId, [FromRoute] string imageName, [FromBody] UpdateProductImageRequestDTO updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!await IsUserSellerOfProduct(productId))
                return Unauthorized("You are not the seller of this product");

            if (await _productImageRepo.ExistsByNameOrLink(productId, updateDto.ImageName, updateDto.ImageLink))
                return BadRequest("Image name or link already exists");

            var updatedProduct = await _productImageRepo.UpdateAsync(productId, imageName, updateDto.ToProductImageFromUpdate());
            if (updatedProduct == null)
                return NotFound("ProductImage not found");

            return Ok("Product image updated successfully");
        }

        [HttpDelete("deleteproductimagesforsellers/{productId:int}/{imageName}")]
        [Authorize]
        public async Task<IActionResult> Delete([FromRoute] int productId, [FromRoute] string imageName)
        {
            if (!await IsUserSellerOfProduct(productId))
                return Unauthorized("You are not the seller of this product");



            var deletedProduct = await _productImageRepo.DeleteAsync(productId, imageName);
            if (deletedProduct == null)
                return NotFound("ProductImage not found");

            return Ok("Product image deleted successfully");
        }


    }
}
