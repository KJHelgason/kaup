using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Kaup.Api.Data;
using Kaup.Api.Models;
using Kaup.Api.DTOs;

namespace Kaup.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ListingsController : ControllerBase
{
    private readonly KaupDbContext _context;
    private readonly ILogger<ListingsController> _logger;

    public ListingsController(KaupDbContext context, ILogger<ListingsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ListingDto>>> GetListings(
        [FromQuery] string? category = null,
        [FromQuery] string? search = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null,
        [FromQuery] bool? featured = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _context.Listings
            .Include(l => l.Seller)
            .Include(l => l.Bids)
            .Where(l => l.Status == ListingStatus.Active)
            .AsQueryable();

        if (!string.IsNullOrEmpty(category))
            query = query.Where(l => l.Category == category);

        if (!string.IsNullOrEmpty(search))
            query = query.Where(l => l.Title.Contains(search) || l.Description.Contains(search));

        if (minPrice.HasValue)
            query = query.Where(l => l.Price >= minPrice.Value);

        if (maxPrice.HasValue)
            query = query.Where(l => l.Price <= maxPrice.Value);

        if (featured.HasValue)
            query = query.Where(l => l.IsFeatured == featured.Value);

        var totalCount = await query.CountAsync();
        
        var listingsQuery = await query
            .OrderByDescending(l => l.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var listings = listingsQuery.Select(l => new ListingDto
            {
                Id = l.Id,
                Title = l.Title,
                Description = l.Description,
                Price = l.Price,
                BuyNowPrice = l.BuyNowPrice,
                Category = l.Category,
                Condition = l.Condition,
                ImageUrls = l.ImageUrls,
                ListingType = l.ListingType.ToString(),
                Status = l.Status.ToString(),
                IsFeatured = l.IsFeatured,
                CreatedAt = l.CreatedAt,
                EndDate = l.EndDate,
                Seller = new SellerDto
                {
                    Id = l.Seller.Id,
                    FirstName = l.Seller.FirstName,
                    LastName = l.Seller.LastName,
                    ProfileImageUrl = l.Seller.ProfileImageUrl
                },
                BidCount = l.Bids.Count,
                HighestBid = l.Bids.Any() ? l.Bids.Max(b => b.Amount) : (decimal?)null
            })
            .ToList();

        Response.Headers.Append("X-Total-Count", totalCount.ToString());
        Response.Headers.Append("X-Page", page.ToString());
        Response.Headers.Append("X-Page-Size", pageSize.ToString());

        return Ok(listings);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ListingDto>> GetListing(Guid id)
    {
        var listing = await _context.Listings
            .Include(l => l.Seller)
            .Include(l => l.Bids)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (listing == null)
            return NotFound();

        var listingDto = new ListingDto
        {
            Id = listing.Id,
            Title = listing.Title,
            Description = listing.Description,
            Price = listing.Price,
            BuyNowPrice = listing.BuyNowPrice,
            Category = listing.Category,
            Condition = listing.Condition,
            ImageUrls = listing.ImageUrls,
            ListingType = listing.ListingType.ToString(),
            Status = listing.Status.ToString(),
            IsFeatured = listing.IsFeatured,
            CreatedAt = listing.CreatedAt,
            EndDate = listing.EndDate,
            Seller = new SellerDto
            {
                Id = listing.Seller.Id,
                FirstName = listing.Seller.FirstName,
                LastName = listing.Seller.LastName,
                ProfileImageUrl = listing.Seller.ProfileImageUrl
            },
            BidCount = listing.Bids.Count,
            HighestBid = listing.Bids.Any() ? listing.Bids.Max(b => b.Amount) : null
        };

        return Ok(listingDto);
    }

    [HttpPost]
    public async Task<ActionResult<ListingDto>> CreateListing(CreateListingDto createDto)
    {
        // Get seller from the provided SellerId
        var seller = await _context.Users.FindAsync(createDto.SellerId);
        if (seller == null)
        {
            return BadRequest("Invalid seller ID");
        }

        var listing = new Listing
        {
            Title = createDto.Title,
            Description = createDto.Description,
            Price = createDto.Price,
            BuyNowPrice = createDto.BuyNowPrice,
            Category = createDto.Category,
            Condition = createDto.Condition,
            ImageUrls = createDto.ImageUrls,
            ListingType = Enum.Parse<ListingType>(createDto.ListingType),
            IsFeatured = createDto.IsFeatured,
            EndDate = createDto.EndDate,
            SellerId = seller.Id,
            Status = ListingStatus.Active
        };

        _context.Listings.Add(listing);
        await _context.SaveChangesAsync();

        var listingDto = new ListingDto
        {
            Id = listing.Id,
            Title = listing.Title,
            Description = listing.Description,
            Price = listing.Price,
            BuyNowPrice = listing.BuyNowPrice,
            Category = listing.Category,
            Condition = listing.Condition,
            ImageUrls = listing.ImageUrls,
            ListingType = listing.ListingType.ToString(),
            Status = listing.Status.ToString(),
            IsFeatured = listing.IsFeatured,
            CreatedAt = listing.CreatedAt,
            EndDate = listing.EndDate,
            Seller = new SellerDto
            {
                Id = seller.Id,
                FirstName = seller.FirstName,
                LastName = seller.LastName,
                ProfileImageUrl = seller.ProfileImageUrl
            },
            BidCount = 0,
            HighestBid = null
        };

        return CreatedAtAction(nameof(GetListing), new { id = listing.Id }, listingDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateListing(Guid id, UpdateListingDto updateDto)
    {
        var listing = await _context.Listings.FindAsync(id);
        if (listing == null)
            return NotFound();

        // TODO: Check if authenticated user is the seller

        if (!string.IsNullOrEmpty(updateDto.Title))
            listing.Title = updateDto.Title;
        if (!string.IsNullOrEmpty(updateDto.Description))
            listing.Description = updateDto.Description;
        if (updateDto.Price.HasValue)
            listing.Price = updateDto.Price.Value;
        if (updateDto.BuyNowPrice.HasValue)
            listing.BuyNowPrice = updateDto.BuyNowPrice;
        if (!string.IsNullOrEmpty(updateDto.Category))
            listing.Category = updateDto.Category;
        if (!string.IsNullOrEmpty(updateDto.Condition))
            listing.Condition = updateDto.Condition;
        if (updateDto.ImageUrls != null)
            listing.ImageUrls = updateDto.ImageUrls;
        if (!string.IsNullOrEmpty(updateDto.Status))
            listing.Status = Enum.Parse<ListingStatus>(updateDto.Status);

        listing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteListing(Guid id, [FromQuery] Guid sellerId)
    {
        var listing = await _context.Listings
            .Include(l => l.Bids)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (listing == null)
            return NotFound(new { message = "Listing not found" });

        // Verify that the user deleting the listing is the seller
        if (listing.SellerId != sellerId)
            return Forbid();

        var bidCount = listing.Bids.Count;
        var hasRecentEnd = listing.EndDate.HasValue && 
                          listing.EndDate.Value.Subtract(DateTime.UtcNow).TotalHours < 24;

        // Business rules for deletion
        if (bidCount > 0 && hasRecentEnd)
        {
            return BadRequest(new 
            { 
                message = "Cannot delete listing with bids that ends within 24 hours",
                canDelete = false,
                bidCount = bidCount,
                hoursRemaining = (double?)(listing.EndDate?.Subtract(DateTime.UtcNow).TotalHours)
            });
        }

        // If there are bids, we mark as cancelled rather than deleting
        if (bidCount > 0)
        {
            listing.Status = ListingStatus.Cancelled;
            listing.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            
            return Ok(new 
            { 
                message = "Listing cancelled successfully",
                cancelled = true,
                bidCount = bidCount
            });
        }

        // No bids - safe to delete
        _context.Listings.Remove(listing);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Listing deleted successfully", deleted = true });
    }

    [HttpGet("featured")]
    public async Task<ActionResult<IEnumerable<ListingDto>>> GetFeaturedListings([FromQuery] int count = 10)
    {
        var listingsQuery = await _context.Listings
            .Include(l => l.Seller)
            .Include(l => l.Bids)
            .Where(l => l.Status == ListingStatus.Active && l.IsFeatured)
            .OrderByDescending(l => l.CreatedAt)
            .Take(count)
            .ToListAsync();

        var listings = listingsQuery.Select(l => new ListingDto
            {
                Id = l.Id,
                Title = l.Title,
                Description = l.Description,
                Price = l.Price,
                BuyNowPrice = l.BuyNowPrice,
                Category = l.Category,
                Condition = l.Condition,
                ImageUrls = l.ImageUrls,
                ListingType = l.ListingType.ToString(),
                Status = l.Status.ToString(),
                IsFeatured = l.IsFeatured,
                CreatedAt = l.CreatedAt,
                EndDate = l.EndDate,
                Seller = new SellerDto
                {
                    Id = l.Seller.Id,
                    FirstName = l.Seller.FirstName,
                    LastName = l.Seller.LastName,
                    ProfileImageUrl = l.Seller.ProfileImageUrl
                },
                BidCount = l.Bids.Count,
                HighestBid = l.Bids.Any() ? l.Bids.Max(b => b.Amount) : null
            })
            .ToList();

        return Ok(listings);
    }

    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<string>>> GetCategories()
    {
        var categories = await _context.Listings
            .Where(l => l.Status == ListingStatus.Active)
            .Select(l => l.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        return Ok(categories);
    }
}
