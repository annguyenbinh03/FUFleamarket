using Azure.Core;
using BusinessObjects.Models;
using BusinessObjects;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System;
using Newtonsoft.Json.Linq;
using System.Data;
using DTO.Helpers;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly FufleaMarketContext _context;

    public AuthController(FufleaMarketContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("loginGoogle")]
    public async Task<IActionResult> LoginGoogle([FromBody] LoginGoogleData data)
    {

        var existingUser = _context.Users.FirstOrDefault(u => u.Email == data.email);
        User? user = null;
        if (existingUser == null) //not found, create
        {
            user = new User
            {
                Email = data.email,
                Avarta = data.avarta,
                FullName = data.name,
                RoleId = 1,
                IsDeleted = false,
                CreatedDate = DateTime.UtcNow,
                Sub = data.sub
            };
            _context.Users.Add(user);
            _context.SaveChanges();
        }
        if (existingUser != null)
        {
            if (existingUser.Sub != data.sub)
            {
                return NotFound();
            }
            user = existingUser;
        }
        var token = GenerateJwtToken(user);
        var role = new int[] { user.RoleId };
        return Ok(new { Token = token, role, fullName = user.FullName, avarta = user.Avarta, id = user.UserId });
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
