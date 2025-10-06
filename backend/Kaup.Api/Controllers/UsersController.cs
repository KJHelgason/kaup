using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Kaup.Api.Data;
using Kaup.Api.Models;
using Kaup.Api.DTOs;

namespace Kaup.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly KaupDbContext _context;

    public UsersController(KaupDbContext context)
    {
        _context = context;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();

        return Ok(new UserDto
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
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProfile(Guid id, UpdateProfileDto updateDto)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();

        // TODO: Verify that the authenticated user matches the id

        if (!string.IsNullOrWhiteSpace(updateDto.FirstName))
            user.FirstName = updateDto.FirstName;
        
        if (!string.IsNullOrWhiteSpace(updateDto.LastName))
            user.LastName = updateDto.LastName;
        
        if (updateDto.PhoneNumber != null)
            user.PhoneNumber = updateDto.PhoneNumber;
        
        if (updateDto.Bio != null)
            user.Bio = updateDto.Bio;
        
        if (updateDto.Address != null)
            user.Address = updateDto.Address;
        
        if (updateDto.City != null)
            user.City = updateDto.City;
        
        if (updateDto.PostalCode != null)
            user.PostalCode = updateDto.PostalCode;
        
        if (updateDto.ProfileImageUrl != null)
            user.ProfileImageUrl = updateDto.ProfileImageUrl;

        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Return the updated user
        return Ok(new
        {
            id = user.Id,
            email = user.Email,
            firstName = user.FirstName,
            lastName = user.LastName,
            phoneNumber = user.PhoneNumber,
            bio = user.Bio,
            address = user.Address,
            city = user.City,
            postalCode = user.PostalCode,
            profileImageUrl = user.ProfileImageUrl,
            createdAt = user.CreatedAt,
            updatedAt = user.UpdatedAt
        });
    }

    [HttpGet("{id}/listings")]
    public async Task<ActionResult<IEnumerable<ListingDto>>> GetUserListings(Guid id)
    {
        var listingsQuery = await _context.Listings
            .Include(l => l.Seller)
            .Include(l => l.Bids)
            .Where(l => l.SellerId == id)
            .OrderByDescending(l => l.CreatedAt)
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
        }).ToList();

        return Ok(listings);
    }

    [HttpGet("{id}/reviews")]
    public async Task<ActionResult<IEnumerable<ReviewDto>>> GetUserReviews(Guid id)
    {
        var reviews = await _context.Reviews
            .Include(r => r.Reviewer)
            .Where(r => r.ReviewedUserId == id)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new ReviewDto
            {
                Id = r.Id,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt,
                Reviewer = new SellerDto
                {
                    Id = r.Reviewer.Id,
                    FirstName = r.Reviewer.FirstName,
                    LastName = r.Reviewer.LastName,
                    ProfileImageUrl = r.Reviewer.ProfileImageUrl
                },
                ListingId = r.ListingId
            })
            .ToListAsync();

        return Ok(reviews);
    }

    [HttpPost("{id}/reviews")]
    public async Task<ActionResult<ReviewDto>> CreateReview(Guid id, CreateReviewDto createDto)
    {
        // Verify reviewed user exists
        var reviewedUser = await _context.Users.FindAsync(createDto.ReviewedUserId);
        if (reviewedUser == null)
            return NotFound("User not found");

        // TODO: Get reviewer ID from authenticated user
        // For now, use the id parameter as reviewer
        var reviewer = await _context.Users.FindAsync(id);
        if (reviewer == null)
            return NotFound("Reviewer not found");

        // Validate rating
        if (createDto.Rating < 1 || createDto.Rating > 5)
            return BadRequest("Rating must be between 1 and 5");

        var review = new Review
        {
            Rating = createDto.Rating,
            Comment = createDto.Comment,
            ReviewerId = id,
            ReviewedUserId = createDto.ReviewedUserId,
            ListingId = createDto.ListingId
        };

        _context.Reviews.Add(review);

        // Update user's average rating
        var userReviews = await _context.Reviews
            .Where(r => r.ReviewedUserId == createDto.ReviewedUserId)
            .ToListAsync();
        
        userReviews.Add(review);
        
        reviewedUser.TotalRatings = userReviews.Count;
        reviewedUser.AverageRating = userReviews.Average(r => r.Rating);

        await _context.SaveChangesAsync();

        var reviewDto = new ReviewDto
        {
            Id = review.Id,
            Rating = review.Rating,
            Comment = review.Comment,
            CreatedAt = review.CreatedAt,
            Reviewer = new SellerDto
            {
                Id = reviewer.Id,
                FirstName = reviewer.FirstName,
                LastName = reviewer.LastName,
                ProfileImageUrl = reviewer.ProfileImageUrl
            },
            ListingId = review.ListingId
        };

        return CreatedAtAction(nameof(GetUser), new { id = review.Id }, reviewDto);
    }
}
