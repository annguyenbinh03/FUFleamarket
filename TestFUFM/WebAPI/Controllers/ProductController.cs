using BusinessObjects;
using BusinessObjects.Helpers;
using BusinessObjects.Mappers;
using BusinessObjects.ProductDto;
using BusinessObjects.UserDto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using BusinessObjects.Models;

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

        [HttpGet("admingetlistproducts")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminGetAll([FromQuery] QueryObject query)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var products = await _productRepo.AdminGetAllAsync(query);

            return Ok(products);
        }

        [HttpGet("adminliststatus0")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminListStatus0()
        {
            var products = await _context.Products
                .Where(p => p.Status == 0)
                .Select(p => new
                {
                    productId = p.ProductId,
                    productName = p.ProductName,
                    price = p.Price,
                    isNew = p.IsNew,
                    description = p.Description,
                    status = p.Status,
                    categoryName = p.Category.Name,
                    LinkImage = p.ImageLink,
                    StoredQuantity = p.StoredQuantity,
                    seller = new
                    {
                        SellerID = p.Seller.UserId,
                        avarta = p.Seller.Avarta,
                        fullName = p.Seller.FullName,
                    }
                }).ToListAsync();

            if (!products.Any())
            {
                return NotFound("There are currently no products pending approval.");
            }

            return Ok(products);
        }


        [HttpGet("adminliststatus1,2,3")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminGetAll([FromQuery] int? status)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            IQueryable<Product> query = _context.Products.AsQueryable();

            if (status.HasValue)
            {
                query = query.Where(p => p.Status == status.Value);
            }
            else
            {
                query = query.Where(p => p.Status == 1 || p.Status == 2 || p.Status == 3);
            }

            var products = await query
                .Select(p => new
                {
                    productId = p.ProductId,
                    productName = p.ProductName,
                    price = p.Price,
                    isNew = p.IsNew,
                    description = p.Description,
                    status = p.Status,
                    categoryName = p.Category.Name,
                    LinkImage = p.ImageLink,
                    StoredQuantity = p.StoredQuantity,
                    seller = new
                    {
                        SellerID = p.Seller.UserId,
                        avarta = p.Seller.Avarta,
                        fullName = p.Seller.FullName,
                    }
                }).ToListAsync();

            if (!products.Any())
            {
                return BadRequest("There are currently no products with the specified status.");
            }

            return Ok(products);
        }




        [HttpGet("ShopProfile")]
        public async Task<IActionResult> ShopProfile([FromQuery] int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid ID.");
            }
            var userWithDetails = await _context.Users
                .Include(u => u.Addresses)
                .Include(u => u.Products)
                    .ThenInclude(p => p.Category)
                .Include(u => u.Products)
                    .ThenInclude(p => p.ProductImages)
                .FirstOrDefaultAsync(u => u.UserId == id);
            if (userWithDetails == null)
            {
                return NotFound("User not found.");
            }
            var result = new
            {
                User = new
                {
                    userWithDetails.UserId,
                    userWithDetails.FullName,
                    userWithDetails.Email,
                    userWithDetails.PhoneNumber,
                    userWithDetails.Introduction,
                    userWithDetails.Avarta,
                    userWithDetails.CreatedDate,
                    userWithDetails.BuyRating,
                    userWithDetails.SellRating,
                    Addresses = userWithDetails.Addresses.Select(a => new
                    {
                        a.AddressId,
                        a.SpecificAddress
                    })
                },
                Products = userWithDetails.Products.Select(p => new
                {
                    p.ProductId,
                    p.ProductName,
                    p.Price,
                    p.IsNew,
                    p.Description,
                    p.CategoryId,
                    p.Status,
                    p.CreatedDate,
                    p.ImageLink,
                    p.StoredQuantity,

                    ProductImages = p.ProductImages.Select(pi => new
                    {
                        pi.ProductId,
                        pi.ImageName,
                        pi.ImageLink
                    })
                })
            };

            return Ok(result);
        }


        [HttpGet("GetInforProductBuyRequest")]
        [Authorize]
        public async Task<IActionResult> GetInforProductBuyRequest()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
                return Unauthorized("Claim user ID not found");

            var userId = userIdClaim.Value;
            var result = await _productRepo.GetInforProductBuyRequestAsync(userId);

            if (result == null)
                return NotFound("No products found");

            var response = result.Select(product => new
            {
                ProductId = product.ProductId,
                ProductName = product.ProductName,
                WaitingOrderNumber = _context.Orders.Count(o => o.ProductId == product.ProductId && o.Status == 0),
                ImageLink = product.ImageLink
            });

            return Ok(response);
        }


        [HttpGet("listproduct")]
        public async Task<IActionResult> GetAll([FromQuery] QueryObject query)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var products = await _productRepo.GetALLAsync(query);
            var productDtos = products.Select(p => p.ToProductDto());

            return Ok(productDtos);
        }



        [HttpPut("adminacceptproductrequest/{productId:int}")]
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



        [HttpPut("adminrejectproductrequest/{productId:int}")]
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



        [HttpGet("getproductbyid/{id:int}")]
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
            return Ok(new { product = productDTO, address, sellerId = product.SellerId });
        }



        [HttpGet("getmyproducts")]
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



        [HttpPost("createproductforsellers")]
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
                //     .Where(po => po.UserId == sellerId && po.StartDate <= DateTime.Now && po.EndDate >= DateTime.Now)
                .ToListAsync();

            if (currentPromotionOrders != null && currentPromotionOrders.Any())
            {
                //   var additionalProductOrders = currentPromotionOrders.Where(po => po.Promotion.ProductQuantity > 0);

                //    int additionalProductLimit = additionalProductOrders.Sum(po => po.Promotion.ProductQuantity * po.ProductQuantity);

                //   totalProductLimit = standardProductLimit + additionalProductLimit;
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



        [HttpPut("editstoredquantity/{productId:int}")]
        [Authorize]
        public async Task<IActionResult> EditStorageQuantity([FromRoute] int productId, [FromBody] int quantityChange)
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

            var updatedProduct = await _productRepo.UpdateStoredQuantityAsync(productId, quantityChange);
            if (updatedProduct == null)
            {
                return BadRequest("Failed to update the stored quantity.");
            }

            return Ok(updatedProduct.ToProductDto());
        }



        [HttpPut("updateproductforsellers/{productId:int}")]
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



        [HttpDelete("deleteproductforsellers/{productId:int}")]
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

        [HttpGet("admin/pending")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPendingProducts()
        {
            var products = await _productRepo.GetProductsByStatusAsync(0);

            var productDtos = products.Select(p => p.ToProductDto());

            return Ok(productDtos);
        }


        [HttpGet("admin/confirmed")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetConfirmedProducts()
        {
            var products = await _productRepo.GetProductsByStatusAsync(1);

            var productDtos = products.Select(p => p.ToProductDto());

            return Ok(productDtos);
        }

        [HttpGet("admin/deleted")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetDeletedProducts()
        {
            var products = await _productRepo.GetProductsByStatusAsync(2);

            var productDtos = products.Select(p => p.ToProductDto());

            return Ok(productDtos);
        }



    }
}