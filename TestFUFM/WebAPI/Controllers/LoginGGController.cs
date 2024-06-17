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

    [HttpGet("google-response")]
    public async Task<IActionResult> GoogleResponse()
    {
        var authenticateResult = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

        if (!authenticateResult.Succeeded)
        {
            return BadRequest("Xác thực thất bại.");
        }

        var claims = authenticateResult.Principal.Claims;
        foreach (var claim in claims)
        {
            Console.WriteLine($"{claim.Type}: {claim.Value}");
        }

        var email = authenticateResult.Principal.FindFirstValue(ClaimTypes.Email);
        var fullName = authenticateResult.Principal.FindFirstValue(ClaimTypes.Name) ?? authenticateResult.Principal.FindFirstValue("name");
        var profilePicture = authenticateResult.Principal.FindFirstValue("picture") ?? authenticateResult.Principal.FindFirstValue("urn:google:picture");

        if (email == null || !email.EndsWith("@fpt.edu.vn"))
        {
            return BadRequest("Chỉ người dùng có email @fpt.edu.vn được phép.");
        }

        try
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.Email == email);
            if (existingUser == null)
            {
                User user = new User
                {
                    Email = email,
                    Avarta = profilePicture,
                    FullName = fullName,
                    RoleId = 1,
                    IsDeleted = false,
                    CreatedDate = DateTime.UtcNow,
                };

                _context.Users.Add(user);
                _context.SaveChanges();
            }

            var token = GenerateJwtToken(email, "User");


            return Ok(new { Token = token, Username = fullName, ProfilePicture = profilePicture });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Đã xảy ra lỗi: {ex.Message}");
            return StatusCode(500, "Lỗi máy chủ nội bộ");
        }
    }

    private string GenerateJwtToken(string email, string role)
    {
        var jwtSettings = _configuration.GetSection("JWT");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]));

        // Query user from database to get UserId
        var user = _context.Users.FirstOrDefault(u => u.Email == email);
        if (user == null)
        {
            throw new ApplicationException($"User not found for email: {email}");
        }

        var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Email, email),
        new Claim(ClaimTypes.Role, role),
        new Claim("UserId", user.UserId.ToString()), // Add UserId claim
    };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(Convert.ToDouble(jwtSettings["ExpirationInMinutes"])),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }


    [HttpGet("signin-google")]
    public IActionResult SignInWithGoogle()
    {
        var redirectUrl = Url.Action("GoogleResponse", "Auth", null, Request.Scheme);
        var properties = new AuthenticationProperties { RedirectUri = redirectUrl };
        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }
}
