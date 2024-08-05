﻿using BusinessObjects.Models;
using BusinessObjects;
using BusinessObjects.Mappers;
using BusinessObjects.MessageDto;
using BusinessObjects.OrderDto;
using BusinessObjects.UserDto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using Repository.Interfaces;

using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;
using System.Security.Claims;
using System.Globalization;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore;
using Service.ContactCheck;
using Service.ContactCheck.Interfaces;
using Service.CheckProductHasActiveOrder.Interfaces;
using Service.BackgroudService;



namespace WebAPI.Controllers
{

    [Route("api/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository _orderRepo;
        private readonly IUserRepository _userRepo;
        private readonly IProductReposity _productRepo;
        private readonly FufleaMarketContext _context;
        private readonly IContactService _contactService;
        private readonly ICheckProduct _checkProduct;
        private readonly StatusOrderService _statusOrderService;
        public OrderController(IOrderRepository orderRepo, IUserRepository userRepo, IProductReposity productRepo, FufleaMarketContext context, IContactService contactService,ICheckProduct checkProduct, StatusOrderService statusOrderService)
        {
            _orderRepo = orderRepo;
            _userRepo = userRepo;
            _productRepo = productRepo;
            _context = context;
            _contactService = contactService;
            _checkProduct = checkProduct;
            _statusOrderService = statusOrderService;
        }

        [HttpGet("soldRequest")]
        public async Task<IActionResult> GetMySoldRequestOrders([FromQuery] int? productId, [FromQuery] int? tab = null, [FromQuery] string? sortBy = null)
        {
                  //Xác Thực Người Dùng
                  //Lấy claim UserId từ các claim của người dùng.
                  //Nếu không tìm thấy UserId, trả về trạng thái Unauthorized
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found");
            }

            var userId = int.Parse(userIdClaim.Value);

             // var soldOrders: Đây là biến dùng để lưu trữ kết quả trả về, đó là danh sách các đơn hàng đã bán.
            //await: Từ khóa này được sử dụng để chờ đợi kết quả của một phương thức bất đồng bộ(async), đảm bảo rằng phương thức hoàn thành trước khi tiếp tục thực hiện các câu lệnh tiếp theo.
            //_orderRepo.GetOrdersByUserId(userId): Đây là phương thức trong repository(_orderRepo) để lấy danh sách các đơn hàng dựa trên userId.
            var soldOrders = await _orderRepo.GetOrdersByUserId(userId); 

            if (!soldOrders.Any())
            {
                return NotFound("No orders found for the user.");
            }

            
            if (productId.HasValue)
            {
                //Nếu productId được cung cấp, lọc danh sách đơn hàng theo productId
                soldOrders = soldOrders.Where(order => order.Product.ProductId == productId).ToList();

                if (!soldOrders.Any())
                {
                    return NotFound($"No orders found for the product with ID {productId}.");
                }
            }

            //Lọc Theo tab:
           // Nếu tab được cung cấp, lọc danh sách đơn hàng theo trạng thái cụ thể.
            if (tab.HasValue)
            {
                soldOrders = tab.Value switch
                {
                    1 => soldOrders, // tab = 1 lấy tất cả
                    2 => soldOrders.Where(order => (int)order.Status == 0).ToList(), // tab = 2 lấy status = 0
                    3 => soldOrders.Where(order => (int)order.Status == 1).ToList(), // tab = 3 lấy status = 1
                    4 => soldOrders.Where(order => (int)order.Status == 3).ToList(), // tab = 4 lấy status = 3
                    5 => soldOrders.Where(order => (int)order.Status == 2).ToList(), // tab = 5 lấy status = 2
                    _ => null
                };

                if (soldOrders == null)
                {
                    return BadRequest("Invalid tab value.");
                }

                if (!soldOrders.Any())
                {
                    return NotFound($"No orders found with the specified criteria for tab = {tab.Value}.");
                }
            }



            //Sắp Xếp Theo sortBy:

            //Nếu sortBy được cung cấp, sắp xếp danh sách đơn hàng theo tiêu chí cụ thể.
                       
                        soldOrders = sortBy switch
            {
                "date" => soldOrders.OrderByDescending(order => order.CreatedDate).ToList(),
                "oldDate" => soldOrders.OrderBy(order => order.CreatedDate).ToList(),
                "price" => soldOrders.OrderByDescending(order => order.Price).ToList(),
                "lowPrice" => soldOrders.OrderBy(order => order.Price).ToList(),
                _ => soldOrders
            };
            //Chuẩn Bị Dữ Liệu Trả Về:

            //Chuyển đổi danh sách đơn hàng thành định dạng DTO(Data Transfer Object) để trả về cho client.
            //thực hiện chức năng chuyển đổi dữ liệu và trả về kết quả dưới dạng HTTP Response
            var orders = soldOrders.Select(order => new
            {
                Order = order.ToOrderShowProfileOfBuyerDTO(),
                Product = new
                {
                    ProductId = order.Product.ProductId,
                    ProductName = order.Product.ProductName,
                    Price = order.Product.Price,
                    ImageLink = order.Product.ImageLink,
                    StoredQuantity = order.Product.StoredQuantity
                    
                },
                Buyer = new
                {
                    Avarta = order.Buyer.Avarta,
                    FullName = order.Buyer.FullName
                    
                },
                
            }).ToList();
            return Ok(orders);
        }

        [HttpGet("sold")]
        public async Task<IActionResult> GetSoldOrders([FromQuery] string? sortBy = null, [FromQuery] bool descending = false)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found");
            }

            var userId = int.Parse(userIdClaim.Value);

           
            bool sortByDate = sortBy?.ToLower() == "date";
            bool sortByPrice = sortBy?.ToLower() == "price";

            var soldOrders = await _orderRepo.GetOrdersBySellerIdAsync(userId, sortByDate, sortByPrice, descending);

            if (!soldOrders.Any())
            {
                return NotFound("No bills.");
            }

            var orders = soldOrders.Select(order => new
            {
                order = order.ToOrderShowProfileOfBuyerDTO(),
                Product = new
                {
                    productId = order.Product.ProductId,
                    productName = order.Product.ProductName,
                    productPrice = order.Product.Price,
                    ImageLink = order.Product.ImageLink
                },
                Buyer = new
                {
                    avarta = order.Buyer.Avarta,
                    name = order.Buyer.FullName
                }
            }).ToList();

            return Ok(orders);
        }
        [HttpGet("SoldStatus0")]
        public async Task<IActionResult> GetSoldOrdersStatus0([FromQuery] string? sortBy = null, [FromQuery] bool descending = false)
        {

            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found");
            }

            var userId = int.Parse(userIdClaim.Value);

            bool sortByDate = sortBy?.ToLower() == "date";
            bool sortByPrice = sortBy?.ToLower() == "price";

            var soldOrders = await _orderRepo.GetOrdersBySellerIdAsync(userId, sortByDate, sortByPrice, descending);

            var filteredOrders = soldOrders.Where(order => order.Status == 0);

            if (!filteredOrders.Any())
            {
                return NotFound("No bills.");
            }

            var orders = filteredOrders.Select(order => new
            {
                order = order.ToOrderShowProfileOfBuyerDTO(),
                Product = new
                {
                    productId = order.Product.ProductId,
                    productName = order.Product.ProductName,
                    productPrice = order.Product.Price
                }
            }).ToList();

            return Ok(orders);
        }

        [HttpGet("SoldStatus123")]
        public async Task<IActionResult> GetSoldOrdersSatus123([FromQuery] string? sortBy = null, [FromQuery] bool descending = false)
        {
 
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found");
            }

            var userId = int.Parse(userIdClaim.Value);

            bool sortByDate = sortBy?.ToLower() == "date";
            bool sortByPrice = sortBy?.ToLower() == "price";
            
            var soldOrders = await _orderRepo.GetOrdersBySellerIdAsync(userId, sortByDate, sortByPrice, descending);

            var filteredOrders = soldOrders.Where(order => order.Status == 1 || order.Status == 2 || order.Status == 3);

            if (!filteredOrders.Any())
            {
                return NotFound("No bills.");
            }

            var orders = filteredOrders.Select(order => new
            {
                order = order.ToOrderShowProfileOfBuyerDTO(),
                Product = new
                {
                    productId = order.Product.ProductId,
                    productName = order.Product.ProductName,
                    productPrice = order.Product.Price,
                 ImageLink = order.Product.ImageLink
                },
                Buyer = new
                {
                    avarta = order.Buyer.Avarta,
                    name = order.Buyer.FullName
                }
            }).ToList();

            return Ok(orders);
        }


        [HttpGet("admingetorders")]
        [Authorize]
        public async Task<IActionResult> AdminGetAllOrders()
        {
            List<Order> soldOrders = await _orderRepo.GetAllOrderAsync();
            var orders = soldOrders.Select(soldOrders => new
            {
                    // used Testing
            }).ToList();
            return Ok(orders);
        }

        [HttpGet("bought")]
        public async Task<IActionResult> GetBoughtOrders([FromQuery] int? tab = null, [FromQuery] string? sortBy = null)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found");
            }

            var userId = int.Parse(userIdClaim.Value);

            var boughtOrders = await _orderRepo.GetOrdersByBuyerIdAsync(userId);

            if (!boughtOrders.Any())
            {
                return NotFound("No bills.");
            }

            // Apply status filter if tab parameter is provided
            if (tab.HasValue)
            {
                boughtOrders = tab.Value switch
                {
                    1 => boughtOrders, // tab = 1 lấy tất cả
                    2 => boughtOrders.Where(order => (int)order.Status == 0).ToList(), // tab = 2 lấy status = 0
                    3 => boughtOrders.Where(order => (int)order.Status == 1).ToList(), // tab = 3 lấy status = 1
                    4 => boughtOrders.Where(order => (int)order.Status == 3).ToList(), // tab = 4 lấy status = 3
                    5 => boughtOrders.Where(order => (int)order.Status == 2).ToList(), // tab = 5 lấy status = 2
                    _ => null
                };

                if (boughtOrders == null)
                {
                    return BadRequest("Invalid tab value.");
                }

                if (!boughtOrders.Any())
                {
                    return NotFound($"No orders found with the specified criteria for tab = {tab.Value}.");
                }
            }

            // Apply sorting based on sortBy parameter
            boughtOrders = sortBy switch
            {
                "date" => boughtOrders.OrderByDescending(order => order.CreatedDate).ToList(),
                "oldDate" => boughtOrders.OrderBy(order => order.CreatedDate).ToList(),
                "price" => boughtOrders.OrderByDescending(order => order.Price).ToList(),
                "lowPrice" => boughtOrders.OrderBy(order => order.Price).ToList(),
                _ => boughtOrders
            };

            var orders = boughtOrders.Select(boughtOrder => new
            {
                order = boughtOrder.ToOrderShowProfileOfSellerDTO(),
                Product = new
                {
                    productId = boughtOrder.Product.ProductId,
                    productName = boughtOrder.Product.ProductName,
                    productPrice = boughtOrder.Product.Price,
                    ImageLink = boughtOrder.Product.ImageLink
                }
            }).ToList();

            return Ok(orders);
        }


        [HttpGet("BoughtStatus0")]
        public async Task<IActionResult> GetBoughtOrdersStatus0([FromQuery] string? sortBy = null, [FromQuery] bool descending = false)
        {
            
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found");
            }

            var userId = int.Parse(userIdClaim.Value);

            
            bool sortByDate = sortBy?.ToLower() == "date";
            bool sortByPrice = sortBy?.ToLower() == "price";

            
            var boughtOrders = await _orderRepo.GetOrdersByBuyerIdAsync(userId, sortByDate, sortByPrice, descending);

            
            var filteredOrders = boughtOrders.Where(order => order.Status == 0);

            if (!filteredOrders.Any())
            {
                return NotFound("No bills.");
            }

            var orders = filteredOrders.Select(boughtOrder => new
            {
                order = boughtOrder.ToOrderShowProfileOfSellerDTO(),
                Product = new
                {
                    productId = boughtOrder.Product.ProductId,
                    productName = boughtOrder.Product.ProductName,
                    productPrice = boughtOrder.Product.Price
                }
            }).ToList();

            return Ok(orders);
        }

        [HttpGet("BoughtStatus123")]
        public async Task<IActionResult> GetBoughtOrdersStatus123([FromQuery] string? sortBy = null, [FromQuery] bool descending = false)
        {

            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found");
            }

            var userId = int.Parse(userIdClaim.Value);

            bool sortByDate = sortBy?.ToLower() == "date";
            bool sortByPrice = sortBy?.ToLower() == "price";

            var boughtOrders = await _orderRepo.GetOrdersByBuyerIdAsync(userId, sortByDate, sortByPrice, descending);

            var filteredOrders = boughtOrders.Where(order => order.Status == 1 || order.Status == 2 || order.Status == 3);

            if (!filteredOrders.Any())
            {
                return NotFound("No bills.");
            }

            var orders = filteredOrders.Select(boughtOrder => new
            {
                order = boughtOrder.ToOrderShowProfileOfSellerDTO(),
                Product = new
                {
                    productId = boughtOrder.Product.ProductId,
                    productName = boughtOrder.Product.ProductName,
                    productPrice = boughtOrder.Product.Price,
                    ImageLink = boughtOrder.Product.ImageLink
                },
                Buyer = new
                {
                    avarta = boughtOrder.Buyer.Avarta,
                    name = boughtOrder.Buyer.FullName
                }
            }).ToList();

            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByOrderId([FromRoute] int id)
        {
            var orders = await _orderRepo.GetByOrderIdAsync(id);
            if (orders == null)
            {
                return NotFound();
            }
            return Ok(orders.ToOrderDTO());
        }
        [HttpPost]
        [Authorize]
        //createDTO là dữ liệu đầu vào được gửi từ client để tạo đơn hàng mới
        public async Task<IActionResult> Create([FromBody] CreateOrderRequestDto createDTO)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found");
            }

            var userId = int.Parse(userIdClaim.Value);

            //Kiểm tra và lấy thông tin sản phẩm:
            var product = await _productRepo.GetProductById(createDTO.ProductId);
            if (product == null)
            {
                return BadRequest("ProductId does not exist");
            }

            // Kiểm tra xem số lượng yêu cầu (Quantity trong createDTO) có hợp lệ không. Yêu cầu phải lớn hơn 0 và nhỏ hơn số lượng tồn kho (StoredQuantity) của sản phẩm
            if (createDTO.Quantity <= 0 || createDTO.Quantity > product.StoredQuantity)
            {
                return BadRequest("Invalid quantity requested");
            }

            // Đặt BuyerId là UserId của người dùng đã đăng nhập
            var buyerId = userId;
            //Lấy SellerId từ thông tin của sản phẩm
            var sellerId = product.SellerId; 
            

            // Tạo đối tượng orderModel từ dữ liệu createDTO và thông tin buyerId, sellerId.
            var orderModel = createDTO.ToOrderFromCreateDTO(buyerId, sellerId);

            // Gọi repository (_orderRepo) để lưu đơn đặt hàng mới vào cơ sở dữ liệu.
            await _orderRepo.CreateOrderAsync(orderModel);

            // Chuyển đổi orderModel thành một DTO (orderDto) để trả về thông tin đơn hàng đã tạo.
            var orderDto = orderModel.ToOrderDTO();
            //được thiết lập để chắc chắn rằng thông tin này được gửi lại cho client
            orderDto.BuyerId = buyerId;
            orderDto.SellerId = sellerId;
            orderDto.ProductId = createDTO.ProductId;
            //thông tin chi tiết của đơn hàng vừa tạo. 
            //Điều này bao gồm một liên kết đến phương thức GetByOrderId để lấy thông tin chi tiết của đơn hàng theo OrderId.
            return CreatedAtAction(nameof(GetByOrderId), new { id = orderModel.OrderId }, orderDto);
        }


        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> UpdateOrder([FromRoute] int id, [FromBody] UpdateOrderRequestDto updateOrder)
        {
            var orderModel = await _orderRepo.UpdateOrderAsync(id, updateOrder);
            if (orderModel == null)
            {
                return NotFound();
            }
            return NoContent();
        }
        [HttpPut]
        [Route("acceptOrderRequest/{orderId}")]
        public async Task<IActionResult> AcceptOrderRequset([FromRoute] int orderId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found");
            }

            var userId = int.Parse(userIdClaim.Value);

            //_orderRepo:  chịu trách nhiệm truy cập với cơ sở dữ liệu hoặc một nguồn dữ liệu khác để thao tác với các đối tượng Order.
            var order = await _orderRepo.GetByOrderIdAsync(orderId);
            if (order == null)
            {
                return BadRequest("Order not found");
            }

            // Check if the order status is 0
            if (order.Status != 0)
            {
                return BadRequest("Only orders with status 0 can be accepted");
            }

            // Check if the logged-in user is the seller of the product
            if (order.SellerId != userId)
            {
                return BadRequest("Only the seller can accept the order request");
            }

            // Get the product details to update the storedQuantity
            var product = await _productRepo.GetProductById(order.ProductId);
            if (product == null)
            {
                return BadRequest("Product not found");
            }

            //  kiểm tra xem số lượng sản phẩm được đặt hàng (order.Quantity) có vượt quá số lượng sản phẩm hiện có trong kho (product.StoredQuantity) hay không
            if (order.Quantity > product.StoredQuantity)
            {
                return BadRequest("Ordered quantity exceeds the stored quantity");
            }

            // Reduce the storedQuantity by the order quantity and accept the order
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    bool updateResult = await _productRepo.UpdateProductQuantityAsync(product.ProductId, order.Quantity);
                    if (!updateResult)
                    {
                        return BadRequest("Failed to update product quantity");
                    }

                    bool result = await _orderRepo.AcceptOrderAsync(userId, orderId);
                    if (!result)
                    {
                        return BadRequest("Failed to accept the order request");
                    }

                    await transaction.CommitAsync();
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    return StatusCode(500, "Internal server error");
                }
            }
            await _contactService.OpenContactAsync(userId, order.BuyerId);
            // Lấy thời gian hiện tại khi người dùng accept
            var acceptTime = DateTime.Now;
            Console.WriteLine($"Order accepted at: {acceptTime}");

            // Chạy background job sau khi các tác vụ chính đã hoàn tất
            Task.Run(() => _statusOrderService.RunBackgroundJobForOrder(orderId, acceptTime));
            return Ok("Order request accepted and product quantity updated");
        }
        [HttpPut]
        [Route("denyOrderRequest/{productId}")]
        public async Task<IActionResult> DenyOrderRequest([FromRoute] int productId)
        {
            var userIdClaim = User.FindFirstValue("UserId");
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user ID format");
            }
            bool result = await _orderRepo.DenyOrderAsync(userId, productId);
            if (result)
            {
                return Ok();
            }
            return BadRequest();

        }
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var orderModel = await _orderRepo.DeleteOrderAsync(id);
            if (orderModel == null)
            {
                return NotFound();
            }
            return NoContent();
        }
        [HttpGet("admin/orders")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AdminGetAllOrders([FromQuery] int? status )
        {
            //Kiểm tra tính hợp lệ của Model State. Nếu không hợp lệ, trả về kết quả BadRequest với thông tin ModelState.
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            //Tạo một truy vấn trên bảng Orders từ context cơ sở dữ liệu (_context)
            IQueryable<Order> query = _context.Orders.AsQueryable();
            //Kiểm tra giá trị của status
            if (status.HasValue)
            {
                query = query.Where(o => o.Status == status.Value);
            }
            else
            {
                //thêm điều kiện vào truy vấn để lấy những đơn hàng có Status là 0, 1 hoặc 2.
                query = query.Where(o => o.Status == 0 || o.Status == 1 || o.Status ==2);
            }
            // truy vấn để lấy danh sách các đơn hàng từ cơ sở dữ liệu, chuyển đổi dữ liệu thành định dạng mong muốn và trả về kết quả cho client
            var result = await query.Select(order => new
            {
                OrderId = order.OrderId,
                Price = order.Price,
                PaymentMethod = order.PaymentMethod,
                Status = order.Status,
                Note = order.Note,
                Quantity = order.Quantity,
                ReceiverAddress = order.ReceiverAddress,
                CreatedDate = order.CreatedDate,
                Buyer = new
                {
                    BuyerID = order.BuyerId,
                    FullName = order.Buyer.FullName,
                    Avatar = order.Buyer.Avarta
                },
                Seller =  new
                {
                    SellerID = order.SellerId,
                    Name = order.Seller.FullName,
                    Avatar = order.Seller.Avarta
                },
                Product = new
                {
                    ProductId = order.Product.ProductId,
                    ProductName = order.Product.ProductName,
                    ImageLink = order.Product.ImageLink
                }
            }).ToListAsync();
            if(!result.Any()) //Kiểm tra xem danh sách kết quả có rỗng hay không.
            {
                return BadRequest("No order here");
            }

            return Ok(result);
        }
        [HttpPut]
        [Route("completeOrder/{orderId}")]
        public async Task<IActionResult> CompleteOrder([FromRoute] int orderId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found");
            }

            var userId = int.Parse(userIdClaim.Value);

            var order = await _orderRepo.GetByOrderIdAsync(orderId);
            if (order == null)
            {
                return BadRequest("Order not found");
            }

            
            if (order.Status != 1)
            {
                return BadRequest("Only orders with status 1 can be marked as completed");
            }

            
            if (order.BuyerId != userId)
            {
                return BadRequest("Only the buyer can complete the order");
            }

            
            order.Status = 3;

           
            bool updateResult = await _orderRepo.UpdateOrderAsync(order.OrderId, order);
            if (!updateResult)
            {
                return BadRequest("Failed to complete the order");
            }
            await _contactService.CloseContactAsync(userId, order.SellerId);
            // Thông tin User1
            var user1 = await _context.Users
                              .Where(u => u.UserId == order.BuyerId)
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
                              .Where(u => u.UserId == order.SellerId)
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
            return Ok("Order completed successfully");
        }
        [HttpPut]
        [Route("rejectOrder/{orderId}")]
        public async Task<IActionResult> RejectOrder([FromRoute] int orderId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found");
            }

            var userId = int.Parse(userIdClaim.Value);

            // Get the order details to know the status and quantity
            var order = await _orderRepo.GetByOrderIdAsync(orderId);
            if (order == null)
            {
                return BadRequest("Order not found");
            }

            // Check if the order status is 1
            if (order.Status != 1)
            {
                return BadRequest("Only orders with status 1 can be rejected");
            }

            // Check if the logged-in user is the seller of the product
            if (order.SellerId != userId)
            {
                return BadRequest("Only the seller can reject the order request");
            }

            // Get the product details to update the storedQuantity
            var product = await _productRepo.GetProductById(order.ProductId);
            if (product == null)
            {
                return BadRequest("Product not found");
            }

            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    bool result = await _orderRepo.RejectOrderAsync(userId, orderId);
                    if (!result)
                    {
                        return BadRequest("Failed to reject the order request");
                    }

                    // Add back the temporary quantity to storedQuantity
                    bool updateResult = await _productRepo.UpdateProductTemporaryQuantityAsync(product.ProductId, order.Quantity);
                    if (!updateResult)
                    {
                        return BadRequest("Failed to update product temporary quantity");
                    }

                    await transaction.CommitAsync();
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    return StatusCode(500, "Internal server error");
                }
            }
            await _contactService.CloseContactAsync(userId, order.BuyerId);
            // Thông tin User2
            var user2 = await _context.Users
                              .Where(u => u.UserId == order.SellerId)
                              .FirstOrDefaultAsync();
            if (user2 == null)
            {
                return BadRequest("User2 not found.");
            }

            // Tính toán avg SellRating và số lần bán thành công của User2
            var sellRatingUser2 = (user2.SellTimes * user2.SellRating)  / (user2.SellTimes + 1);
            var sellTimesUser2 = user2.SellTimes + 1;

            // Cập nhật thông tin của User2
            user2.SellRating = sellRatingUser2;
            user2.SellTimes = sellTimesUser2;

            // Lưu các thay đổi vào cơ sở dữ liệu
            await _context.SaveChangesAsync();
            return Ok("Order request rejected and product quantity updated");
        }
        [HttpPut]
        [Route("rejectOrderByBuyer/{orderId}")]
        public async Task<IActionResult> RejectOrderByBuyer([FromRoute] int orderId)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found");
            }

            var userId = int.Parse(userIdClaim.Value);

            // Get the order details to know the status and ensure the user is the buyer
            var order = await _orderRepo.GetByOrderIdAsync(orderId);
            if (order == null)
            {
                return BadRequest("Order not found");
            }

            // Check if the logged-in user is the buyer of the order
            if (order.BuyerId != userId)
            {
                return BadRequest("Only the buyer can reject the order");
            }

            // Check if the order status allows it to be rejected (e.g., status 1)
            if (order.Status != 1)
            {
                return BadRequest("Only orders with status 1 can be rejected");
            }

            // Update the order status to 2 (rejected by buyer)
            order.Status = 2;

            // Save the changes to the database
            bool updateResult = await _orderRepo.UpdateOrderAsync(order.OrderId, order);
            if (!updateResult)
            {
                return BadRequest("Failed to reject the order");
            }

            if (order != null)
            {
                await _contactService.CloseContactAsync(userId, order.SellerId);
            }

            // Thông tin User1
            var user1 = await _context.Users
                              .Where(u => u.UserId == userId)
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
            return Ok("Order rejected successfully");
        }
        [HttpGet]
        [Route("CheckProductHasActiveOrder/{id}")]
        public async Task<IActionResult> CheckProductHasActiveOrder(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid product ID.");
            }

            var existProduct = await _checkProduct.CheckProductHasAnyActiveOrderAsync(id);

            // Xử lý kết quả trả về từ phương thức dịch vụ
            if (!existProduct)
            {
                return NotFound($"Product with ID {id} does not have any active orders.");
            }

            return Ok("Product has active orders.");
        }
    


    }
}

