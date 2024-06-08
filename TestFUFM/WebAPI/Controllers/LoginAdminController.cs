using BusinessObjects.Models;
using BusinessObjects.AccountDto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BusinessObjects;


[Route("api/[controller]")]
[ApiController]
public class LoginAdminController : ControllerBase
{
    private readonly FufleaMarketContext _context;
    private readonly IConfiguration _configuration;

    public LoginAdminController(FufleaMarketContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto userDto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == userDto.Email && u.Password == userDto.Password);

        if (user == null)
        {
            return Unauthorized("Invalid email or password");
        }

        if (user.IsDeleted)
        {
            return Unauthorized("This account has been deleted.");
        }

        var token = GenerateJwtToken(user);
        var role = new int[] { user.RoleId};
        return Ok(new { Token = token, role, fullName = user.FullName, avarta = user.Avarta,id = user.UserId });
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JWT");

        string role = user.RoleId switch
        {
            1 => "User",
            2 => "Admin",
            3 => "Admin",
            _ => "User" // Default role
        };

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Role, role), // Dynamically assign role
            new Claim("UserId", user.UserId.ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }


    
}
