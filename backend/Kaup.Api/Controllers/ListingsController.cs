using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Kaup.Api.Data;
using Kaup.Api.Models;
using Kaup.Api.Models.Enums;
using Kaup.Api.DTOs;
using Kaup.Api.Services;
using Kaup.Api.Helpers;
using System.Text.Json;

namespace Kaup.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ListingsController : ControllerBase
{
    private readonly KaupDbContext _context;
    private readonly ILogger<ListingsController> _logger;
    private readonly S3Service _s3Service;

    public ListingsController(KaupDbContext context, ILogger<ListingsController> logger, S3Service s3Service)
    {
        _context = context;
        _logger = logger;
        _s3Service = s3Service;
    }

    private static Dictionary<string, object>? DeserializeCategoryFields(string? json)
    {
        if (string.IsNullOrEmpty(json))
            return null;

        try
        {
            // Use JsonDocument to properly parse and convert types
            using var doc = JsonDocument.Parse(json);
            var result = new Dictionary<string, object>();

            foreach (var property in doc.RootElement.EnumerateObject())
            {
                result[property.Name] = property.Value.ValueKind switch
                {
                    JsonValueKind.String => property.Value.GetString()!,
                    JsonValueKind.Number => property.Value.TryGetInt32(out var intVal) ? (object)intVal : property.Value.GetDouble(),
                    JsonValueKind.True => true,
                    JsonValueKind.False => false,
                    JsonValueKind.Null => null!,
                    JsonValueKind.Array => property.Value.EnumerateArray()
                        .Select(e => e.ValueKind == JsonValueKind.String ? e.GetString()! : e.ToString())
                        .ToArray(),
                    _ => property.Value.ToString()
                };
            }

            return result;
        }
        catch
        {
            return null;
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ListingDto>>> GetListings(
        [FromQuery] string? category = null,
        [FromQuery] string? subcategory = null,
        [FromQuery] string? subSubcategory = null,
        [FromQuery] string? search = null,
        [FromQuery] decimal? minPrice = null,
        [FromQuery] decimal? maxPrice = null,
        [FromQuery] bool? featured = null,
        [FromQuery] string? listingType = null,
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

        if (!string.IsNullOrEmpty(subcategory))
            query = query.Where(l => l.Subcategory == subcategory);

        if (!string.IsNullOrEmpty(subSubcategory))
            query = query.Where(l => l.SubSubcategory == subSubcategory);

        if (!string.IsNullOrEmpty(search))
        {
            var lowerSearch = search.ToLower();
            var searchTerms = lowerSearch.Split(new[] { ' ', ',', '-' }, StringSplitOptions.RemoveEmptyEntries);
            
            // Match listings where title or description contains ANY of the search terms
            query = query.Where(l => 
                searchTerms.Any(term => l.Title.ToLower().Contains(term) || l.Description.ToLower().Contains(term))
            );
            
            // After filtering, we'll sort by relevance (done later in the code)
        }

        if (minPrice.HasValue)
            query = query.Where(l => l.Price >= minPrice.Value);

        if (maxPrice.HasValue)
            query = query.Where(l => l.Price <= maxPrice.Value);

        if (featured.HasValue)
            query = query.Where(l => l.IsFeatured == featured.Value);

        if (!string.IsNullOrEmpty(listingType) && Enum.TryParse<ListingType>(listingType, out var parsedListingType))
            query = query.Where(l => l.ListingType == parsedListingType);

        var totalCount = await query.CountAsync();
        
        // Apply relevance-based sorting if there's a search query
        if (!string.IsNullOrEmpty(search))
        {
            var lowerSearch = search.ToLower();
            var searchTerms = lowerSearch.Split(new[] { ' ', ',', '-' }, StringSplitOptions.RemoveEmptyEntries);
            
            // Convert to list for in-memory sorting with complex relevance scoring
            var allResults = await query.ToListAsync();
            
            // Calculate relevance score for each listing
            var scoredResults = allResults.Select(l => new
            {
                Listing = l,
                Score = CalculateRelevanceScore(l, lowerSearch, searchTerms)
            })
            .OrderByDescending(x => x.Score)
            .ThenByDescending(x => x.Listing.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(x => x.Listing)
            .ToList();
            
            var listings = scoredResults.Select(l => new ListingDto
            {
                Id = l.Id,
                Title = l.Title,
                Description = l.Description,
                Price = l.Price,
                BuyNowPrice = l.BuyNowPrice,
                Category = l.Category,
                Subcategory = l.Subcategory,
                SubSubcategory = l.SubSubcategory,
                Condition = l.Condition.ToString(),
                ImageUrls = l.ImageUrls,
                ThumbnailUrls = l.ImageUrls.Select(url => _s3Service.GetThumbnailUrl(url)).ToArray(),
                ListingType = l.ListingType.ToString(),
                Status = l.Status.ToString(),
                IsFeatured = l.IsFeatured,
                AcceptOffers = l.AcceptOffers,
                CreatedAt = l.CreatedAt,
                EndDate = l.EndDate,
                Seller = new SellerDto
                {
                    Id = l.Seller.Id,
                    Username = l.Seller.Username,
                    FirstName = l.Seller.FirstName,
                    LastName = l.Seller.LastName,
                    ProfileImageUrl = l.Seller.ProfileImageUrl
                },
                BidCount = l.Bids.Count,
                HighestBid = l.Bids.Any() ? l.Bids.Max(b => b.Amount) : (decimal?)null,
                Quantity = l.Quantity,
                QuantitySold = l.QuantitySold,
                ItemLocation = l.ItemLocation,
                ShippingCost = l.ShippingCost,
                ShippingMethod = l.ShippingMethod,
                HandlingTime = l.HandlingTime,
                InternationalShipping = l.InternationalShipping,
                ReturnsAccepted = l.ReturnsAccepted,
                ReturnPeriod = l.ReturnPeriod,
                ReturnShippingPaidBy = l.ReturnShippingPaidBy,
                CategorySpecificFields = DeserializeCategoryFields(l.CategorySpecificFieldsJson)
            })
            .ToList();

            Response.Headers.Append("X-Total-Count", totalCount.ToString());
            Response.Headers.Append("X-Page", page.ToString());
            Response.Headers.Append("X-Page-Size", pageSize.ToString());

            return Ok(listings);
        }
        else
        {
            // No search query - use default chronological sorting
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
                Subcategory = l.Subcategory,
                SubSubcategory = l.SubSubcategory,
                Condition = l.Condition.ToString(),
                ImageUrls = l.ImageUrls,
                ThumbnailUrls = l.ImageUrls.Select(url => _s3Service.GetThumbnailUrl(url)).ToArray(),
                ListingType = l.ListingType.ToString(),
                Status = l.Status.ToString(),
                IsFeatured = l.IsFeatured,
                AcceptOffers = l.AcceptOffers,
                CreatedAt = l.CreatedAt,
                EndDate = l.EndDate,
                Seller = new SellerDto
                {
                    Id = l.Seller.Id,
                    Username = l.Seller.Username,
                    FirstName = l.Seller.FirstName,
                    LastName = l.Seller.LastName,
                    ProfileImageUrl = l.Seller.ProfileImageUrl
                },
                BidCount = l.Bids.Count,
                HighestBid = l.Bids.Any() ? l.Bids.Max(b => b.Amount) : (decimal?)null,
                Quantity = l.Quantity,
                QuantitySold = l.QuantitySold,
                ItemLocation = l.ItemLocation,
                ShippingCost = l.ShippingCost,
                ShippingMethod = l.ShippingMethod,
                HandlingTime = l.HandlingTime,
                InternationalShipping = l.InternationalShipping,
                ReturnsAccepted = l.ReturnsAccepted,
                ReturnPeriod = l.ReturnPeriod,
                ReturnShippingPaidBy = l.ReturnShippingPaidBy,
                CategorySpecificFields = DeserializeCategoryFields(l.CategorySpecificFieldsJson)
            })
            .ToList();

            Response.Headers.Append("X-Total-Count", totalCount.ToString());
            Response.Headers.Append("X-Page", page.ToString());
            Response.Headers.Append("X-Page-Size", pageSize.ToString());

            return Ok(listings);
        }
    }

    [HttpGet("search-suggestions")]
    public async Task<ActionResult<object>> GetSearchSuggestions([FromQuery] string? query, [FromQuery] int limit = 10)
    {
        if (string.IsNullOrWhiteSpace(query) || query.Length < 2)
            return Ok(new { titles = Array.Empty<string>() });

        var lowerQuery = query.ToLower();
        
        // Get title suggestions from active listings - only titles that START with the query, converted to lowercase
        var titleSuggestions = await _context.Listings
            .Where(l => l.Status == ListingStatus.Active && l.Title.ToLower().StartsWith(lowerQuery))
            .Select(l => l.Title.ToLower())
            .Distinct()
            .Take(8)
            .ToListAsync();

        return Ok(new { 
            titles = titleSuggestions
        });
    }

    [HttpGet("{id:guid}")]
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
            Subcategory = listing.Subcategory,
            SubSubcategory = listing.SubSubcategory,
            Condition = listing.Condition.ToString(),
            ImageUrls = listing.ImageUrls,
            ThumbnailUrls = listing.ImageUrls.Select(url => _s3Service.GetThumbnailUrl(url)).ToArray(),
            ListingType = listing.ListingType.ToString(),
            Status = listing.Status.ToString(),
            IsFeatured = listing.IsFeatured,
            AcceptOffers = listing.AcceptOffers,
            CreatedAt = listing.CreatedAt,
            EndDate = listing.EndDate,
            Seller = new SellerDto
            {
                Id = listing.Seller.Id,
                Username = listing.Seller.Username,
                FirstName = listing.Seller.FirstName,
                LastName = listing.Seller.LastName,
                ProfileImageUrl = listing.Seller.ProfileImageUrl
            },
            BidCount = listing.Bids.Count,
            HighestBid = listing.Bids.Any() ? listing.Bids.Max(b => b.Amount) : null,
            Quantity = listing.Quantity,
            QuantitySold = listing.QuantitySold,
            ItemLocation = listing.ItemLocation,
            ShippingCost = listing.ShippingCost,
            ShippingMethod = listing.ShippingMethod,
            HandlingTime = listing.HandlingTime,
            InternationalShipping = listing.InternationalShipping,
            ReturnsAccepted = listing.ReturnsAccepted,
            ReturnPeriod = listing.ReturnPeriod,
            ReturnShippingPaidBy = listing.ReturnShippingPaidBy,
            CategorySpecificFields = DeserializeCategoryFields(listing.CategorySpecificFieldsJson)
        };

        return Ok(listingDto);
    }

    [HttpPost]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<ActionResult<ListingDto>> CreateListing(CreateListingDto createDto)
    {
        // Get seller from the provided SellerId
        var seller = await _context.Users.FindAsync(createDto.SellerId);
        if (seller == null)
        {
            return BadRequest("Invalid seller ID");
        }

        // Verify the authenticated user is the seller
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userId == null || seller.Id != Guid.Parse(userId))
            return Forbid();

        var listing = new Listing
        {
            Title = createDto.Title,
            Description = createDto.Description,
            Price = createDto.Price,
            BuyNowPrice = createDto.BuyNowPrice,
            Category = createDto.Category,
            Subcategory = createDto.Subcategory,
            SubSubcategory = createDto.SubSubcategory,
            Condition = Enum.Parse<Condition>(createDto.Condition),
            ImageUrls = createDto.ImageUrls,
            ListingType = Enum.Parse<ListingType>(createDto.ListingType),
            IsFeatured = createDto.IsFeatured,
            AcceptOffers = createDto.AcceptOffers,
            EndDate = createDto.EndDate,
            SellerId = seller.Id,
            Status = ListingStatus.Active,
            Quantity = createDto.Quantity,
            QuantitySold = 0,
            ItemLocation = createDto.ItemLocation,
            ShippingCost = createDto.ShippingCost,
            ShippingMethod = createDto.ShippingMethod,
            HandlingTime = createDto.HandlingTime,
            InternationalShipping = createDto.InternationalShipping,
            ReturnsAccepted = createDto.ReturnsAccepted,
            ReturnPeriod = createDto.ReturnPeriod,
            ReturnShippingPaidBy = createDto.ReturnShippingPaidBy,
            CategorySpecificFieldsJson = createDto.CategorySpecificFields != null 
                ? JsonSerializer.Serialize(createDto.CategorySpecificFields) 
                : null
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
            Condition = listing.Condition.ToString(),
            ImageUrls = listing.ImageUrls,
            ThumbnailUrls = listing.ImageUrls.Select(url => _s3Service.GetThumbnailUrl(url)).ToArray(),
            ListingType = listing.ListingType.ToString(),
            Status = listing.Status.ToString(),
            IsFeatured = listing.IsFeatured,
            AcceptOffers = listing.AcceptOffers,
            CreatedAt = listing.CreatedAt,
            EndDate = listing.EndDate,
            Seller = new SellerDto
            {
                Id = seller.Id,
                Username = seller.Username,
                FirstName = seller.FirstName,
                LastName = seller.LastName,
                ProfileImageUrl = seller.ProfileImageUrl
            },
            BidCount = 0,
            HighestBid = null,
            Quantity = listing.Quantity,
            QuantitySold = listing.QuantitySold,
            ItemLocation = listing.ItemLocation,
            ShippingCost = listing.ShippingCost,
            ShippingMethod = listing.ShippingMethod,
            HandlingTime = listing.HandlingTime,
            InternationalShipping = listing.InternationalShipping,
            ReturnsAccepted = listing.ReturnsAccepted,
            ReturnPeriod = listing.ReturnPeriod,
            ReturnShippingPaidBy = listing.ReturnShippingPaidBy,
            CategorySpecificFields = DeserializeCategoryFields(listing.CategorySpecificFieldsJson)
        };

        return CreatedAtAction(nameof(GetListing), new { id = listing.Id }, listingDto);
    }

    [HttpPut("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> UpdateListing(Guid id, UpdateListingDto updateDto)
    {
        var listing = await _context.Listings.FindAsync(id);
        if (listing == null)
            return NotFound();

        // Verify the authenticated user is the seller
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userId == null || listing.SellerId != Guid.Parse(userId))
            return Forbid();

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
            listing.Condition = Enum.Parse<Condition>(updateDto.Condition);
        if (updateDto.ImageUrls != null)
            listing.ImageUrls = updateDto.ImageUrls;
        if (!string.IsNullOrEmpty(updateDto.Status))
            listing.Status = Enum.Parse<ListingStatus>(updateDto.Status);

        listing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> DeleteListing(Guid id)
    {
        var listing = await _context.Listings
            .Include(l => l.Bids)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (listing == null)
            return NotFound(new { message = "Listing not found" });

        // Verify that the authenticated user is the seller
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userId == null || listing.SellerId != Guid.Parse(userId))
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

    [HttpPatch("{id}/featured")]
    [Microsoft.AspNetCore.Authorization.Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleFeatured(Guid id, [FromBody] ToggleFeaturedDto dto)
    {
        var listing = await _context.Listings.FindAsync(id);
        if (listing == null)
            return NotFound(new { message = "Listing not found" });

        listing.IsFeatured = dto.IsFeatured;
        listing.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new 
        { 
            message = $"Listing {(dto.IsFeatured ? "marked as featured" : "removed from featured")}",
            isFeatured = listing.IsFeatured 
        });
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
                Condition = l.Condition.ToString(),
                ImageUrls = l.ImageUrls,
                ListingType = l.ListingType.ToString(),
                Status = l.Status.ToString(),
                IsFeatured = l.IsFeatured,
                AcceptOffers = l.AcceptOffers,
                CreatedAt = l.CreatedAt,
                EndDate = l.EndDate,
                Seller = new SellerDto
                {
                    Id = l.Seller.Id,
                    Username = l.Seller.Username,
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

    [HttpGet("ending-soon")]
    public async Task<ActionResult<IEnumerable<ListingDto>>> GetEndingSoonAuctions([FromQuery] int count = 6)
    {
        var now = DateTime.UtcNow;
        
        var listingsQuery = await _context.Listings
            .Include(l => l.Seller)
            .Include(l => l.Bids)
            .Where(l => l.Status == ListingStatus.Active 
                     && l.ListingType == ListingType.Auction 
                     && l.EndDate.HasValue 
                     && l.EndDate.Value > now)
            .OrderBy(l => l.EndDate)
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
                Condition = l.Condition.ToString(),
                ImageUrls = l.ImageUrls,
                ListingType = l.ListingType.ToString(),
                Status = l.Status.ToString(),
                IsFeatured = l.IsFeatured,
                AcceptOffers = l.AcceptOffers,
                CreatedAt = l.CreatedAt,
                EndDate = l.EndDate,
                Seller = new SellerDto
                {
                    Id = l.Seller.Id,
                    Username = l.Seller.Username,
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

    /// <summary>
    /// Calculate relevance score for a listing based on search query
    /// Higher score = more relevant
    /// </summary>
    private int CalculateRelevanceScore(Listing listing, string fullSearchQuery, string[] searchTerms)
    {
        int score = 0;
        var lowerTitle = listing.Title.ToLower();
        var lowerDescription = listing.Description?.ToLower() ?? "";

        // Exact phrase match in title (highest priority) +100
        if (lowerTitle.Contains(fullSearchQuery))
        {
            score += 100;
        }

        // Exact phrase match in description +50
        if (lowerDescription.Contains(fullSearchQuery))
        {
            score += 50;
        }

        // Title starts with search query +80
        if (lowerTitle.StartsWith(fullSearchQuery))
        {
            score += 80;
        }

        // Count how many search terms appear in title
        int titleTermMatches = searchTerms.Count(term => lowerTitle.Contains(term));
        score += titleTermMatches * 20; // +20 per term in title

        // Count how many search terms appear in description
        int descTermMatches = searchTerms.Count(term => lowerDescription.Contains(term));
        score += descTermMatches * 5; // +5 per term in description

        // All terms present in title +30 bonus
        if (titleTermMatches == searchTerms.Length && searchTerms.Length > 1)
        {
            score += 30;
        }

        // Featured listings get a small boost +10
        if (listing.IsFeatured)
        {
            score += 10;
        }

        // Recent listings get a tiny boost (up to +5 for listings from last 7 days)
        var daysSinceCreated = (DateTime.UtcNow - listing.CreatedAt).TotalDays;
        if (daysSinceCreated < 7)
        {
            score += (int)(5 * (1 - daysSinceCreated / 7));
        }

        return score;
    }
}
