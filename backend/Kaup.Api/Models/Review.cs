namespace Kaup.Api.Models;

public class Review
{
    public Guid Id { get; set; }
    public int Rating { get; set; } // 1-5 stars
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // The user giving the review
    public Guid ReviewerId { get; set; }
    public User Reviewer { get; set; } = null!;
    
    // The user receiving the review (seller)
    public Guid ReviewedUserId { get; set; }
    public User ReviewedUser { get; set; } = null!;
    
    // Optional: Link to a specific listing/transaction
    public Guid? ListingId { get; set; }
    public Listing? Listing { get; set; }
}
