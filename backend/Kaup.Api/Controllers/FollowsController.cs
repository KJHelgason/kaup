using Kaup.Api.Data;
using Kaup.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Kaup.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FollowsController : ControllerBase
{
    private readonly KaupDbContext _context;
    private readonly ILogger<FollowsController> _logger;

    public FollowsController(KaupDbContext context, ILogger<FollowsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/follows/user/{userId}/followers-count
    [AllowAnonymous]
    [HttpGet("user/{userId}/followers-count")]
    public async Task<ActionResult<int>> GetFollowersCount(Guid userId)
    {
        var count = await _context.Follows
            .CountAsync(f => f.FollowingId == userId);
        
        return Ok(count);
    }

    // GET: api/follows/user/{userId}/following-count
    [AllowAnonymous]
    [HttpGet("user/{userId}/following-count")]
    public async Task<ActionResult<int>> GetFollowingCount(Guid userId)
    {
        var count = await _context.Follows
            .CountAsync(f => f.FollowerId == userId);
        
        return Ok(count);
    }

    // GET: api/follows/is-following/{userId}
    [HttpGet("is-following/{userId}")]
    public async Task<ActionResult<bool>> IsFollowing(Guid userId)
    {
        var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(currentUserIdClaim) || !Guid.TryParse(currentUserIdClaim, out var currentUserId))
            return Unauthorized();

        var isFollowing = await _context.Follows
            .AnyAsync(f => f.FollowerId == currentUserId && f.FollowingId == userId);
        
        return Ok(isFollowing);
    }

    // POST: api/follows/{userId}
    [HttpPost("{userId}")]
    public async Task<IActionResult> FollowUser(Guid userId)
    {
        var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(currentUserIdClaim) || !Guid.TryParse(currentUserIdClaim, out var currentUserId))
            return Unauthorized();

        // Check if user exists
        var userToFollow = await _context.Users.FindAsync(userId);
        if (userToFollow == null)
            return NotFound(new { message = "User not found" });

        // Can't follow yourself
        if (currentUserId == userId)
            return BadRequest(new { message = "You cannot follow yourself" });

        // Check if already following
        var existingFollow = await _context.Follows
            .FirstOrDefaultAsync(f => f.FollowerId == currentUserId && f.FollowingId == userId);
        
        if (existingFollow != null)
            return BadRequest(new { message = "You are already following this user" });

        // Create follow relationship
        var follow = new Follow
        {
            FollowerId = currentUserId,
            FollowingId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Follows.Add(follow);
        await _context.SaveChangesAsync();

        _logger.LogInformation("User {FollowerId} followed user {FollowingId}", currentUserId, userId);

        return Ok(new { message = "Successfully followed user" });
    }

    // DELETE: api/follows/{userId}
    [HttpDelete("{userId}")]
    public async Task<IActionResult> UnfollowUser(Guid userId)
    {
        var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(currentUserIdClaim) || !Guid.TryParse(currentUserIdClaim, out var currentUserId))
            return Unauthorized();

        var follow = await _context.Follows
            .FirstOrDefaultAsync(f => f.FollowerId == currentUserId && f.FollowingId == userId);

        if (follow == null)
            return NotFound(new { message = "You are not following this user" });

        _context.Follows.Remove(follow);
        await _context.SaveChangesAsync();

        _logger.LogInformation("User {FollowerId} unfollowed user {FollowingId}", currentUserId, userId);

        return Ok(new { message = "Successfully unfollowed user" });
    }

    // GET: api/follows/user/{userId}/followers
    [AllowAnonymous]
    [HttpGet("user/{userId}/followers")]
    public async Task<ActionResult<IEnumerable<object>>> GetFollowers(Guid userId)
    {
        var followers = await _context.Follows
            .Include(f => f.Follower)
            .Where(f => f.FollowingId == userId)
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => new
            {
                id = f.Follower.Id,
                username = f.Follower.Username,
                profileImageUrl = f.Follower.ProfileImageUrl,
                followedAt = f.CreatedAt
            })
            .ToListAsync();

        return Ok(followers);
    }

    // GET: api/follows/user/{userId}/following
    [AllowAnonymous]
    [HttpGet("user/{userId}/following")]
    public async Task<ActionResult<IEnumerable<object>>> GetFollowing(Guid userId)
    {
        var following = await _context.Follows
            .Include(f => f.Following)
            .Where(f => f.FollowerId == userId)
            .OrderByDescending(f => f.CreatedAt)
            .Select(f => new
            {
                id = f.Following.Id,
                username = f.Following.Username,
                profileImageUrl = f.Following.ProfileImageUrl,
                followedAt = f.CreatedAt
            })
            .ToListAsync();

        return Ok(following);
    }
}
