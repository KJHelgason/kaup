namespace Kaup.Api.Models;

public class Bid
{
    public Guid Id { get; set; }
    public decimal Amount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Foreign keys
    public Guid ListingId { get; set; }
    public Listing Listing { get; set; } = null!;
    
    public Guid BidderId { get; set; }
    public User Bidder { get; set; } = null!;
}
