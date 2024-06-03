using BusinessObjects.Mappers;
using BusinessObjects.UserDto;
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
        public async Task<IActionResult> GetProfileUser()
        {
            // Retrieve the UserId claim
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("User ID claim not found.");
            }

            // Parse the user ID from the claim
            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return BadRequest("Invalid User ID claim.");
            }

            // Fetch the profile associated with the user ID
            var profileOfUser = await _userRepo.GetProfileUser(userId);

            // Check if any profile data was found
            if (profileOfUser == null || !profileOfUser.Any())
            {
                return NotFound("No profile found for the user.");
            }

            // Convert the profile data to DTOs
            var profileDto = profileOfUser.Select(x => x.ToUserDTO()).ToList();

            // Return the profile data in the response
            return Ok(profileDto);
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
