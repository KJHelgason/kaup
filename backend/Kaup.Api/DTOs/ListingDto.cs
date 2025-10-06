namespace Kaup.Api.DTOs;

public class ListingDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? BuyNowPrice { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Condition { get; set; } = string.Empty;
    public string[] ImageUrls { get; set; } = Array.Empty<string>();
    public string ListingType { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public bool IsFeatured { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? EndDate { get; set; }
    public SellerDto Seller { get; set; } = null!;
    public int BidCount { get; set; }
    public decimal? HighestBid { get; set; }
}

public class SellerDto
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? ProfileImageUrl { get; set; }
}

public class CreateListingDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? BuyNowPrice { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Condition { get; set; } = string.Empty;
    public string[] ImageUrls { get; set; } = Array.Empty<string>();
    public string ListingType { get; set; } = string.Empty;
    public bool IsFeatured { get; set; }
    public DateTime? EndDate { get; set; }
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
