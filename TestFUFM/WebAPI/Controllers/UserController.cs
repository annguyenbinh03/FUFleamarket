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

    }
}
