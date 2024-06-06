using BusinessObjects.Mappers;
using BusinessObjects.UserDto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repository.Interfaces;
using System.Linq;
using System.Threading.Tasks;

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

        // Lấy thông tin người dùng hiện tại
        [HttpGet("Profile")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> GetProfileUser()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim not found.");
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest("Invalid User ID claim.");
            }

            var profileOfUser = await _userRepo.GetProfileUser(userId);
            if (profileOfUser == null )
            {
                return NotFound("No profile found for the user.");
            }

            var profileDto = profileOfUser.ToUserDTO();
            return Ok(new { profile = profileDto });
        }

        // Lấy tất cả người dùng (chỉ admin)
        [HttpGet("AllProfile(Admin)")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userRepo.GetAllUserAsync();
            if (users == null || !users.Any())
            {
                return NotFound("No users found.");
            }

            var userDTOs = users.Select(user => user.ToUserDTO()).ToList();
            return Ok(userDTOs);
        }

        
        [HttpGet("SearchProfileOfUserById(Admin)/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var user = await _userRepo.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            var profile = user.ToUserDTO();
            return Ok( profile );
        }

        
        [HttpPost("CreateAccount")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> Create([FromBody] CreateUserRequestDto userDTO)
        {
            var userModel = userDTO.ToUserFromCreateDTO();
            await _userRepo.CreateAsync(userModel);
            return CreatedAtAction(nameof(GetById), new { id = userModel.UserId }, userModel.ToUserDTO());
        }

        
        [HttpPut("UpdateProfileOfUser")]
        [Authorize(Roles = "User,Admin")]
        public async Task<IActionResult> Update([FromBody] UpdateUserRequestDto updateDto)
        {
            if (updateDto == null)
            {
                return BadRequest("Update data is required.");
            }

            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim not found.");
            }

            if (!int.TryParse(userIdClaim.Value, out int userId))
            {
                return Unauthorized("Invalid user ID claim.");
            }

            var updatedUser = await _userRepo.UpdateAsync(userId, updateDto);
            if (updatedUser == null)
            {
                return NotFound();
            }

            return Ok(updatedUser.ToUserDTO());
        }

        [HttpPut("UnBanAccountOfUser(Admin)/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UnBanAccount([FromRoute] int id)
        {
            var userModel = await _userRepo.UnBanAccount(id);
            if (userModel == null)
            {
                return NotFound();
            }
            return NoContent();
        }
        [HttpPut("BanAccountOfUser(Admin)/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> BanAccount([FromRoute] int id)
        {
            var userModel = await _userRepo.BanAccount(id);
            if (userModel == null)
            {
                return NotFound();
            }
            return NoContent();
        }
    }
}
