using BusinessObjects.Models;
using BusinessObjects.Mappers;
using BusinessObjects.PromotionOrderDto;
using Microsoft.AspNetCore.Mvc;
using Repository.Interfaces;

namespace WebAPI.Controllers
{
    [Route("api/promotionOder")]
    [ApiController]
    public class PromotionOrderController : ControllerBase
    {
        private readonly IPromotionOrderRepository _promoOrderRepo;
        private readonly IUserRepository _userRepo;

        public PromotionOrderController(IPromotionOrderRepository promoOrederRepo, IUserRepository userRepo)
        {
            _promoOrderRepo = promoOrederRepo;
            _userRepo = userRepo;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var PromoOrder = await _promoOrderRepo.GetAllAsync();
            var PromoOrderDto = PromoOrder.Select(x => x.ToPromotionOrderDTO());
            return Ok(PromoOrderDto);
        }
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute]int id)
        {
            var PromoOrder = await _promoOrderRepo.GetByIdAsync(id);
            if(PromoOrder == null)
            {
                return NotFound();
            }
            return Ok(PromoOrder.ToPromotionOrderDTO());
        }
        [HttpPost("{userId:int}")]
        public async Task<IActionResult> Create([FromRoute] int userId, CreatePromotionOrderRequestDto createDto)
        {
            if (!await _userRepo.UserExists(userId))
            {
                return BadRequest("User does not exist");
            }

            if (!await _promoOrderRepo.PromotionExists(createDto.PromotionId))
            {
                return BadRequest($"Promotion with ID {createDto.PromotionId} does not exist");
            }
            var PromoOrderModel = createDto.ToPromotionOrderFromCreate(userId);
            await _promoOrderRepo.CreateAsync(PromoOrderModel);
            return CreatedAtAction(nameof(GetById), new { id = PromoOrderModel.PromoOrderId }, PromoOrderModel.ToPromotionOrderDTO());
        }
    }
}
