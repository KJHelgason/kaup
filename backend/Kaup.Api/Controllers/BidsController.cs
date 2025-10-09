using Kaup.Api.Data;
using Kaup.Api.DTOs;
using Kaup.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Kaup.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class BidsController : ControllerBase
{
    private readonly KaupDbContext _context;
    private readonly ILogger<BidsController> _logger;

    public BidsController(KaupDbContext context, ILogger<BidsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/bids/listing/{listingId}
    [AllowAnonymous]
    [HttpGet("listing/{listingId}")]
    public async Task<ActionResult<IEnumerable<BidDto>>> GetBidsByListing(Guid listingId)
    {
        var listing = await _context.Listings.FindAsync(listingId);
        if (listing == null)
            return NotFound(new { message = "Listing not found" });

        var bids = await _context.Bids
            .Include(b => b.Bidder)
            .Where(b => b.ListingId == listingId)
            .ToListAsync();

        // Sort in memory to avoid SQLite decimal ordering limitation
        var sortedBids = bids
            .OrderByDescending(b => b.Amount)
            .ThenByDescending(b => b.CreatedAt)
            .ToList();

        var bidDtos = sortedBids.Select(b => new BidDto
        {
            Id = b.Id,
            Amount = b.Amount,
            CreatedAt = b.CreatedAt,
            ListingId = b.ListingId,
            Bidder = new BidderDto
            {
                Id = b.Bidder.Id,
                Username = b.Bidder.Username,
                FirstName = b.Bidder.FirstName,
                LastName = b.Bidder.LastName,
                ProfileImageUrl = b.Bidder.ProfileImageUrl
            }
        }).ToList();

        return Ok(bidDtos);
    }

    // GET: api/bids/user/my-bids
    [HttpGet("user/my-bids")]
    public async Task<ActionResult<IEnumerable<BidDto>>> GetMyBids()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var bids = await _context.Bids
            .Include(b => b.Bidder)
            .Include(b => b.Listing)
            .Where(b => b.BidderId == userId)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync();

        var bidDtos = bids.Select(b => new BidDto
        {
            Id = b.Id,
            Amount = b.Amount,
            CreatedAt = b.CreatedAt,
            ListingId = b.ListingId,
            Bidder = new BidderDto
            {
                Id = b.Bidder.Id,
                Username = b.Bidder.Username,
                FirstName = b.Bidder.FirstName,
                LastName = b.Bidder.LastName,
                ProfileImageUrl = b.Bidder.ProfileImageUrl
            }
        }).ToList();

        return Ok(bidDtos);
    }

    // POST: api/bids
    [HttpPost]
    public async Task<ActionResult<BidDto>> PlaceBid(PlaceBidDto placeBidDto)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        // Get the listing with bids
        var listing = await _context.Listings
            .Include(l => l.Bids)
            .Include(l => l.Seller)
            .FirstOrDefaultAsync(l => l.Id == placeBidDto.ListingId);

        if (listing == null)
            return NotFound(new { message = "Listing not found" });

        // Validation checks
        if (listing.Status != ListingStatus.Active)
            return BadRequest(new { message = "This listing is no longer active" });

        if (listing.ListingType != ListingType.Auction)
            return BadRequest(new { message = "Bids can only be placed on auctions" });

        if (listing.SellerId == userId)
            return BadRequest(new { message = "You cannot bid on your own listing" });

        if (listing.EndDate.HasValue && listing.EndDate.Value < DateTime.UtcNow)
            return BadRequest(new { message = "This auction has ended" });

        // Get current highest bid
        var highestBid = listing.Bids.Any() ? listing.Bids.Max(b => b.Amount) : listing.Price;
        
        // Validate bid amount (must be higher than current highest)
        if (placeBidDto.Amount <= highestBid)
        {
            return BadRequest(new 
            { 
                message = $"Bid must be higher than the current highest bid of {highestBid:N0} kr.",
                currentHighestBid = highestBid
            });
        }

        // Validate minimum bid increment (e.g., at least 100 kr more)
        var minimumIncrement = 100m;
        if (placeBidDto.Amount < highestBid + minimumIncrement)
        {
            return BadRequest(new 
            { 
                message = $"Bid must be at least {minimumIncrement:N0} kr. higher than the current bid",
                minimumBid = highestBid + minimumIncrement
            });
        }

        // Create the bid
        var bid = new Bid
        {
            Amount = placeBidDto.Amount,
            ListingId = placeBidDto.ListingId,
            BidderId = userId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Bids.Add(bid);
        await _context.SaveChangesAsync();

        // Reload bid with bidder info
        var createdBid = await _context.Bids
            .Include(b => b.Bidder)
            .FirstOrDefaultAsync(b => b.Id == bid.Id);

        if (createdBid == null)
            return StatusCode(500, new { message = "Failed to create bid" });

        var bidDto = new BidDto
        {
            Id = createdBid.Id,
            Amount = createdBid.Amount,
            CreatedAt = createdBid.CreatedAt,
            ListingId = createdBid.ListingId,
            Bidder = new BidderDto
            {
                Id = createdBid.Bidder.Id,
                Username = createdBid.Bidder.Username,
                FirstName = createdBid.Bidder.FirstName,
                LastName = createdBid.Bidder.LastName,
                ProfileImageUrl = createdBid.Bidder.ProfileImageUrl
            }
        };

        _logger.LogInformation("Bid placed: {BidId} for listing {ListingId} by user {UserId} with amount {Amount}", 
            bid.Id, placeBidDto.ListingId, userId, placeBidDto.Amount);

        return CreatedAtAction(nameof(GetBidsByListing), new { listingId = bid.ListingId }, bidDto);
    }

    // DELETE: api/bids/{id} - Allow users to retract their bid (only if not highest bid)
    [HttpDelete("{id}")]
    public async Task<IActionResult> RetractBid(Guid id)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var bid = await _context.Bids
            .Include(b => b.Listing)
            .ThenInclude(l => l.Bids)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (bid == null)
            return NotFound(new { message = "Bid not found" });

        if (bid.BidderId != userId)
            return Forbid();

        // Don't allow retracting the highest bid
        var highestBid = bid.Listing.Bids.Max(b => b.Amount);
        if (bid.Amount == highestBid)
            return BadRequest(new { message = "Cannot retract the highest bid" });

        // Don't allow retracting bids if auction ends within 1 hour
        if (bid.Listing.EndDate.HasValue)
        {
            var hoursRemaining = (bid.Listing.EndDate.Value - DateTime.UtcNow).TotalHours;
            if (hoursRemaining < 1)
                return BadRequest(new { message = "Cannot retract bids when auction ends within 1 hour" });
        }

        _context.Bids.Remove(bid);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Bid retracted successfully" });
    }
}
