using DTO.Mappers;
using DTO.UserDto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Update.Internal;
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
            var users = await _userRepo.GetByIdAsync(id);
            if (users == null)
            {
                return NotFound();
            }
            return Ok(users.ToUserDTO());
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserRequestDto userDto)
        {
            var userModel = userDto.ToCreateUserDTO();
            await _userRepo.CreateAsync(userModel);
            return CreatedAtAction(nameof(GetById), new {id = userModel.UserId}, userModel.ToUserDTO());
        }
        [HttpPut]
        [Route("{id}")]
        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateUserRequestDto updateUser)
        {
          var userModel = await _userRepo.UpdateAsync(id, updateUser);
            if (userModel == null)
            {
                return NotFound();
            }
            return Ok(userModel.ToUserDTO());
        }
        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            var userModel = await _userRepo.DeleteAsync(id);
            if(userModel == null)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
