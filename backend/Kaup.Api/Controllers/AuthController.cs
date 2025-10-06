using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Kaup.Api.Data;
using Kaup.Api.Models;
using Kaup.Api.DTOs;
using System.Security.Cryptography;
using System.Text;

namespace Kaup.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly KaupDbContext _context;

    public AuthController(KaupDbContext context)
    {
        _context = context;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto registerDto)
    {
        // Validate input
        if (string.IsNullOrWhiteSpace(registerDto.Email) || 
            string.IsNullOrWhiteSpace(registerDto.Password) ||
            string.IsNullOrWhiteSpace(registerDto.FirstName) ||
            string.IsNullOrWhiteSpace(registerDto.LastName))
        {
            return BadRequest("All fields are required");
        }

        // Check if user already exists
        if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
        {
            return BadRequest("Email already registered");
        }

        // Hash password
        var passwordHash = HashPassword(registerDto.Password);

        // Create user
        var user = new User
        {
            Email = registerDto.Email,
            PasswordHash = passwordHash,
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            PhoneNumber = registerDto.PhoneNumber,
            AuthProvider = "Local"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // For now, we'll return a simple token (user ID)
        // In production, use JWT tokens
        var token = user.Id.ToString();

        var userDto = new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            PhoneNumber = user.PhoneNumber,
            ProfileImageUrl = user.ProfileImageUrl,
            Bio = user.Bio,
            Address = user.Address,
            City = user.City,
            PostalCode = user.PostalCode,
            AverageRating = user.AverageRating,
            TotalRatings = user.TotalRatings,
            TotalSales = user.TotalSales,
            CreatedAt = user.CreatedAt
        };

        return Ok(new AuthResponseDto
        {
            Token = token,
            User = userDto
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto loginDto)
    {
        // Validate input
        if (string.IsNullOrWhiteSpace(loginDto.Email) || string.IsNullOrWhiteSpace(loginDto.Password))
        {
            return BadRequest("Email and password are required");
        }

        // Find user
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
        if (user == null)
        {
            return Unauthorized("Invalid email or password");
        }

        // Verify password
        if (!VerifyPassword(loginDto.Password, user.PasswordHash))
        {
            return Unauthorized("Invalid email or password");
        }

        // For now, we'll return a simple token (user ID)
        // In production, use JWT tokens
        var token = user.Id.ToString();

        var userDto = new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            PhoneNumber = user.PhoneNumber,
            ProfileImageUrl = user.ProfileImageUrl,
            Bio = user.Bio,
            Address = user.Address,
            City = user.City,
            PostalCode = user.PostalCode,
            AverageRating = user.AverageRating,
            TotalRatings = user.TotalRatings,
            TotalSales = user.TotalSales,
            CreatedAt = user.CreatedAt
        };

        return Ok(new AuthResponseDto
        {
            Token = token,
            User = userDto
        });
    }

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    private static bool VerifyPassword(string password, string hash)
    {
        var passwordHash = HashPassword(password);
        return passwordHash == hash;
    }

    [HttpPost("google")]
    public async Task<ActionResult<AuthResponseDto>> GoogleAuth(GoogleAuthDto googleAuthDto)
    {
        // Validate input
        if (string.IsNullOrWhiteSpace(googleAuthDto.Email) || 
            string.IsNullOrWhiteSpace(googleAuthDto.GoogleId))
        {
            return BadRequest("Google authentication data is invalid");
        }

        // Check if user exists with this Google ID
        var user = await _context.Users.FirstOrDefaultAsync(u => u.GoogleId == googleAuthDto.GoogleId);
        
        if (user == null)
        {
            // Check if email already exists with different auth provider
            user = await _context.Users.FirstOrDefaultAsync(u => u.Email == googleAuthDto.Email);
            
            if (user != null)
            {
                // Email exists but with different provider - link accounts
                if (string.IsNullOrEmpty(user.GoogleId))
                {
                    user.GoogleId = googleAuthDto.GoogleId;
                    user.AuthProvider = "Google";
                    if (!string.IsNullOrEmpty(googleAuthDto.ProfileImageUrl))
                    {
                        user.ProfileImageUrl = googleAuthDto.ProfileImageUrl;
                    }
                    await _context.SaveChangesAsync();
                }
            }
            else
            {
                // Create new user from Google data
                user = new User
                {
                    Email = googleAuthDto.Email,
                    GoogleId = googleAuthDto.GoogleId,
                    FirstName = googleAuthDto.FirstName ?? "",
                    LastName = googleAuthDto.LastName ?? "",
                    ProfileImageUrl = googleAuthDto.ProfileImageUrl,
                    PasswordHash = "", // No password for Google auth
                    AuthProvider = "Google"
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }
        }
        else
        {
            // Update profile image if provided
            if (!string.IsNullOrEmpty(googleAuthDto.ProfileImageUrl))
            {
                user.ProfileImageUrl = googleAuthDto.ProfileImageUrl;
                await _context.SaveChangesAsync();
            }
        }

        // Generate token
        var token = user.Id.ToString();

        var userDto = new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            PhoneNumber = user.PhoneNumber,
            ProfileImageUrl = user.ProfileImageUrl,
            Bio = user.Bio,
            Address = user.Address,
            City = user.City,
            PostalCode = user.PostalCode,
            AverageRating = user.AverageRating,
            TotalRatings = user.TotalRatings,
            TotalSales = user.TotalSales,
            CreatedAt = user.CreatedAt
        };

        return Ok(new AuthResponseDto
        {
            Token = token,
            User = userDto
        });
    }
}
