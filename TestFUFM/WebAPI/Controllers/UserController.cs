using DTO.Mappers;
using DTO.UserDto;
using Microsoft.AspNetCore.Mvc;
using Repository.Interfaces;

namespace WebAPI.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepo;

        public UserController(IUserRepository userRepo)
        {
            _userRepo = userRepo;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllUser()
        {
            var userModels = await _userRepo.GetAllUserAsync();
            var users = userModels.Select(x=>x.ToUserDTO()).ToList();   
            return Ok(users);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var user = await _userRepo.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user.ToUserDTO());
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserRequestDto userDTO)
        {
            var userModel = userDTO.ToStockFromCreateDTO();
            await _userRepo.CreateAsync(userModel);
            return CreatedAtAction(nameof(GetById), new { id =userModel.UserId }, userModel.ToUserDTO());
        }
        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateUserRequestDto updateDto)
        {
            var userModel = await _userRepo.UpdateAsync(id,updateDto);
            if (userModel == null)
            {
                return NotFound();
            }
            return Ok(userModel.ToUserDTO());
        }
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete([FromRoute]int id)
        {
            var userModel = await _userRepo.DeleteAsync(id);
            if (userModel == null)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
