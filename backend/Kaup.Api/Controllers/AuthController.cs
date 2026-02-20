using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Kaup.Api.Data;
using Kaup.Api.Models;
using Kaup.Api.DTOs;
using System.Security.Cryptography;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace Kaup.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly KaupDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(KaupDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto registerDto)
    {
        // Validate input
        if (string.IsNullOrWhiteSpace(registerDto.Email) || 
            string.IsNullOrWhiteSpace(registerDto.Password) ||
            string.IsNullOrWhiteSpace(registerDto.Username))
        {
            return BadRequest("Email, password, and username are required");
        }

        // Validate username format (alphanumeric, underscores, hyphens, 3-20 chars)
        if (!System.Text.RegularExpressions.Regex.IsMatch(registerDto.Username, @"^[a-zA-Z0-9_-]{3,20}$"))
        {
            return BadRequest("Username must be 3-20 characters and contain only letters, numbers, underscores, and hyphens");
        }

        // Check if email already exists
        if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
        {
            return BadRequest("Email already registered");
        }

        // Check if username already exists
        if (await _context.Users.AnyAsync(u => u.Username == registerDto.Username))
        {
            return BadRequest("Username already taken");
        }

        // Hash password
        var passwordHash = HashPassword(registerDto.Password);

        // Create user
        var user = new User
        {
            Username = registerDto.Username,
            Email = registerDto.Email,
            PasswordHash = passwordHash,
            AuthProvider = "Local"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Generate JWT token
        var token = GenerateJwtToken(user);

        var userDto = new UserDto
        {
            Id = user.Id,
            Username = user.Username,
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
            IsAdmin = user.IsAdmin,
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

        // Generate JWT token
        var token = GenerateJwtToken(user);

        var userDto = new UserDto
        {
            Id = user.Id,
            Username = user.Username,
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
            IsAdmin = user.IsAdmin,
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
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    private static bool VerifyPassword(string password, string hash)
    {
        try
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
        catch
        {
            // Handle legacy SHA-256 hashes during migration period
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            var hashedBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            var sha256Hash = Convert.ToBase64String(hashedBytes);
            return sha256Hash == hash;
        }
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
                    // Only set Google profile image if user doesn't have a custom uploaded image
                    // Check if current image is from S3 (uploaded) or missing
                    var hasUploadedImage = !string.IsNullOrEmpty(user.ProfileImageUrl) && 
                                          user.ProfileImageUrl.Contains("amazonaws.com");
                    
                    if (!hasUploadedImage && !string.IsNullOrEmpty(googleAuthDto.ProfileImageUrl))
                    {
                        user.ProfileImageUrl = googleAuthDto.ProfileImageUrl;
                    }
                    await _context.SaveChangesAsync();
                }
            }
            else
            {
                // Create new user from Google data
                // Generate username from email
                var baseUsername = googleAuthDto.Email.Split('@')[0].ToLower();
                var username = baseUsername;
                var counter = 1;
                
                // Ensure username is unique
                while (await _context.Users.AnyAsync(u => u.Username == username))
                {
                    username = $"{baseUsername}{counter}";
                    counter++;
                }
                
                user = new User
                {
                    Username = username,
                    Email = googleAuthDto.Email,
                    GoogleId = googleAuthDto.GoogleId,
                    FirstName = googleAuthDto.FirstName,
                    LastName = googleAuthDto.LastName,
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
            // User already exists - only update profile image if they don't have a custom uploaded one
            // This prevents overwriting uploaded S3 images with Google image on every login
            var hasUploadedImage = !string.IsNullOrEmpty(user.ProfileImageUrl) && 
                                   user.ProfileImageUrl.Contains("amazonaws.com");
            
            if (!hasUploadedImage && !string.IsNullOrEmpty(googleAuthDto.ProfileImageUrl))
            {
                user.ProfileImageUrl = googleAuthDto.ProfileImageUrl;
                await _context.SaveChangesAsync();
            }
        }

        // Generate JWT token
        var token = GenerateJwtToken(user);

        var userDto = new UserDto
        {
            Id = user.Id,
            Username = user.Username,
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
            IsAdmin = user.IsAdmin,
            CreatedAt = user.CreatedAt
        };

        return Ok(new AuthResponseDto
        {
            Token = token,
            User = userDto
        });
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSecret = _configuration["Jwt:Secret"]
            ?? throw new InvalidOperationException("Jwt:Secret must be configured");
        var key = Encoding.ASCII.GetBytes(jwtSecret);
        var issuer = _configuration["Jwt:Issuer"] ?? "kaup-api";
        var audience = _configuration["Jwt:Audience"] ?? "kaup-frontend";

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "User")
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
