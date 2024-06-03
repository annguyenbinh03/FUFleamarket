using BusinessObjects.Models;
using BusinessObjects.AddressDto;
using BusinessObjects.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Repository.Interfaces;
using System.Security.Claims;

namespace WebAPI.Controllers
{

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

            // Fetch addresses associated with the user ID
            var addressOfUser = await _addressRepo.GetAddressByIdAsync(userId);

            // Check if any addresses were found
            if (addressOfUser == null || !addressOfUser.Any())
            {
                return NotFound("No addresses found for the user.");
            }

            // Convert addresses to DTOs
            var addressDto = addressOfUser.Select(x => x.ToAddressDTO()).ToList();

            // Return the addresses in the response
            return Ok(addressDto);
        }
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById([FromRoute] int id)
        {
            var address = await _addressRepo.GetByIdAsync(id);
            if (address == null)
            {
                return NotFound();
            }
            return Ok(address.ToAddressDTO());
        }
        [HttpPost("CreateAddress")]
        public async Task<IActionResult> Create([FromBody] CreateAddressRequestDto createDto)
        {
            if (createDto == null)
            {
                return BadRequest("Address data is required.");
            }

            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized("Claim user ID not found.");
            }

            if (!int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("Invalid user ID claim.");
            }

            try
            {
                var addressModel = createDto.ToAddressFromCreate(userId);
                await _addressRepo.CreateAsync(addressModel);
                var addressDto = addressModel.ToAddressDTO();
                addressDto.UserId = userId;
                return CreatedAtAction(nameof(GetById), new { id = addressModel.AddressId }, addressDto);
            }
            catch (Exception ex)
            {
                // Log the exception
                // _logger.LogError(ex, "Error creating address.");
                return StatusCode(500, "An error occurred while creating the address.");
            }
        }

        [HttpPut]
        [Route("UpdateAddress/{id:int}")]
        public async Task<IActionResult> Update([FromRoute] int id, UpdateAddressRequestDto updateDto)
        {
            var userIdClaim = User.FindFirstValue("UserId");
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user ID format");
            }

            var existingAddress = await _addressRepo.GetByIdAsync(id);
            if (existingAddress == null)
            {
                return NotFound("Address not found with the provided ID.");
            }

            if (existingAddress.UserId != userId)
            {
                return Unauthorized("This is not your Address, please enter your Address ID.");
            }

            var addressModel = await _addressRepo.UpdateAsync(id, updateDto);

            return Ok(addressModel.ToAddressDTO());
        }




        [HttpDelete]
        [Route("DeleteAddress/{id:int}")]
        public async Task<IActionResult> Delete([FromRoute] int id)
        {
            // Extract the UserId from the claims
            var userIdClaim = User.FindFirstValue("UserId");
            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user ID format");
            }

            // Fetch the address to be deleted
            var existingAddress = await _addressRepo.GetByIdAsync(id);
            if (existingAddress == null)
            {
                return NotFound("Address not found with the provided ID.");
            }

            // Check if the address belongs to the current user
            if (existingAddress.UserId != userId)
            {
                return Unauthorized("This is not your Address, please enter your Address ID.");
            }

            try
            {
                // Attempt to delete the address
                var deletedAddress = await _addressRepo.DeleteAsync(id);
                if (deletedAddress == null)
                {
                    return NotFound("Failed to delete the address, please try again.");
                }

                // Convert to DTO (ensure you have a method to do this)
                var updatedAddress = deletedAddress.ToAddressDTO();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }


    }
}
