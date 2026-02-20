using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Kaup.Api.Data;
using Kaup.Api.Models;
using Kaup.Api.Models.Enums;
using System.Security.Claims;

namespace Kaup.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WatchlistController : ControllerBase
{
    private readonly KaupDbContext _context;

    public WatchlistController(KaupDbContext context)
    {
        _context = context;
    }

    private Guid? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
    }

    // GET: api/watchlist
    [HttpGet]
    public async Task<ActionResult<IEnumerable<WatchlistItemDto>>> GetMyWatchlist()
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized();

        var watchlistItems = await _context.Watchlists
            .Include(w => w.Listing)
                .ThenInclude(l => l.Seller)
            .Include(w => w.Listing)
                .ThenInclude(l => l.Bids)
            .Where(w => w.UserId == userId.Value)
            .OrderByDescending(w => w.CreatedAt)
            .Select(w => new WatchlistItemDto
            {
                Id = w.Id,
                ListingId = w.Listing.Id,
                ListingTitle = w.Listing.Title,
                ListingPrice = w.Listing.Price,
                ListingImageUrl = w.Listing.ImageUrls.Length > 0 ? w.Listing.ImageUrls[0] : null,
                ListingStatus = w.Listing.Status.ToString(),
                ListingType = w.Listing.ListingType.ToString(),
                EndDate = w.Listing.EndDate,
                BidCount = w.Listing.Bids.Count,
                SellerName = $"{w.Listing.Seller.FirstName} {w.Listing.Seller.LastName}",
                AddedAt = w.CreatedAt
            })
            .ToListAsync();

        return Ok(watchlistItems);
    }

    // POST: api/watchlist/{listingId}
    [HttpPost("{listingId}")]
    public async Task<ActionResult> AddToWatchlist(Guid listingId)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized();

        // Check if listing exists
        var listing = await _context.Listings.FindAsync(listingId);
        if (listing == null)
            return NotFound(new { message = "Listing not found" });

        // Check if already in watchlist
        var exists = await _context.Watchlists
            .AnyAsync(w => w.UserId == userId.Value && w.ListingId == listingId);

        if (exists)
            return BadRequest(new { message = "Listing already in watchlist" });

        var watchlistItem = new Watchlist
        {
            UserId = userId.Value,
            ListingId = listingId
        };

        _context.Watchlists.Add(watchlistItem);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Added to watchlist", id = watchlistItem.Id });
    }

    // DELETE: api/watchlist/{listingId}
    [HttpDelete("{listingId}")]
    public async Task<ActionResult> RemoveFromWatchlist(Guid listingId)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized();

        var watchlistItem = await _context.Watchlists
            .FirstOrDefaultAsync(w => w.UserId == userId.Value && w.ListingId == listingId);

        if (watchlistItem == null)
            return NotFound(new { message = "Listing not in watchlist" });

        _context.Watchlists.Remove(watchlistItem);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Removed from watchlist" });
    }

    // GET: api/watchlist/check/{listingId}
    [HttpGet("check/{listingId}")]
    public async Task<ActionResult<bool>> IsInWatchlist(Guid listingId)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized();

        var exists = await _context.Watchlists
            .AnyAsync(w => w.UserId == userId.Value && w.ListingId == listingId);

        return Ok(exists);
    }

    // GET: api/watchlist/count/{listingId}
    [HttpGet("count/{listingId}")]
    [AllowAnonymous]
    public async Task<ActionResult<int>> GetWatchlistCount(Guid listingId)
    {
        var count = await _context.Watchlists
            .CountAsync(w => w.ListingId == listingId);

        return Ok(count);
    }
}

public class WatchlistItemDto
{
    public Guid Id { get; set; }
    public Guid ListingId { get; set; }
    public string ListingTitle { get; set; } = string.Empty;
    public decimal ListingPrice { get; set; }
    public string? ListingImageUrl { get; set; }
    public string ListingStatus { get; set; } = string.Empty;
    public string ListingType { get; set; } = string.Empty;
    public DateTime? EndDate { get; set; }
    public int BidCount { get; set; }
    public string SellerName { get; set; } = string.Empty;
    public DateTime AddedAt { get; set; }
}
