using BusinessObjects.Models;
using BusinessObjects.Mappers;
using BusinessObjects.PromotionOrderDto;
using Microsoft.AspNetCore.Mvc;
using Repository.Interfaces;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace WebAPI.Controllers
{
    [Route("api/promotionOder")]
    [ApiController]
    public class PromotionOrderController : ControllerBase
    {
        private readonly IPromotionOrderRepository _promoOrderRepo;
        private readonly IUserRepository _userRepo;
        private readonly IPromotionRepository _promotionRepo;

        public PromotionOrderController(IPromotionOrderRepository promoOrederRepo, IUserRepository userRepo, IPromotionRepository promotionRepo)
        {
            _promoOrderRepo = promoOrederRepo;
            _userRepo = userRepo;
            _promotionRepo = promotionRepo;
        }
        [HttpGet("GetMyPackage")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> GetMyPackages()
        {
            var userIdClaim = User.FindFirstValue("UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim not found.");
            }

            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid UserId format.");
            }
            var promoOrders = await _promoOrderRepo.GetMyPromotionAsync(userId);
            if (promoOrders == null || !promoOrders.Any())
            {
                return NotFound("No promotion orders found for the current user.");
            }
            return Ok(promoOrders);
        }


        [HttpGet("InformationPromotionOrder")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> GetAll()
        {
            var userIdClaim = User.FindFirstValue("UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim not found.");
            }

            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid UserId format.");
            }
            var promoOrders = await _promoOrderRepo.GetAllByUserIdAsync(userId);
            if (promoOrders == null || !promoOrders.Any())
            {
                return NotFound("No promotion orders found for the current user.");
            }

            var promoOrderDtos = promoOrders.Select(x => x.ToPromotionOrderDTO());
            return Ok(promoOrderDtos);
        }

        [HttpGet("InformationPromotionOrderById(Admin){id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetById([FromRoute]int id)
        {
            var PromoOrder = await _promoOrderRepo.GetByIdAsync(id);
            if(PromoOrder == null)
            {
                return NotFound();
            }
            return Ok(PromoOrder.ToPromotionOrderDTO());
        }

        [HttpPost("CreatePromotionOrder")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> Create([FromBody] CreatePromotionOrderRequestDto createDto)
        {            
            var userIdClaim = User.FindFirstValue("UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("UserId claim is missing.");
            }

            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid UserId format.");
            }

            if (!await _userRepo.IsExistUser(userId))
            {
                return BadRequest("User does not exist.");
            }

            var promotion = await _promotionRepo.GetByIdAsync(createDto.PromotionId);
            if (promotion == null)
            {
                return BadRequest($"Promotion with ID {createDto.PromotionId} does not exist.");
            }

            var startDate = DateTime.UtcNow;
            var endDate = startDate.AddDays(promotion.Period);

            var price = promotion.Price;

            var promoOrderModel = createDto.ToPromotionOrderFromCreate(userId, endDate);
            await _promoOrderRepo.CreateAsync(promoOrderModel);

            var promoOrderDTO = promoOrderModel.ToPromotionOrderDTO();

            return CreatedAtAction(nameof(GetById), new { id = promoOrderModel.PromoOrderId }, promoOrderDTO);
        }
    }
}
