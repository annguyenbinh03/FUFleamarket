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
using BusinessObjects.CategoryDto;
using System.Linq;
using Service.ContactCheck.Interfaces;
using BusinessObjects.Models.Enum;
using DTO.Helpers;
using System.Globalization;
using Repository;

namespace WebAPI.Controllers
{
    [Route("api/product")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly FufleaMarketContext _context;
        private readonly IProductReposity _productRepo;
        private readonly IContactService _contactService;
        private readonly IPromotionRepository _promotionRepo;
        public ProductController(FufleaMarketContext context, IProductReposity productRepo, IContactService contactService, IPromotionRepository promotionRepo)
        {
            _productRepo = productRepo;
            _context = context;
            _contactService = contactService;
            _promotionRepo = promotionRepo;
        }



        // chỉnh lại admin có thể thấy hết các sp
        /// <summary>
        /// admin có thêm sắp xếp thứ tự ngày 
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet("admingetlistproducts")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminGetAll([FromQuery] QueryObject query)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var products = await _productRepo.AdminGetAllAsync(query);
            var productDtos = products.Select(p => p.ToProductDto());
            return Ok(productDtos);
        }




        // thêm thanh tìm kiếm về dealType 
        /// <summary>
        /// có thêm sắp xếp ngày vào 
        /// </summary>
        /// <returns></returns>
        [HttpGet("adminliststatus0")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminListStatus0()
        {
            var products = await _context.Products
                .OrderByDescending(p => p.CreatedDate)
                .Where(p => p.Status == 0)
                .Select(p => new
                {
                    productId = p.ProductId,
                    productName = p.ProductName,
                    price = p.Price,
                    isNew = p.IsNew,
                    dealType = p.DealType,
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
                return NoContent();
            }

            return Ok(products);
        }



        // thêm thanh tìm kiếm về dealType 
        /// <summary>
        /// có thêm sắp xếp ngày vào 
        /// tương lai thêm thanh tìm kiếm dealtype
        /// </summary>
        /// <returns></returns>   
        [HttpGet("adminliststatus1,2,3,4,5")]
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
                query = query.Where(p => p.Status == 1 || p.Status == 2 || p.Status == 3 || p.Status == 4);
            }

            var products = await query
                .OrderByDescending(p => p.CreatedDate)
                .Select(p => new
                {
                    productId = p.ProductId,
                    productName = p.ProductName,
                    price = p.Price,
                    isNew = p.IsNew,
                    dealType = p.DealType,
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



        // hàm này chưa có check status 
        /// <summary>
        ///  Thêm check status 1  sẽ được hiển thị 
        ///  và thêm sắp xếp ngày tạo sẽ giảm dần về sau 
        ///  show ra hết sp của bản thân
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("ShopProfile")]

        public async Task<IActionResult> ShopProfile([FromQuery] int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid ID.");
            }
            var userWithDetails = await _context.Users
                //.Include(u => u.Addresses)
                .Include(u => u.Products)
                .ThenInclude(p => p.Category)
                .Include(u => u.Products)
                //.ThenInclude(p => p.ProductImages)
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
                    //Addresses = userWithDetails.Addresses.Select(a => new
                    //{
                    //    a.AddressId,
                    //    a.SpecificAddress
                    //})
                },
                Products = userWithDetails.Products
                       .Where(p => p.Status == 1)
                       .OrderByDescending(p => p.CreatedDate)
                       .Select(p => new
                       {
                           p.ProductId,
                           p.ProductName,
                           p.Price,
                           p.IsNew,
                           p.DealType,
                           p.Description,
                           p.CategoryId,
                           p.Status,
                           CreateDate = DateTimeExtensions.ToRelativeTime(p.CreatedDate),
                           p.ImageLink,
                           p.StoredQuantity,

                           //ProductImages = p.ProductImages.Select(pi => new
                           //{
                           //    pi.ProductId,
                           //    pi.ImageName,
                           //    pi.ImageLink
                           //})
                       })
            };

            return Ok(result);
        }




        /// <summary>
        /// hàm này dùm để lấy ra thông tin tất cả sản phẩm seller có xem số lượng (order)yêu cầu của sanr phẩm của họ 
        /// </summary>
        /// <returns></returns>
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



        // thêm thanh tìm kiếm về dealType và chỉnh thêm trạng thái 3 đang bán hàng bình thường
        /// <summary>
        /// Tương lai sẽ thêm thanh tìn kiếm dealtype 
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet("listproduct")]
        public async Task<IActionResult> GetAll([FromQuery] QueryObject query)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var products = await _productRepo.GetALLAsync(query);
            var productDtos = products.Select(p => p.ToProductDto());

            return Ok(productDtos);
        }





        /// <summary>
        /// Lấy danh sách sản phẩm buôn bán 
        /// </summary>
        /// <returns></returns>
        [HttpGet("getProductsByDealType0")]
        public async Task<IActionResult> GetProductsByDealTypeSale()
        {
            var products = await _productRepo.GetProductsByDealTypeAsync(false);
            var productDtos = products.Select(p => p.ToProductDto());
            return Ok(productDtos);
        }






        /// <summary>
        /// Lấy danh sách sản phẩm trao đổi 
        /// </summary>
        /// <returns></returns>
        [HttpGet("getProductsByDealType1")]
        public async Task<IActionResult> GetProductsByDealTypeExchange()
        {
            var products = await _productRepo.GetProductsByDealTypeAsync(true);
            var productDtos = products.Select(p => p.ToProductDto());
            return Ok(productDtos);
        }







        /// <summary>
        /// Admin chấp nhận đơn hàng
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        [HttpPut("adminacceptproductrequest/{productId:int}")] //status 1
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminAcceptCreateRequest([FromRoute] int productId)
        {
            var result = await _productRepo.AcceptProductRequest(productId);
            if (result)
            {
                return Ok();
            }
            else
            {
                return NoContent();
            }
        }






        /// <summary>
        /// admin xóa đơn hàng
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        [HttpPut("admindeleteproduct/{productId:int}")] //status 5
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminDeleteProduct([FromRoute] int productId)
        {
            var result = await _productRepo.DeleteProduct(productId);
            if (result)
            {
                return Ok();
            }
            else
            {
                return NoContent();
            }
        }







        /// <summary>
        /// admin từ chối đơn hàng
        /// </summary>
        /// <param name="productId"></param>
        /// <returns></returns>
        [HttpPut("adminrejectproductrequest/{productId:int}")] //status 2
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminRejectCreateRequest([FromRoute] int productId)
        {
            var result = await _productRepo.RejectProductRequest(productId);
            if (result)
            {
                return Ok();
            }
            else
            {
                return NoContent();
            }
        }




        /// <summary>
        /// Lấy ra sản phẩm kiểm tra xem 2 user có thể tương tác với nhau ko 
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("getproductbyid/{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            Product? product = await _productRepo.GetByIdProductAsync(id);

            if (product == null)
            {
                return NotFound("Product ID not found. Please enter a valid Product ID.");
            }

            //var address = await _productRepo.getSellerAddress(product.SellerId);
            var productDTO = product.ToProductDto();

            bool contact = false;
            var userIdClaim = User.FindFirstValue("UserId");
            if (int.TryParse(userIdClaim, out var userId))
            {
                contact = await _contactService.CheckContactAsync(userId, product.SellerId);
            }
            return Ok(new { product = productDTO, /*address,*/ sellerId = product.SellerId, contact });
        }




        /// <summary>
        /// xem sản phẩm của bảng thân 
        /// </summary>
        /// <param name="status"></param>
        /// <param name="dealType"></param>
        /// <returns></returns>
        // chỉnh sửa trạng thái khi gọi đơn hàng của mình ra và thêm DealType
        [HttpGet("getmyproducts")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> GetMyProducts([FromQuery] int? tab, [FromQuery] bool? dealType, [FromQuery] string? sortBy, [FromQuery] int PageNumber = 1, [FromQuery] int PageSize = 10)
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


            IQueryable<Product> query = products.AsQueryable();

            if (tab.HasValue)
            {
                switch (tab.Value)
                {
                    case 1:
                        // No filter applied
                        break;
                    case 2:
                        query = query.Where(p => p.Status == 0);
                        break;
                    case 3:
                        query = query.Where(p => p.Status == 1 && p.DealType == false);
                        break;
                    case 4:
                        query = query.Where(p => p.Status == 1 && p.DealType == true);
                        break;
                    case 5:
                        query = query.Where(p => p.Status == 2);
                        break;
                    case 6:
                        query = query.Where(p => p.Status == 3);
                        break;
                    case 7:
                        query = query.Where(p => p.Status == 4);
                        break;
                    default:
                        return BadRequest("Invalid tab value");
                }
            }
            else
            {
                query = query.Where(p => p.Status >= 0 && p.Status <= 4);
            }
            if (dealType.HasValue)
            {
                query = query.Where(p => p.DealType == dealType.Value);
            }
            switch (sortBy)
            {
                case "date":
                    query = query.OrderByDescending(p => p.CreatedDate);
                    break;
                case "oldDate":
                    query = query.OrderBy(p => p.CreatedDate);
                    break;
                case "price":
                    query = query.OrderByDescending(p => p.Price);
                    break;
                case "lowPrice":
                    query = query.OrderBy(p => p.Price);
                    break;
                default:
                    query = query.OrderByDescending(p => p.CreatedDate);
                    break;
            }
            
            var skipNumber = (PageNumber - 1) * PageSize;   
            var filteredProducts =  query.Skip(skipNumber).Take(PageSize).Select(p => new
            {
                p.ProductId,
                p.ProductName,
                p.Price,
                p.IsNew,
                p.DealType, // added
                p.Status,
                p.Description,
                p.ImageLink,
                p.StoredQuantity,
                CreatedDate = DateTimeExtensions.ToRelativeTime(p.CreatedDate),
                Seller = new
                {
                    p.Seller.FullName,
                    p.Seller.PhoneNumber,
                    p.Seller.Avarta
                },
                Categories = p.Category != null ? new List<CategoryDTO> { p.Category.ToCategoryDTO() } : null,

                Orders = new List<object>() // Assuming orders should be included, this is a placeholder
            })
            .ToList();


            return Ok(filteredProducts);


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
                return Unauthorized("Invalid user ID format.");
            }

            const int standardProductLimit = 5;
            int totalProductLimit = standardProductLimit;

            // Get all active promotion orders for the seller
            var currentPromotionOrders = await _context.PromotionOrders
                .Include(po => po.Promotion)
                .Where(po => po.UserId == sellerId && po.Status == StatusPromotionOrderEnum.Active.ToString())
                .ToListAsync();

            // Get the maximum ProductQuantityLimit from related Promotions, if any
            if (currentPromotionOrders.Any())
            {
                totalProductLimit = currentPromotionOrders
                    .Max(po => po.Promotion.ProductQuantityLimit);
            }

            // Get the current product count for the seller
            var currentProductCount = await _context.Products.CountAsync(p => p.SellerId == sellerId);

            if (currentProductCount >= totalProductLimit)
            {
                return BadRequest($"You have reached the maximum number of products allowed ({totalProductLimit}).");
            }

            // Create the product model from the DTO
            var productModel = productDto.ToProductFromCreateDTO(sellerId);

            // Find and assign the seller to the product
            var seller = await _context.Users.FindAsync(sellerId);
            if (seller != null)
            {
                productModel.Seller = seller;
            }

            // Find and assign the category to the product
            var category = await _context.Categories.FindAsync(productModel.CategoryId);
            if (category != null)
            {
                productModel.Category = category;
            }

            // Save the product
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



        // chỉnh sửa lại trạng thái xóa của seller là 3 == bị ẩn
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

            //var updatedProduct = deletedProduct.ToProductDto();
            //return Ok(updatedProduct);
            return Ok("Successfully deleted product.");
        }



        // hàm này ko cần  
        [HttpDelete("deleteproductforadmin/{productId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAdmin([FromRoute] int productId)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var existingProduct = await _productRepo.GetByIdProductAsync(productId);
            if (existingProduct == null)
            {
                return NotFound("Product ID not found. Please enter a valid Product ID.");
            }

            var deletedProduct = await _productRepo.DeleteAdminAsync(productId);
            if (deletedProduct == null)
            {
                return BadRequest("Product deletion failed. Please try again.");
            }

            return Ok("Successfully deleted product.");
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


        [HttpGet("admin/noconfirmed")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetNoConfirmedProducts()
        {
            var products = await _productRepo.GetProductsByStatusAsync(2);

            var productDtos = products.Select(p => p.ToProductDto());

            return Ok(productDtos);
        }


        [HttpGet("admin/deleted")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetDeletedProducts()
        {
            var products = await _productRepo.GetProductsByStatusAsync(4);

            var productDtos = products.Select(p => p.ToProductDto());

            return Ok(productDtos);
        }

        /// <summary>
        /// return currentquantityproduct , productquantitylimit and acceptTradingPercent to CreateProdcut page
        /// </summary>
        /// <returns></returns>
        [HttpGet("getUserInforToCreateProduct")]
        public async Task<IActionResult> getUserInforToCreateProduct()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found.");
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("Invalid user ID claim.");
            }

            Promotion? promotion = await _promotionRepo.GetHighestPromotionForUser(userId);

            var response = new
            {
                currentProductQuantity = await _productRepo.CountProduct(userId),
                image = promotion != null ? promotion.ImageLink : "",
                ProductQuantityLimit = promotion != null ? promotion.ProductQuantityLimit : 5  ,
                acceptTradingPercent = await _context.Users.Where(x => x.UserId == userId).Select(x => x.AcceptedTradingPercent).FirstOrDefaultAsync()
            };

            return Ok(response);
        }

    }
}