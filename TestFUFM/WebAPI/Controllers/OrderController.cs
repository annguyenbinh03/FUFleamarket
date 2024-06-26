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

namespace WebAPI.Controllers
{

    [Route("api/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository _orderRepo;
        private readonly IUserRepository _userRepo;
        private readonly IProductReposity _productRepo;

        public OrderController(IOrderRepository orderRepo, IUserRepository userRepo, IProductReposity productRepo)
        {
            _orderRepo = orderRepo;
            _userRepo = userRepo;
            _productRepo = productRepo;
        }

        [HttpGet("soldRequest")]
        public async Task<IActionResult> GetMySoldRequestOrders([FromQuery] int? productId, [FromQuery] string? sortBy = null, [FromQuery] bool descending = false)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found");
            }

            var userId = int.Parse(userIdClaim.Value);

            bool sortByDate = sortBy?.ToLower() == "date";
            bool sortByPrice = sortBy?.ToLower() == "price";

            var soldOrders = await _orderRepo.GetMyOrdersRequestBySellerIdAsync(userId, sortByDate, sortByPrice, descending);

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

            // Apply status filter (status = 0)
            soldOrders = soldOrders.Where(order => order.Status == 0).ToList();

            if (!soldOrders.Any())
            {
                return NotFound("No orders found with status = 0.");
            }

            var orders = soldOrders.Select(order => new
            {
                Order = order.ToOrderShowProfileOfBuyerDTO(),
                Product = new
                {
                    ProductId = order.Product.ProductId,
                    ProductName = order.Product.ProductName,
                    Price = order.Product.Price,
                    ImageLink = order.Product.ImageLink
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
        public async Task<IActionResult> GetBoughtOrders([FromQuery] string? sortBy = null, [FromQuery] bool descending = false)
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

            if (!boughtOrders.Any())
            {
                return NotFound("No bills.");
            }

            var orders = boughtOrders.Select(boughtOrder => new 
            {
                order = boughtOrder.ToOrderShowProfileOfSellerDTO(),
                Product = new
                {
                  productId =  boughtOrder.Product.ProductId,
                  productName = boughtOrder.Product.ProductName,
                  productPrice =  boughtOrder.Product.Price,
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
                return BadRequest("Only orders with status 0 can reduce the store quantity");
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

            // Call the repository method to accept the order
            bool result = await _orderRepo.AcceptOrderAsync(userId, orderId);
            if (!result)
            {
                return BadRequest("Failed to accept the order request");
            }

            // Reduce the storedQuantity by the order quantity
            bool updateResult = await _productRepo.UpdateProductQuantityAsync(product.ProductId, order.Quantity);
            if (!updateResult)
            {
                return BadRequest("Failed to update product quantity");
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
    }
}

