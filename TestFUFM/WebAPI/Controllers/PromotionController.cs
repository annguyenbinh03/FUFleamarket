using BusinessObjects.Mappers;
using BusinessObjects.PromotionDto;
using Microsoft.AspNetCore.Mvc;
using Repository.Interfaces;

namespace WebAPI.Controllers
{
    [Route("api/promotion")]
    [ApiController]
    public class PromotionController : ControllerBase
    {
        private readonly IPromotionRepository _promotionRepo;
        
        public PromotionController(IPromotionRepository promotionRepo)
        {
            _promotionRepo = promotionRepo;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var Promotion =  await _promotionRepo.GetAllAsync();
            var PromotionDto = Promotion.Select(x => x.ToPromotionDTO());
            return Ok(PromotionDto);
        }
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute]int id)
        {
            var Promotion = await _promotionRepo.GetByIdAsync(id);
            if(Promotion == null)
            {
                return NotFound();
            }
            return Ok(Promotion.ToPromotionDTO());
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePromotionRequestDto createDto)
        {
            var promotionModel = createDto.ToPromotionFromCreateDTO();
            await _promotionRepo.CreateAsync(promotionModel);
            return CreatedAtAction(nameof(GetById), new { id = promotionModel.PromotionId}, promotionModel.ToPromotionDTO());
        }
        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdatePromotionRequestDto updateDto)
        {
            var promotionModel = await _promotionRepo.UpdateAsync(id, updateDto);
            if (promotionModel == null)
            {
                return NotFound();
            }
            return Ok(promotionModel.ToPromotionDTO());
        }
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete([FromRoute]int id)
        {
            var promotionModel = await _promotionRepo.DeleteAsync(id);
            if (promotionModel == null)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
