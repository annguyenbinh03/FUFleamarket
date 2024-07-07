using DTO.TradingOrderDto;
using Microsoft.AspNetCore.Mvc;
using Repository.Interfaces;
using DTO.Mappers;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TradingOrderController : ControllerBase
    {
        private readonly ITradingOrderRepository _tradingRepo;

        public TradingOrderController(ITradingOrderRepository tradingRepo)
        {
            _tradingRepo = tradingRepo;
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
