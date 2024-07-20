using DTO.TradingOrderDto;
using Microsoft.AspNetCore.Mvc;
using Repository.Interfaces;
using DTO.Mappers;
using BusinessObjects.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using BusinessObjects;
using BusinessObjects.Models.Enum;
using Service.ContactCheck.Interfaces;
using Service.ContactCheck;
using Service.BackgroudService;

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
        private readonly IUserRepository _userRepo;
        private readonly IContactService _contactService;
        private readonly StatusTradingOrderService _statusTradingOrderService;
        public TradingOrderController(ITradingOrderRepository tradingRepo, IProductReposity productRepo, ITradingOrderDetailRepository tradingOrderDetailRepo, FufleaMarketContext context, IUserRepository userRepo, IContactService contactService, StatusTradingOrderService statusTradingOrderService)
        {
            _tradingRepo = tradingRepo;
            _productRepo = productRepo;
            _tradingOrderDetailRepo = tradingOrderDetailRepo;
            _context = context;
            _userRepo = userRepo;
            _contactService = contactService;
            _statusTradingOrderService = statusTradingOrderService;
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

            var tradingOrders = await _tradingRepo.GetTradingOrdersByUser1IdAsync(userId);
            if (tradingOrders == null || !tradingOrders.Any())
            {
                return NotFound("No trading orders found for this user.");
            }

            var userIds = tradingOrders.SelectMany(order => new[] { order.User1, order.User2 }).Distinct();
            var users = await _userRepo.GetUsersByIdsAsync(userIds);

            var productIds = tradingOrders.SelectMany(order => order.TradingOrderDetails.Select(detail => detail.ProductId)).Distinct();
            var products = await _productRepo.GetProductsByIdsAsync(productIds);

            var tradingOrderDtos = tradingOrders.Select(order => new
            {
                TradingOrderId = order.TradingOrderId,
                User1 = users.Where(u => u.UserId == order.User1).Select(u => new
                {
                    u.UserId,
                    u.FullName,
                    u.Avarta
                }).FirstOrDefault(),
                User1TradingOrderDetails = order.TradingOrderDetails.Where(detail => detail.OwnerId == order.User1).Select(detail => new
                {
                    detail.TradingOrderDetailId,
                    detail.ProductId,
                    detail.OwnerId,
                    detail.Quantity,
                    detail.Price,
                    Product = products.Where(p => p.ProductId == detail.ProductId).Select(p => new
                    {
                        p.ProductId,
                        p.ProductName,
                        p.Price,
                        p.ImageLink,
                        p.StoredQuantity
                    }).FirstOrDefault()
                }).ToList(),
                User2 = users.Where(u => u.UserId == order.User2).Select(u => new
                {
                    u.UserId,
                    u.FullName,
                    u.Avarta
                }).FirstOrDefault(),
                User2TradingOrderDetails = order.TradingOrderDetails.Where(detail => detail.OwnerId == order.User2).Select(detail => new
                {
                    detail.TradingOrderDetailId,
                    detail.ProductId,
                    detail.OwnerId,
                    detail.Quantity,
                    detail.Price,
                    Product = products.Where(p => p.ProductId == detail.ProductId).Select(p => new
                    {
                        p.ProductId,
                        p.ProductName,
                        p.Price,
                        p.ImageLink,
                        p.StoredQuantity
                    }).FirstOrDefault()
                }).ToList(),
                order.Note,
                order.CreatedDate,
                order.Status
            }).ToList();

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
                CreatedDate = DateTime.Now.AddHours(7),
                Status = 0 // Giả định rằng đơn hàng mới luôn hoạt động ban đầu
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

            // Get the user based on the userId from the claims with additional conditions
            var user = await _context.Users
                     .Include(u => u.Products.Where(p => p.DealType == true && p.Status == 1)) // Added condition here
                     .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Get the product and its seller based on the productId with additional conditions
            var product = await _context.Products
                                .Include(p => p.Seller)
                                .ThenInclude(s => s.Products.Where(p => p.DealType == true && p.Status == 1)) // Added condition here
                                .Where(p => p.ProductId == productId && p.DealType == true && p.Status == 1)
                                .FirstOrDefaultAsync();

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
                    avarta = product.Seller.Avarta,
                    UserId = product.SellerId
                },
                requestSideProducts = user.Products.Select(p => new
                {
                    productId = p.ProductId,
                    productName = p.ProductName,
                    imageLink = p.ImageLink,
                    price = p.Price,
                    storedQuantity = p.StoredQuantity
                }).ToList(),
                responseSideProducts = product.Seller.Products.Select(p => new
                {
                    productId = p.ProductId,
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


        [HttpPut("User2/Accept/{id}")]
        public async Task<IActionResult> User2Accept(int id)
        {
            // Lấy User2 từ claims
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return BadRequest("User ID not found in claims.");
            }
            var user2Id = int.Parse(userIdClaim.Value);

            // Tìm TradingOrder và bao gồm TradingOrderDetails
            var tradingOrder = await _context.TradingOrders
                                             .Include(to => to.TradingOrderDetails)
                                             .FirstOrDefaultAsync(to => to.TradingOrderId == id);
            if (tradingOrder == null)
            {
                return BadRequest("Order not found.");
            }

            // Kiểm tra User2
            if (tradingOrder.User2 != user2Id)
            {
                return BadRequest("You are not authorized to update this order.");
            }

            // Cập nhật trạng thái
            tradingOrder.Status = 1;
            await _contactService.OpenContactAsync(user2Id, tradingOrder.User1);

            // Kiểm tra và cập nhật số lượng tồn kho sản phẩm
            if (tradingOrder.TradingOrderDetails == null || !tradingOrder.TradingOrderDetails.Any())
            {
                return BadRequest("No order details found for the order.");
            }

            foreach (var detail in tradingOrder.TradingOrderDetails)
            {

                var product = await _context.Products.FindAsync(detail.ProductId);
                if (product != null)
                {
                    if (product.StoredQuantity >= detail.Quantity)
                    {
                        product.StoredQuantity -= detail.Quantity;

                    }
                    else
                    {
                        return BadRequest($"Not enough stock for Product ID {product.ProductId}. Current stock: {product.StoredQuantity}, required: {detail.Quantity}");
                    }
                }
                else
                {
                    return BadRequest($"Product ID {detail.ProductId} not found.");
                }
            }
            
            // Lưu các thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();

            // Lấy thời gian hiện tại khi người dùng accept
            var acceptTime = DateTime.Now;
            Console.WriteLine($"TradingOrder accepted at: {acceptTime}");

            // Chạy background job sau khi các tác vụ chính đã hoàn tất
            Task.Run(() => _statusTradingOrderService.RunBackgroundJobForTradingOrder(id, acceptTime));

            return NoContent();
        }



        [HttpPost("User2/Reject/{id}")]
        public async Task<IActionResult> User2Reject(int id)
        {
            // Lấy User2 từ claims
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return BadRequest("User ID not found in claims.");
            }
            var user2Id = int.Parse(userIdClaim.Value);

            // Tìm TradingOrder và bao gồm TradingOrderDetails
            var tradingOrder = await _context.TradingOrders
                                             .Include(to => to.TradingOrderDetails)
                                             .FirstOrDefaultAsync(to => to.TradingOrderId == id);
            if (tradingOrder == null)
            {
                return BadRequest("Order not found.");
            }

            // Kiểm tra User2
            if (tradingOrder.User2 != user2Id)
            {
                return BadRequest("You are not authorized to update this order.");
            }

            // Cập nhật trạng thái
            tradingOrder.Status = 2;
            await _contactService.CloseContactAsync(user2Id, tradingOrder.User1);
            // Kiểm tra và cập nhật số lượng tồn kho sản phẩm
            if (tradingOrder.TradingOrderDetails == null || !tradingOrder.TradingOrderDetails.Any())
            {
                return BadRequest("No order details found for the order.");
            }

            foreach (var detail in tradingOrder.TradingOrderDetails)
            {

                var product = await _context.Products.FindAsync(detail.ProductId);
                if (product != null)
                {                                       
                        product.StoredQuantity += detail.Quantity;
                }
                else
                {
                    return BadRequest($"Product ID {detail.ProductId} not found.");
                }
            }
            // Thông tin User2
            var user2 = await _context.Users
                              .Where(u => u.UserId == tradingOrder.User2)
                              .FirstOrDefaultAsync();
            if (user2 == null)
            {
                return BadRequest("User2 not found.");
            }

            // Tính toán avg SellRating và số lần bán thành công của User2
            var sellRatingUser2 = (user2.SellTimes * user2.SellRating) / (user2.SellTimes + 1);
            var sellTimesUser2 = user2.SellTimes + 1;

            // Cập nhật thông tin của User2
            user2.SellRating = sellRatingUser2;
            user2.SellTimes = sellTimesUser2;
            // Lưu các thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("User1/Reject/{id}")]
        public async Task<IActionResult> User1Reject(int id)
        {
            // Lấy User1 từ claims
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return BadRequest("User ID not found in claims.");
            }

            var user1Id = int.Parse(userIdClaim.Value);


            // Tìm TradingOrder và bao gồm TradingOrderDetails
            var tradingOrder = await _context.TradingOrders
                                             .Include(to => to.TradingOrderDetails)
                                             .FirstOrDefaultAsync(to => to.TradingOrderId == id);
            if (tradingOrder == null)
            {
                return BadRequest("Order not found.");
            }

            // Kiểm tra User2
            if (tradingOrder.User1 != user1Id)
            {
                return BadRequest("You are not authorized to update this order.");
            }

            // Cập nhật trạng thái
            tradingOrder.Status = 2;
            await _contactService.CloseContactAsync(user1Id, tradingOrder.User2);
            // Kiểm tra và cập nhật số lượng tồn kho sản phẩm
            if (tradingOrder.TradingOrderDetails == null || !tradingOrder.TradingOrderDetails.Any())
            {
                return BadRequest("No order details found for the order.");
            }

            foreach (var detail in tradingOrder.TradingOrderDetails)
            {

                var product = await _context.Products.FindAsync(detail.ProductId);
                if (product != null)
                {
                        product.StoredQuantity += detail.Quantity;

                }
                else
                {
                    return BadRequest($"Product ID {detail.ProductId} not found.");
                }
            }
            // Thông tin User1
            var user1 = await _context.Users
                              .Where(u => u.UserId == user1Id)
                              .FirstOrDefaultAsync();
            if (user1 == null)
            {
                return BadRequest("User1 not found.");
            }

            // Tính toán avg BuyRating và số lần mua thành công của User1
            var buyRatingUser1 = (user1.BuyTimes * user1.BuyRating) / (user1.BuyTimes + 1);
            var buyTimesUser1 = user1.BuyTimes + 1;

            // Cập nhật thông tin của User1 và lưu BuyRating
            user1.BuyRating = buyRatingUser1;
            user1.BuyTimes = buyTimesUser1;
            // Lưu các thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("User1/Complete/{id}")]
        public async Task<IActionResult> User1Complete(int id)
        {
            // Lấy User1 từ claims
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return BadRequest("User ID not found in claims.");
            }

            var user1Id = int.Parse(userIdClaim.Value);

            // Tìm TradingOrder
            var tradingOrder = await _context.TradingOrders.FindAsync(id);
            if (tradingOrder == null)
            {
                return BadRequest("Order not found.");
            }

            // Kiểm tra User2
            if (tradingOrder.User1 != user1Id)
            {
                return BadRequest("You are not authorized to update this order.");
            }

            // Cập nhật trạng thái
            tradingOrder.Status = 3;
            await _contactService.CloseContactAsync(user1Id, tradingOrder.User2);

            // Thông tin User1
            var user1 = await _context.Users
                              .Where(u => u.UserId == user1Id)
                              .FirstOrDefaultAsync();
            if (user1 == null)
            {
                return BadRequest("User1 not found.");
            }

            // Tính toán avg BuyRating và số lần mua thành công của User1
            var buyRatingUser1 = ((user1.BuyTimes * user1.BuyRating) + 5) / (user1.BuyTimes + 1);
            var buyTimesUser1 = user1.BuyTimes + 1;

            // Cập nhật thông tin của User1 và lưu BuyRating
            user1.BuyRating = buyRatingUser1;
            user1.BuyTimes = buyTimesUser1;

            // Thông tin User2
            var user2 = await _context.Users
                              .Where(u => u.UserId == tradingOrder.User2)
                              .FirstOrDefaultAsync();
            if (user2 == null)
            {
                return BadRequest("User2 not found.");
            }

            // Tính toán avg SellRating và số lần bán thành công của User2
            var sellRatingUser2 = ((user2.SellTimes * user2.SellRating) + 5) / (user2.SellTimes + 1);
            var sellTimesUser2 = user2.SellTimes + 1;

            // Cập nhật thông tin của User2
            user2.SellRating = sellRatingUser2;
            user2.SellTimes = sellTimesUser2;

            // Lưu các thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();

            return NoContent();
        }



        [HttpGet("user1/TradingOrder")]
        public async Task<IActionResult> TradingOrder(
     [FromQuery] int? tab = null,
     [FromQuery] string? sortBy = null)
        {
            // Lấy User1 từ claims
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return BadRequest("User ID not found in claims.");
            }
            if (!int.TryParse(userIdClaim.Value, out var user1Id))
            {
                return Unauthorized("Invalid user ID claim.");
            }

            // Lấy danh sách trading orders từ repository
            var tradingOrders = await _tradingRepo.GetTradingOrdersByUser1IdAsync(user1Id);
            if (tradingOrders == null || !tradingOrders.Any())
            {
                return NotFound("No trading orders found for this user.");
            }

            // Lọc theo trạng thái nếu tab được cung cấp
            if (tab.HasValue)
            {
                tradingOrders = tab.Value switch
                {
                    1 => tradingOrders, // tab = 1 lấy tất cả
                    2 => tradingOrders.Where(order => order.Status == 0).ToList(), // tab = 2 lấy status = 0
                    3 => tradingOrders.Where(order => order.Status == 1).ToList(), // tab = 3 lấy status = 1
                    4 => tradingOrders.Where(order => order.Status == 3).ToList(), // tab = 4 lấy status = 3
                    5 => tradingOrders.Where(order => order.Status == 2).ToList(), // tab = 5 lấy status = 2
                    _ => null
                };

                if (tradingOrders == null)
                {
                    return BadRequest("Invalid tab value.");
                }

                if (!tradingOrders.Any())
                {
                    return NotFound($"No orders found with the specified criteria for tab = {tab.Value}.");
                }
            }

            // Sắp xếp theo sortBy parameter
            tradingOrders = sortBy switch
            {
                "date" => tradingOrders.OrderByDescending(order => order.CreatedDate).ToList(),
                "oldDate" => tradingOrders.OrderBy(order => order.CreatedDate).ToList(),
                _ => tradingOrders
            };

            // Lấy danh sách userId và productId từ các đơn hàng
            var userIds = tradingOrders.SelectMany(order => new[] { order.User1, order.User2 }).Distinct();
            var users = await _userRepo.GetUsersByIdsAsync(userIds);

            var productIds = tradingOrders.SelectMany(order => order.TradingOrderDetails.Select(detail => detail.ProductId)).Distinct();
            var products = await _productRepo.GetProductsByIdsAsync(productIds);

            // Tạo cấu trúc phản hồi
            var tradingOrderDtos = tradingOrders.Select(order => new
            {
                TradingOrderId = order.TradingOrderId,
                User1 = users.Where(u => u.UserId == order.User1).Select(u => new
                {
                    u.UserId,
                    u.FullName,
                    u.Avarta
                }).FirstOrDefault(),
                User1TradingOrderDetails = order.TradingOrderDetails.Where(detail => detail.OwnerId == order.User1).Select(detail => new
                {
                    detail.TradingOrderDetailId,
                    detail.ProductId,
                    detail.OwnerId,
                    detail.Quantity,
                    detail.Price,
                    Product = products.Where(p => p.ProductId == detail.ProductId).Select(p => new
                    {
                        p.ProductId,
                        p.ProductName,
                        p.Price,
                        p.ImageLink,
                        p.StoredQuantity
                    }).FirstOrDefault()
                }).ToList(),
                User2 = users.Where(u => u.UserId == order.User2).Select(u => new
                {
                    u.UserId,
                    u.FullName,
                    u.Avarta
                }).FirstOrDefault(),
                User2TradingOrderDetails = order.TradingOrderDetails.Where(detail => detail.OwnerId == order.User2).Select(detail => new
                {
                    detail.TradingOrderDetailId,
                    detail.ProductId,
                    detail.OwnerId,
                    detail.Quantity,
                    detail.Price,
                    Product = products.Where(p => p.ProductId == detail.ProductId).Select(p => new
                    {
                        p.ProductId,
                        p.ProductName,
                        p.Price,
                        p.ImageLink,
                        p.StoredQuantity
                    }).FirstOrDefault()
                }).ToList(),
                order.Note,
                order.CreatedDate,
                order.Status
            }).ToList();

            return Ok(tradingOrderDtos);
        }





        [HttpGet("user2/TradingOrderRequest")]
        public async Task<IActionResult> TradingOrderRequest(
    [FromQuery] int? tab = null,
    [FromQuery] string? sortBy = null)
        {
            // Lấy User2 từ claims
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found.");
            }

            if (!int.TryParse(userIdClaim.Value, out var user2Id))
            {
                return Unauthorized("Invalid user ID claim.");
            }

            // Lấy danh sách trading orders từ repository
            var tradingOrders = await _tradingRepo.GetTradingOrdersByUser2IdAsync(user2Id);
            if (tradingOrders == null || !tradingOrders.Any())
            {
                return NotFound("No trading orders found for this user.");
            }

            // Lọc theo trạng thái nếu tab được cung cấp
            if (tab.HasValue)
            {
                tradingOrders = tab.Value switch
                {
                    1 => tradingOrders, // tab = 1 lấy tất cả
                    2 => tradingOrders.Where(order => order.Status == 0).ToList(), // tab = 2 lấy status = 0
                    3 => tradingOrders.Where(order => order.Status == 1).ToList(), // tab = 3 lấy status = 1
                    4 => tradingOrders.Where(order => order.Status == 3).ToList(), // tab = 4 lấy status = 3
                    5 => tradingOrders.Where(order => order.Status == 2).ToList(), // tab = 5 lấy status = 2
                    _ => null
                };

                if (tradingOrders == null)
                {
                    return BadRequest("Invalid tab value.");
                }

                if (!tradingOrders.Any())
                {
                    return NotFound($"No orders found with the specified criteria for tab = {tab.Value}.");
                }
            }

            // Sắp xếp theo sortBy parameter
            tradingOrders = sortBy switch
            {
                "date" => tradingOrders.OrderByDescending(order => order.CreatedDate).ToList(),
                "oldDate" => tradingOrders.OrderBy(order => order.CreatedDate).ToList(),
                _ => tradingOrders
            };

            // Lấy danh sách userId và productId từ các đơn hàng
            var userIds = tradingOrders.SelectMany(order => new[] { order.User1, order.User2 }).Distinct();
            var users = await _userRepo.GetUsersByIdsAsync(userIds);

            var productIds = tradingOrders.SelectMany(order => order.TradingOrderDetails.Select(detail => detail.ProductId)).Distinct();
            var products = await _productRepo.GetProductsByIdsAsync(productIds);

            // Tạo cấu trúc phản hồi
            var tradingOrderDtos = tradingOrders.Select(order => new
            {
                TradingOrderId = order.TradingOrderId,
                User1 = users.Where(u => u.UserId == order.User1).Select(u => new
                {
                    u.UserId,
                    u.FullName,
                    u.Avarta
                }).FirstOrDefault(),
                User1TradingOrderDetails = order.TradingOrderDetails.Where(detail => detail.OwnerId == order.User1).Select(detail => new
                {
                    detail.TradingOrderDetailId,
                    detail.ProductId,
                    detail.OwnerId,
                    detail.Quantity,
                    detail.Price,
                    Product = products.Where(p => p.ProductId == detail.ProductId).Select(p => new
                    {
                        p.ProductId,
                        p.ProductName,
                        p.Price,
                        p.ImageLink,
                        p.StoredQuantity
                    }).FirstOrDefault()
                }).ToList(),
                User2 = users.Where(u => u.UserId == order.User2).Select(u => new
                {
                    u.UserId,
                    u.FullName,
                    u.Avarta
                }).FirstOrDefault(),
                User2TradingOrderDetails = order.TradingOrderDetails.Where(detail => detail.OwnerId == order.User2).Select(detail => new
                {
                    detail.TradingOrderDetailId,
                    detail.ProductId,
                    detail.OwnerId,
                    detail.Quantity,
                    detail.Price,
                    Product = products.Where(p => p.ProductId == detail.ProductId).Select(p => new
                    {
                        p.ProductId,
                        p.ProductName,
                        p.Price,
                        p.ImageLink,
                        p.StoredQuantity
                    }).FirstOrDefault()
                }).ToList(),
                order.Note,
                order.CreatedDate,
                order.Status
            }).ToList();

            return Ok(tradingOrderDtos);
        }



    }
}



