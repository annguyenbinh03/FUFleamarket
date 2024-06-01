using BusinessObjects.Models;
using DTO;
using DTO.Mappers;
using DTO.MessageDto;
using DTO.OrderDto;
using DTO.UserDto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using Repository.Interfaces;

using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;

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
        [HttpGet("sold")]
        public async Task<IActionResult> GetSoldOrders()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Không tìm thấy claim user ID");
            }

            var userId = int.Parse(userIdClaim.Value);

            var soldOrders = await _orderRepo.GetOrdersBySellerIdAsync(userId);
            var orders = soldOrders.Select(x => x.ToOrderDTO()).ToList();
            return Ok(orders);
        }

        [HttpGet("bought")]
        public async Task<IActionResult> GetBoughtOrders()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Không tìm thấy claim user ID");
            }

            var userId = int.Parse(userIdClaim.Value);

            var boughtOrders = await _orderRepo.GetOrdersByBuyerIdAsync(userId);
            var orders = boughtOrders.Select(x => x.ToOrderDTO()).ToList();
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
                return Unauthorized("Không tìm thấy claim user ID");
            }

            var userId = int.Parse(userIdClaim.Value);

            // Fetch the product details to get the SellerId
            var product = await _productRepo.GetProductById(createDTO.ProductId);
            if (product == null)
            {
                return BadRequest("ProductId does not exist");
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

