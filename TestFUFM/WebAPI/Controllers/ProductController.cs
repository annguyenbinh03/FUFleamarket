﻿using BusinessObjects;
using BusinessObjects.Helpers;
using BusinessObjects.Mappers;
using BusinessObjects.ProductDto;
using BusinessObjects.UserDto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace WebAPI.Controllers
{
    [Route("api/product")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly FufleaMarketContext _context;
        private readonly IProductReposity _productRepo;
        public ProductController(FufleaMarketContext context, IProductReposity productRepo)
        {
            _productRepo = productRepo;
            _context = context;
        }


        [HttpGet("ListProduct")]
        public async Task<IActionResult> GetAll([FromQuery] QueryObject query)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var products = await _productRepo.GetALLAsync(query);
            var productDtos = products.Select(p => p.ToProductDto());

            return Ok(productDtos);
        }

        [HttpPut("Admin/AcceptProductRequest/{productId:int}")]
        [Authorize]
        public async Task<IActionResult> AdminAcceptCreateRequest([FromRoute] int productId)
        {
            var result = await _productRepo.AcceptProductRequest(productId);
            if (result)
            {
                return Ok();
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPut("Admin/RejectProductRequest/{productId:int}")]
        [Authorize]
        public async Task<IActionResult> AdminRejectCreateRequest([FromRoute] int productId)
        {
            var result = await _productRepo.RejectProductRequest(productId);
            if (result)
            {
                return Ok();
            }
            else
            {
                return NotFound();
            }
        }
       

        [HttpGet("GetProductById/{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var maxProductId = await _context.Products.MaxAsync(p => p.ProductId);

            if (id > maxProductId)
            {
                return BadRequest("Product ID exceeds the maximum available ID. Please enter a valid Product ID.");
            }

            var product = await _productRepo.GetByIdProductAsync(id);
            var address = await _productRepo.getSellerAddress(product.SellerId);
            var productDTO = product.ToProductDto();
            if (product == null)
            {
                return NotFound("Product ID not found. Please enter a valid Product ID.");
            }
            return Ok( new { product = productDTO, address, sellerId =  product.SellerId });
        }

        [HttpGet("GetMyProducts")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> GetMyProducts()
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirstValue("UserId");
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user ID format");
            }

            var products = await _productRepo.GetProductByUserIdAsync(userId);

            if (products == null || !products.Any())
            {
                return BadRequest("You don't have any products yet");
            }

            return Ok(products);
        }


        [HttpPost("CreateProductForSellers")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateProductRequestDto productDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (productDto.CategoryId == 0)
            {
                return BadRequest("CategoryId is required.");
            }
           
            if (!int.TryParse(User.FindFirstValue("UserId"), out var sellerId))
            {
                return Unauthorized("Invalid user ID format");
            }
           
            int standardProductLimit = 3; 
            int totalProductLimit = standardProductLimit;
           
            var currentPromotionOrders = await _context.PromotionOrders
                .Include(po => po.Promotion)
                .Where(po => po.UserId == sellerId && po.StartDate <= DateTime.Now && po.EndDate >= DateTime.Now)
                .ToListAsync();
          
            if (currentPromotionOrders != null && currentPromotionOrders.Any())
            {
                var additionalProductOrders = currentPromotionOrders.Where(po => po.Promotion.ProductQuantity > 0);

                int additionalProductLimit = additionalProductOrders.Sum(po => po.Promotion.ProductQuantity * po.ProductQuantity);

                totalProductLimit = standardProductLimit + additionalProductLimit;
            }

            var currentProductCount = await _context.Products.CountAsync(p => p.SellerId == sellerId);
            if (currentProductCount >= totalProductLimit)
            {
                return BadRequest($"You have reached the maximum number of products allowed ({totalProductLimit}).");
            }

            var productModel = productDto.ToProductFromCreateDTO(sellerId);

            var seller = await _context.Users.FirstOrDefaultAsync(u => u.UserId == sellerId);
            if (seller != null)
            {
                productModel.Seller = seller;
            }

            var category = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == productModel.CategoryId);
            if (category != null)
            {
                productModel.Category = category;
            }

            await _productRepo.CreateAsync(productModel);

            return CreatedAtAction(nameof(GetById), new { id = productModel.ProductId }, productModel.ToProductDto());
        }


        [HttpPut("UpdateProductForSellers/{productId:int}")]
        [Authorize]
        public async Task<IActionResult> Update([FromRoute] int productId, [FromBody] UpdateProductRequestDto updateDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var maxProductId = await _context.Products.MaxAsync(p => p.ProductId);

            if (productId > maxProductId)
            {
                return BadRequest("Product ID exceeds the maximum available ID. Please enter a valid Product ID.");
            }

            if (updateDto.CategoryId == 0)
            {
                return BadRequest("CategoryId is required.");
            }

            var categoryExists = await _context.Categories.AnyAsync(c => c.CategoryId == updateDto.CategoryId);
            if (!categoryExists)
            {
                return BadRequest("The provided CategoryId does not exist.");
            }

            var userIdClaim = User.FindFirstValue("UserId");
            if (!int.TryParse(userIdClaim, out var sellerId))
            {
                return Unauthorized("Invalid user ID format");
            }

            var existingProduct = await _productRepo.GetByIdProductAsync(productId);
            if (existingProduct == null)
            {
                return NotFound("Product ID not found. Please enter a valid Product ID.");
            }

            if (existingProduct.SellerId != sellerId)
            {
                return Unauthorized("This is not your product, please enter your product ID.");
            }

            var productModel = await _productRepo.UpdateAsync(sellerId, productId, updateDto);
            var category = await _context.Categories.FirstOrDefaultAsync(c => c.CategoryId == updateDto.CategoryId);
            if (category != null)
            {
                productModel.Category = category;
            }

            return Ok(productModel.ToProductDto());
        }




        [HttpDelete("DeleteProductForSellers/{productId:int}")]
        [Authorize]
        public async Task<IActionResult> Delete([FromRoute] int productId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
           
            var maxProductId = await _context.Products.MaxAsync(p => p.ProductId);

            if (productId > maxProductId)
            {
                return BadRequest("Product ID exceeds the maximum available ID. Please enter a valid Product ID.");
            }

            var userIdClaim = User.FindFirstValue("UserId");
            if (!int.TryParse(userIdClaim, out var sellerId))
            {
                return Unauthorized("Invalid user ID format");
            }


            var existingProduct = await _productRepo.GetByIdProductAsync(productId);
            if (existingProduct == null)
            {
                return NotFound("Product ID not found. Please enter a valid Product ID.");
            }

            if (existingProduct.SellerId != sellerId)
            {
                return Unauthorized("This is not your product, please enter your product ID.");
            }

            var deletedProduct = await _productRepo.DeleteAsync(productId);
            if (deletedProduct == null)
            {
                return NotFound("Product ID not found. Please enter a valid Product ID.");
            }

            var updatedProduct = deletedProduct.ToProductDto();
            return Ok(updatedProduct);
        }

        [HttpGet("Admin/Pending")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPendingProducts()
        {
            var products = await _productRepo.GetProductsByStatusAsync(0);

            var productDtos = products.Select(p => p.ToProductDto());

            return Ok(productDtos);
        }


        [HttpGet("Admin/Confirmed")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetConfirmedProducts()
        {
            var products = await _productRepo.GetProductsByStatusAsync(1);

            var productDtos = products.Select(p => p.ToProductDto());

            return Ok(productDtos);
        }

        [HttpGet("Admin/Deleted")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetDeletedProducts()
        {
            var products = await _productRepo.GetProductsByStatusAsync(2);

            var productDtos = products.Select(p => p.ToProductDto());

            return Ok(productDtos);
        }



    }
}