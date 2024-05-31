using BusinessObjects.Models;
using DTO;
using DTO.Mappers;
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

        public OrderController(IOrderRepository orderRepo)
        {
            _orderRepo = orderRepo;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllOrder()
        {
            var orderModel = await _orderRepo.GetAllOrderAsync();
            var orders = orderModel.Select(x => x.ToOrderDTO()).ToList();
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
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequestDto orderDto)
        {
            var existingOrder = await _orderRepo.GetByOrderIdAsync(orderDto.OrderId);
            if (existingOrder != null)
            {
                return BadRequest($"Order with OrderId {orderDto.OrderId} already exists.");
            }
            var orderModel = orderDto.ToOrderFromCreateDTO();
            await _orderRepo.CreateOrderAsync(orderModel);
            return CreatedAtAction(nameof(GetByOrderId), new { id = orderModel.BuyerId }, orderModel.ToOrderDTO());
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
            return Ok(orderModel.ToOrderDTO());
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

