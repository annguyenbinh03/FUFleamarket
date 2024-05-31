using BusinessObjects.Models;
using DTO;
using DTO.Mappers;
using DTO.UserDto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;

namespace WebAPI.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly FufleaMarketContext _context;
        public UserController(FufleaMarketContext context ,IUserRepository userRepo)
        {
            _context = context;
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
            var user = await _userRepo.GetByIdUserAsync(id);
            if( user == null) 
            { 
               return NotFound();
            }
            return Ok(user.ToUserDTO());
        }

         [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateUserRequestDto userDto) 
        {
            var userModel = userDto.ToUserFromCreateDTO();
            await _userRepo.CreateAsync(userModel);
            return CreatedAtAction(nameof(GetById), new { id = userModel.UserId }, userModel.ToUserDTO());

        }

        [HttpPut]
        [Route("{id}")]

        public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateUserRequestDto updateDto)
        {
            var userModel = await _userRepo.UpdateAsync(id, updateDto);
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
            if (userModel == null)
            {
                return NotFound();
            }
            ;
            return NoContent();

        }

    }
}
