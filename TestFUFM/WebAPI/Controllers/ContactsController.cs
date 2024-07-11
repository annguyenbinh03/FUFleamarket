using DTO.ContactDto;
using Microsoft.AspNetCore.Mvc;
using Service.ContactCheck.Interfaces;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactsController(IContactService contactService)
        {
            _contactService = contactService;
        }

        [HttpPost("checkstatus")]
        public async Task<IActionResult> CheckContactStatus([FromBody] ContactCheckDTO contactCheckDto)
        {
            var status = await _contactService.CheckContactAsync(contactCheckDto.User1, contactCheckDto.User2);
            return Ok(new { IsActive = status });
        }

        [HttpPost("closecontact")]
        public async Task<IActionResult> CloseContact([FromBody] ContactCheckDTO contactCheckDto)
        {
            await _contactService.CloseContactAsync(contactCheckDto.User1, contactCheckDto.User2);
            return Ok( "Contact closed successfully" );
        }

        [HttpPost("opencontact")]
        public async Task<IActionResult> OpenContact([FromBody] ContactCheckDTO contactCheckDto)
        {
            await _contactService.OpenContactAsync(contactCheckDto.User1, contactCheckDto.User2);
            return Ok( "Contact opened successfully");
        }

        [HttpPost("createcontact")]
        public async Task<IActionResult> CreateContact([FromBody] ContactCheckDTO contactCheckDto)
        {
            await _contactService.CreateContactAsync(contactCheckDto.User1, contactCheckDto.User2);
            return Ok("Contact created successfully");
        }
    }
}
