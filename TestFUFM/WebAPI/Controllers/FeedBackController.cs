using BusinessObjects.FeedbackDto;
using BusinessObjects.Mappers;
using Microsoft.AspNetCore.Mvc;
using Repository.Interfaces;
namespace WebAPI.Controllers
{
    [Route("api/feedback")]
    [ApiController]
    public class FeedBackController : ControllerBase
    {
        private readonly IFeedbackRepository _feedbackRepo;
        private readonly IOrderRepository _orderRepo;
        public FeedBackController(IFeedbackRepository feedbackRepo, IOrderRepository orderRepo)
        {
            _feedbackRepo = feedbackRepo;
            _orderRepo = orderRepo;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllFeedback()
        {
            var feedbackModels = await _feedbackRepo.GetAllFeedbackAsync();
            var feedback = feedbackModels.Select(x => x.ToFeedBackDTO());

            return Ok(feedback);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetFeedbackId([FromRoute] int id)
        {
            var feedback = await _feedbackRepo.GetFeedbackByIdAsync(id);
            if (feedback == null)
            {
                return NotFound();
            }
            return Ok(feedback.ToFeedBackDTO());
        }
        [HttpPost]
        public async Task<IActionResult> CreateFeedback([FromBody] CreateFeedbackRequestDto feedbackDto)
        {
            var feedbackModel = feedbackDto.ToCreateFeedbackDTO();
            await _feedbackRepo.CreateFeedbackAsync(feedbackModel);
            return CreatedAtAction(nameof(GetFeedbackId), new { id = feedbackModel.OrderId}, feedbackModel.ToFeedBackDTO());
        }
        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> UpdateFeedback([FromRoute] int id, [FromBody] UpdateFeedbackRequestDto updateFeedback)
        {
            if (!await _orderRepo.OrderExistsAsync(updateFeedback.OrderId))
            {
                return NotFound("OrderID not found");
            }
            var feedbackModel = await _feedbackRepo.UpdateFeedbackAsync(id, updateFeedback);
            
            if (feedbackModel == null)
            {
                return NotFound();
            }
            return Ok(feedbackModel.ToFeedBackDTO());
        }
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var feedbackModel = await _feedbackRepo.DeleteFeedbackAsync(id);
            if (feedbackModel == null)
            {
                return NotFound();
            }
            return NoContent();
        }

    }
}
