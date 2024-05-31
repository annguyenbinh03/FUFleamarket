using DTO.AddressDto;
using DTO.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Interfaces;

namespace WebAPI.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/address")]
    [ApiController]
    public class AddressController : ControllerBase
    {
        private readonly IAddressRepository _addressRepo;
        private readonly IUserRepository _userRepo;

        public AddressController(IAddressRepository addressRepo, IUserRepository userRepo)
        {
            _addressRepo = addressRepo;
            _userRepo = userRepo;
        }
        [HttpGet]
        
        public async Task<IActionResult> GetAll()
        {
            var address = await _addressRepo.GetAllAsync();
            var addressDto = address.Select(s => s.ToAddressDTO());
            return Ok(addressDto);
        }
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute]int id)
        {
            var address = await _addressRepo.GetByIdAsync(id);
            if (address == null)
            {
                return NotFound();
            }
            return Ok(address.ToAddressDTO());
        }
        [HttpPost("{userId:int}")]
        public async Task<IActionResult> Create([FromRoute] int userId, CreateAddressRequestDto createDto)
        {
            if(!await _userRepo.UserExists(userId))
            {
                return BadRequest("User does not exist");
            }
            var addressModel = createDto.ToAddressFromCreate(userId);
            await _addressRepo.CreateAsync(addressModel);
            return CreatedAtAction(nameof(GetById),new { id = addressModel.AddressId },addressModel.ToAddressDTO());
        }
        [HttpPut]
        [Route("{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, UpdateAddressRequestDto updateDto)
        {
            var address = await _addressRepo.UpdateAsync(id, updateDto);
            if (address == null)
            {
                return NotFound("Address not found");
            }
            return Ok(address.ToAddressDTO());
        }
        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var addressModel = await _addressRepo.DeleteAsync(id);
            if(addressModel == null)
            {
                return NotFound("Address does not exist");
            }
            return NoContent();
        }
    }
}
