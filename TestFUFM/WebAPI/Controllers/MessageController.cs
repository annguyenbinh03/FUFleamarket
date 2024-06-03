using BusinessObjects.Models;
using BusinessObjects.Mappers;
using BusinessObjects.MessageDto;
using Microsoft.AspNetCore.Mvc;
using Repository.Interfaces;

namespace WebAPI.Controllers
{
    [Route("api/message")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IMessageRepository _messageRepo;
        private readonly IUserRepository _userRepo;
        public MessageController(IMessageRepository messageRepo, IUserRepository userRepo)
        {
            _messageRepo = messageRepo;
            _userRepo = userRepo;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var Message = await _messageRepo.GetAllAsync();
            var MessageDto = Message.Select(x => x.ToMessageDTO());
            return Ok(MessageDto);
        }
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute]int id)
        {
            var Message = await _messageRepo.GetByIdAsync(id);
            if(Message == null)
            {
                return NotFound();
            }
            
            return Ok(Message.ToMessageDTO());
        }
        [HttpPost("{senderId:int}/{receiverId:int}")]
        public async Task<IActionResult> Create([FromRoute] int senderId, [FromRoute] int receiverId, [FromBody] CreateMessageRequestDto createDTO)
        {
            if (!await _userRepo.UserExists(senderId))
            {
                return BadRequest("SenderId does not exist");
            }
            if (!await _userRepo.UserExists(receiverId))
            {
                return BadRequest("ReceiverId does not exist");
            }

            var messageModel = createDTO.ToMessageFromCreateDTO(senderId, receiverId);
            await _messageRepo.CreateAsync(messageModel);
            return CreatedAtAction(nameof(GetById), new { id = messageModel.MessageId }, messageModel.ToMessageDTO());
        }
        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateMessageRequestDto updateDTO)
        {

            var messageModel = await _messageRepo.UpdateAsync(id, updateDTO);
            if(messageModel == null)
            {
                return NotFound();
            }
            return Ok(messageModel.ToMessageDTO());
        }
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var messageModel = await _messageRepo.DeleteAsync(id);
            if(messageModel == null)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
