using BusinessObjects.Models;
using DTO.Mappers;
using DTO.TradingOrderDetailDto;
using DTO.TradingOrderDto;
using Microsoft.AspNetCore.Mvc;
using Repository;
using Repository.Interfaces;
using System.Security.Claims;

namespace WebAPI.Controllers
{
    public class TradingOrderDetailController : ControllerBase
    {
        private readonly ITradingOrderDetailRepository _tradingOrderDetailRepo;
        private readonly ITradingOrderRepository _tradingOrderRepo;
        private readonly IProductReposity _productRepo;
        public TradingOrderDetailController(ITradingOrderDetailRepository tradingOrderDetailRepo, ITradingOrderRepository tradingOrderRepo, IProductReposity productRepo)
        {
            _tradingOrderDetailRepo = tradingOrderDetailRepo;
            _tradingOrderRepo = tradingOrderRepo;
            _productRepo = productRepo;
        }


        [HttpGet("mydetails")]
        public async Task<IActionResult> GetMyTradingOrderDetails()
        {
            // Retrieve the user ID from the claims
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found.");
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("Invalid user ID claim.");
            }

            // Retrieve trading order details owned by the user
            var tradingOrderDetails = await _tradingOrderDetailRepo.GetByUserIdAsync(userId);
            if (tradingOrderDetails == null || !tradingOrderDetails.Any())
            {
                return NotFound("No trading order details found for the user.");
            }

            var tradingOrderDetailDtos = tradingOrderDetails.Select(detail => detail.ToTradingOrderDetailDTO());

            return Ok(tradingOrderDetailDtos);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllTradingOrderDetails()
        {
            var tradingOrderDetails = await _tradingOrderDetailRepo.GetAllAsync();

            if (tradingOrderDetails == null || !tradingOrderDetails.Any())
            {
                return NotFound("No trading order details found.");
            }

            var tradingOrderDetailDtos = tradingOrderDetails.Select(detail => detail.ToTradingOrderDetailDTO());

            return Ok(tradingOrderDetailDtos);
        }


        [HttpGet("detail/{id}")]
        public async Task<IActionResult> GetTradingOrderDetailById(int id)
        {
            var tradingOrderDetail = await _tradingOrderDetailRepo.GetByIdAsync(id);

            if (tradingOrderDetail == null)
            {
                return NotFound();
            }

            var tradingOrderDetailDto = tradingOrderDetail.ToTradingOrderDetailDTO();

            return Ok(tradingOrderDetailDto);
        }


        [HttpPost("createtradingorderdetail")]
        public async Task<IActionResult> Create([FromBody] CreateTradingOrderDetailRequestDto createDto)
        {
            if (createDto == null)
            {
                return BadRequest("CreateTradingOrderDetailRequestDto is null.");
            }

            // Retrieve the user ID from the claims
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found.");
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("Invalid user ID claim.");
            }

            // Check if TradingOrderId is valid and belongs to the user
            var tradingOrder = await _tradingOrderRepo.GetByIdAsync(createDto.TradingOrderId);
            if (tradingOrder == null)
            {
                return BadRequest("Invalid TradingOrderId.");
            }
            if (tradingOrder.User1 != userId)
            {
                return Unauthorized("User does not own this TradingOrderId.");
            }

            // Check if ProductId is valid
            var product = await _productRepo.GetByIdProductAsync(createDto.ProductId);
            if (product == null)
            {
                return BadRequest("Invalid ProductId.");
            }

            // Check if Product belongs to the logged-in user
            if (product.SellerId != userId)
            {
                return Unauthorized("User does not own this ProductId.");
            }

            // Get OwnerId and Price from Product
            var ownerId = product.SellerId;
            var price = product.Price;

            var tradingOrderDetail = createDto.ToTradingOrderDetailFromCreate(price, ownerId);
            var createdTradingOrderDetail = await _tradingOrderDetailRepo.CreateAsync(tradingOrderDetail);
            var tradingOrderDetailDto = createdTradingOrderDetail.ToTradingOrderDetailDTO();

            return CreatedAtAction(nameof(GetTradingOrderDetailById), new { id = tradingOrderDetailDto.TradingOrderDetailId }, tradingOrderDetailDto);
        }

        [HttpPut("updatequantity/{id}")]
        public async Task<IActionResult> UpdateQuantity(int id, [FromBody] UpdateTradingOrderDetailRequestDto updateDto)
        {
            if (updateDto == null)
            {
                return BadRequest("UpdateTradingOrderDetailRequestDto is null.");
            }

            // Retrieve the user ID from the claims
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found.");
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("Invalid user ID claim.");
            }

            // Check if TradingOrderDetail belongs to the logged-in user
            var tradingOrderDetail = await _tradingOrderDetailRepo.GetByIdAsync(id);
            if (tradingOrderDetail == null)
            {
                return NotFound("TradingOrderDetail not found.");
            }

            var tradingOrder = await _tradingOrderDetailRepo.GetByIdAsync(tradingOrderDetail.TradingOrderId);
            if (tradingOrder == null)
            {
                return NotFound("TradingOrder not found.");
            }

            if (tradingOrderDetail.OwnerId != userId)
            {
                return Unauthorized("User does not own this TradingOrderDetail.");
            }

            // Update the quantity
            tradingOrderDetail.Quantity = updateDto.Quantity;

            var updatedTradingOrderDetail = await _tradingOrderDetailRepo.UpdateAsync(tradingOrderDetail);
            var tradingOrderDetailDto = updatedTradingOrderDetail.ToTradingOrderDetailDTO();

            return Ok(tradingOrderDetailDto);
        }
    }
}
