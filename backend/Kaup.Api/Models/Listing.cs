namespace Kaup.Api.Models;

public class Listing
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? BuyNowPrice { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Condition { get; set; } = string.Empty;
    public string[] ImageUrls { get; set; } = Array.Empty<string>();
    public ListingType ListingType { get; set; }
    public ListingStatus Status { get; set; } = ListingStatus.Active;
    public bool IsFeatured { get; set; }
    public bool AcceptOffers { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? EndDate { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Foreign keys
    public Guid SellerId { get; set; }
    public User Seller { get; set; } = null!;
    
    // Navigation properties
    public ICollection<Bid> Bids { get; set; } = new List<Bid>();
}

public enum ListingType
{
    Auction,
    BuyNow,
    Both
}

public enum ListingStatus
{
    Draft,
    Active,
    Sold,
    Expired,
    Cancelled
}
