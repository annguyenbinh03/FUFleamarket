using BusinessObjects.Models;
using DTO;
using DTO.Mappers;
using DTO.MessageDto;
using DTO.OrderDto;
using DTO.UserDto;
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

        public OrderController(IOrderRepository orderRepo, IUserRepository userRepo)
        {
            _orderRepo = orderRepo;
            _userRepo = userRepo;   
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
        [HttpPost("{BuyerId:int}/{SellerId:int}")]
        public async Task<IActionResult> Create([FromRoute] int BuyerId, [FromRoute] int SellerId, [FromBody] CreateOrderRequestDto createDTO)
        {
            if (!await _userRepo.UserExists(SellerId))
            {
                return BadRequest("SellerId does not exist");
            }
            if (!await _userRepo.UserExists(BuyerId))
            {
                return BadRequest("BuyerId does not exist");
            }

            var orderModel = createDTO.ToOrderFromCreateDTO(BuyerId, SellerId);
            await _orderRepo.CreateOrderAsync(orderModel);
            return CreatedAtAction(nameof(GetByOrderId), new { id = orderModel.OrderId }, orderModel.ToOrderDTO());
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

