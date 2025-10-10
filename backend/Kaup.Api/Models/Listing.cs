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
    
    // Inventory Management
    public int Quantity { get; set; } = 1;
    public int QuantitySold { get; set; } = 0;
    
    // Shipping Information
    public string? ItemLocation { get; set; } // City or region where item is located
    public decimal ShippingCost { get; set; } = 0; // 0 means free shipping
    public string? ShippingMethod { get; set; } // "Standard", "Express", "Pickup Only", etc.
    public int? HandlingTime { get; set; } // Days to ship after purchase
    public bool InternationalShipping { get; set; } = false;
    
    // Return Policy
    public bool ReturnsAccepted { get; set; } = false;
    public int? ReturnPeriod { get; set; } // Days (e.g., 30, 60)
    public string? ReturnShippingPaidBy { get; set; } // "Buyer" or "Seller"
    
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
