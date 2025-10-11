namespace Kaup.Api.DTOs;

public class ListingDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? BuyNowPrice { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? Subcategory { get; set; }
    public string? SubSubcategory { get; set; }
    public string Condition { get; set; } = string.Empty;
    public string[] ImageUrls { get; set; } = Array.Empty<string>();
    public string[] ThumbnailUrls { get; set; } = Array.Empty<string>(); // Auto-generated thumbnails
    public string ListingType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public bool IsFeatured { get; set; }
    public bool AcceptOffers { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? EndDate { get; set; }
    public SellerDto Seller { get; set; } = null!;
    public int BidCount { get; set; }
    public decimal? HighestBid { get; set; }
    
    // Inventory
    public int Quantity { get; set; }
    public int QuantitySold { get; set; }
    
    // Shipping
    public string? ItemLocation { get; set; }
    public decimal ShippingCost { get; set; }
    public string? ShippingMethod { get; set; }
    public int? HandlingTime { get; set; }
    public bool InternationalShipping { get; set; }
    
    // Returns
    public bool ReturnsAccepted { get; set; }
    public int? ReturnPeriod { get; set; }
    public string? ReturnShippingPaidBy { get; set; }
    
    // Category-Specific Fields
    public Dictionary<string, object>? CategorySpecificFields { get; set; }
}

public class SellerDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? ProfileImageUrl { get; set; }
}

public class CreateListingDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? BuyNowPrice { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? Subcategory { get; set; }
    public string? SubSubcategory { get; set; }
    public string Condition { get; set; } = string.Empty;
    public string[] ImageUrls { get; set; } = Array.Empty<string>();
    public string ListingType { get; set; } = string.Empty;
    public bool IsFeatured { get; set; }
    public bool AcceptOffers { get; set; }
    public DateTime? EndDate { get; set; }
    public Guid SellerId { get; set; }
    
    // Inventory
    public int Quantity { get; set; } = 1;
    
    // Shipping
    public string? ItemLocation { get; set; }
    public decimal ShippingCost { get; set; } = 0;
    public string? ShippingMethod { get; set; }
    public int? HandlingTime { get; set; }
    public bool InternationalShipping { get; set; } = false;
    
    // Returns
    public bool ReturnsAccepted { get; set; } = false;
    public int? ReturnPeriod { get; set; }
    public string? ReturnShippingPaidBy { get; set; }
    
    // Category-Specific Fields
    public Dictionary<string, object>? CategorySpecificFields { get; set; }
}

public class UpdateListingDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public decimal? BuyNowPrice { get; set; }
    public string? Category { get; set; }
    public string? Condition { get; set; }
    public string[]? ImageUrls { get; set; }
    public string? Status { get; set; }
}

public class ToggleFeaturedDto
{
    public bool IsFeatured { get; set; }
}
