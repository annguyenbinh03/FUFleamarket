using BusinessObjects.Models;
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

        public OrderController(IOrderRepository orderRepo, IUserRepository userRepo, IProductReposity productRepo, FufleaMarketContext context, IContactService contactService)
        {
            _orderRepo = orderRepo;
            _userRepo = userRepo;
            _productRepo = productRepo;
            _context = context;
            _contactService = contactService;
        }

        [HttpGet("soldRequest")]
        public async Task<IActionResult> GetMySoldRequestOrders([FromQuery] int? productId, [FromQuery] int? tab = null, [FromQuery] string? sortBy = null)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found");
            }

            var userId = int.Parse(userIdClaim.Value);

            var soldOrders = await _orderRepo.GetOrdersByUserId(userId); // Assuming you have a method to get orders by user ID

            if (!soldOrders.Any())
            {
                return NotFound("No orders found for the user.");
            }

            // Apply productId filter if productId parameter is provided
            if (productId.HasValue)
            {
                soldOrders = soldOrders.Where(order => order.Product.ProductId == productId).ToList();

                if (!soldOrders.Any())
                {
                    return NotFound($"No orders found for the product with ID {productId}.");
                }
            }

            // Apply status filter if status parameter is provided
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



            // Apply sorting based on sortBy parameter
            soldOrders = sortBy switch
            {
                "date" => soldOrders.OrderByDescending(order => order.CreatedDate).ToList(),
                "oldDate" => soldOrders.OrderBy(order => order.CreatedDate).ToList(),
                "price" => soldOrders.OrderByDescending(order => order.Price).ToList(),
                "lowPrice" => soldOrders.OrderBy(order => order.Price).ToList(),
                _ => soldOrders
            };

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
                    // Add more properties as needed
                },
                Buyer = new
                {
                    Avarta = order.Buyer.Avarta,
                    FullName = order.Buyer.FullName
                    // Add more properties as needed
                },
                // Add more properties from Order model as needed
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
        public async Task<IActionResult> Create([FromBody] CreateOrderRequestDto createDTO)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found");
            }

            var userId = int.Parse(userIdClaim.Value);

            // Fetch the product details to get the SellerId and StoredQuantity
            var product = await _productRepo.GetProductById(createDTO.ProductId);
            if (product == null)
            {
                return BadRequest("ProductId does not exist");
            }

            // Check if requested quantity is valid
            if (createDTO.Quantity <= 0 || createDTO.Quantity >= product.StoredQuantity)
            {
                return BadRequest("Invalid quantity requested");
            }

            // Set BuyerId as the logged-in user's UserId
            var buyerId = userId;
            var sellerId = product.SellerId; // Assuming the Product entity has a SellerId field
            createDTO.CreatedDate = DateTime.Now;

            // Create the order model from the DTO
            var orderModel = createDTO.ToOrderFromCreateDTO(buyerId, sellerId);

            // Save the order to the database
            await _orderRepo.CreateOrderAsync(orderModel);

            // Return the created order details including BuyerId, SellerId, and ProductId
            var orderDto = orderModel.ToOrderDTO();
            orderDto.BuyerId = buyerId;
            orderDto.SellerId = sellerId;
            orderDto.ProductId = createDTO.ProductId;

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

            // Get the order details to know the status and quantity
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

            // Check if the ordered quantity is less than or equal to the stored quantity
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
           if(!ModelState.IsValid)
                return BadRequest(ModelState);

           IQueryable<Order> query = _context.Orders.AsQueryable();
            if(status.HasValue)
            {
                query = query.Where(o => o.Status == status.Value);
            }
            else
            {
                query = query.Where(o => o.Status == 0 || o.Status == 1 || o.Status ==2);
            }

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
            if(!result.Any())
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

            // Get the order details to know the status and quantity
            var order = await _orderRepo.GetByOrderIdAsync(orderId);
            if (order == null)
            {
                return BadRequest("Order not found");
            }

            // Check if the order status can be updated to 3 (order completed)
            if (order.Status != 1)
            {
                return BadRequest("Only orders with status 1 can be marked as completed");
            }

            // Check if the logged-in user is the seller of the product
            if (order.SellerId != userId)
            {
                return BadRequest("Only the seller can complete the order");
            }

            // Update the order status to 3 (completed)
            order.Status = 3;

            // Save the changes to the database
            bool updateResult = await _orderRepo.UpdateOrderAsync(order.OrderId, order);
            if (!updateResult)
            {
                return BadRequest("Failed to complete the order");
            }

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

            return Ok("Order rejected successfully");
        }
    }
}

