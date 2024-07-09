using DTO.TradingOrderDto;
using Microsoft.AspNetCore.Mvc;
using Repository.Interfaces;
using DTO.Mappers;
using BusinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using BusinessObjects;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TradingOrderController : ControllerBase
    {
        private readonly ITradingOrderRepository _tradingRepo;
        private readonly IProductReposity _productRepo;
        private readonly ITradingOrderDetailRepository _tradingOrderDetailRepo;
        private readonly FufleaMarketContext _context;
        public TradingOrderController(ITradingOrderRepository tradingRepo, IProductReposity productRepo, ITradingOrderDetailRepository tradingOrderDetailRepo, FufleaMarketContext context)
        {
            _tradingRepo = tradingRepo;
            _productRepo = productRepo;
            _tradingOrderDetailRepo = tradingOrderDetailRepo;
            _context = context;
        }

        // GET: api/TradingOrder
        [HttpGet("admin/getall")]
        public async Task<IActionResult> GetAll()
        {
            var orderDTOs = await _tradingRepo.GetAllAsync();
            var order = orderDTOs.Select(x => x.ToTradingOrderDTO()).ToList();
            return Ok(order);
        }

        // GET: api/TradingOrder/5
        [HttpGet("admin/gettradingorderbyid/{id}")]
        public async Task<IActionResult> GetTradingOrderById(int id)
        {
            var orderDto = await _tradingRepo.GetByIdAsync(id);
            if (orderDto == null)
            {
                return NotFound();
            }
            return Ok(orderDto.ToTradingOrderDTO());
        }

        [HttpGet("gettradingorderofuser")]
        public async Task<IActionResult> GetTradingOrderOfUser1()
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
           
            var tradingOrders = await _tradingRepo.GetTradingOrdersByUserIdAsync(userId);
            if (tradingOrders == null || !tradingOrders.Any())
            {
                return NotFound("No trading orders found for this user.");
            }

            var tradingOrdersForUser1 = tradingOrders.Where(order => order.User1 == userId).ToList();

            if (!tradingOrdersForUser1.Any())
            {
                return Unauthorized("Claim ID does not match User1 for any trading order.");
            }

            var tradingOrderDtos = tradingOrdersForUser1.Select(order => order.ToTradingOrderDTO()).ToList();

            return Ok(tradingOrderDtos);
        }



        [HttpPost("createtradingorder")]
        public async Task<IActionResult> Create([FromBody] CreateTradingOrderRequestDto createOrderDto)
        {
            if (createOrderDto == null)
            {
                return BadRequest("TradingOrder data is required.");
            }

            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found.");
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("Invalid user ID claim.");
            }

            var tradingOrder = createOrderDto.ToTradingOrderFromCreate();

            tradingOrder.User1 = userId;

            await _tradingRepo.CreateTradingOrderAsync(tradingOrder);

            var tradingOrderDto = tradingOrder.ToTradingOrderDTO();

            return CreatedAtAction(nameof(GetTradingOrderById), new { id = tradingOrder.TradingOrderId }, tradingOrderDto);
        }

        [HttpPost("createtradingordercombined")]
        public async Task<IActionResult> Create([FromBody] CreateTradingOrderCombinedRequestDto createDto)
        {
            if (createDto == null || createDto.TradingOrder == null)
            {
                return BadRequest("Invalid input data.");
            }
        
            // Tạo TradingOrder
            var tradingOrder = new TradingOrder
            {
                User1 = createDto.TradingOrder.UserId1,
                User2 = createDto.TradingOrder.UserId2,
                Note = createDto.TradingOrder.Note,
                CreatedDate = DateTime.Now,
                Status = 1 // Giả định rằng đơn hàng mới luôn hoạt động ban đầu
            };

            await _tradingRepo.CreateTradingOrderAsync(tradingOrder);

            // Hàm tạo chi tiết đơn hàng
            async Task CreateTradingOrderDetails(List<ProductDto> products, int userId)
            {
                foreach (var productDto in products)
                {
                    var product = await _productRepo.GetByIdProductAsync(productDto.ProductId);
                    

                    var tradingOrderDetail = new TradingOrderDetail
                    {
                        ProductId = productDto.ProductId,
                        TradingOrderId = tradingOrder.TradingOrderId,
                        Quantity = productDto.Quantity,
                        Price = product.Price,
                        OwnerId = product.SellerId,
                    };

                    await _tradingOrderDetailRepo.CreateAsync(tradingOrderDetail);
                }
            }

            // Tạo chi tiết đơn hàng cho User1
            await CreateTradingOrderDetails(createDto.User1Product, createDto.TradingOrder.UserId1);

            // Tạo chi tiết đơn hàng cho User2
            await CreateTradingOrderDetails(createDto.User2Product, createDto.TradingOrder.UserId2);

            // Chuẩn bị phản hồi
            var tradingOrderDto = new TradingOrderDTO
            {
                TradingOrderId = tradingOrder.TradingOrderId,
                User1 = tradingOrder.User1,
                User2 = tradingOrder.User2,
                Note = tradingOrder.Note,
                CreatedDate = tradingOrder.CreatedDate,
                Status = tradingOrder.Status
            };

            // Trả về dữ liệu mà không bao gồm User1
            return CreatedAtAction(nameof(GetTradingOrderById), new { id = tradingOrder.TradingOrderId }, tradingOrderDto);
        }



        [HttpGet("getUserAndProductInfo/{productId}")]
        public async Task<IActionResult> GetUserAndProductInfo(int productId)
        {
            // Get the userId from the claims
            var userIdClaim = User.FindFirst("userId");
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "User ID claim not found" });
            }

            if (!int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized(new { message = "Invalid User ID claim" });
            }

            // Get the user based on the userId from the claims
            var user = await _context.Users
                                     .Include(u => u.Products)
                                     .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Get the product and its seller based on the productId
            var product = await _context.Products
                                        .Include(p => p.Seller)
                                        .ThenInclude(s => s.Products) // Include seller's products
                                        .FirstOrDefaultAsync(p => p.ProductId == productId);

            if (product == null)
            {
                return NotFound(new { message = "Product not found" });
            }

            var response = new
            {
                requestSide = new
                {
                    fullName = user.FullName,
                    avarta = user.Avarta
                },
                responseSide = new
                {
                    fullName = product.Seller.FullName,
                    avarta = product.Seller.Avarta
                },
                requestSideProducts = user.Products.Select(p => new
                {
                    productName = p.ProductName,
                    imageLink = p.ImageLink,
                    price = p.Price,
                    storedQuantity = p.StoredQuantity
                }).ToList(),
                responseSideProducts = product.Seller.Products.Select(p => new
                {
                    productName = p.ProductName,
                    imageLink = p.ImageLink,
                    price = p.Price,
                    storedQuantity = p.StoredQuantity
                }).ToList()
            };

            return Ok(response);
        }




        // PUT: api/TradingOrder/5
        [HttpPut("updatetradingorder/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTradingOrderRequestDto tradingOrderDto)
        {
            if (tradingOrderDto == null)
            {
                return BadRequest("TradingOrder data is required.");
            }

            var tradingOrder = await _tradingRepo.GetByIdAsync(id);
            if (tradingOrder == null)
            {
                return NotFound($"TradingOrder with ID {id} not found.");
            }

            await _tradingRepo.UpdateAsync(id, tradingOrderDto);

            var updatedOrder = await _tradingRepo.GetByIdAsync(id); 

            var updatedOrderDto = updatedOrder.ToTradingOrderDTO();

            return Ok(updatedOrderDto);
        }

        
    }
}
