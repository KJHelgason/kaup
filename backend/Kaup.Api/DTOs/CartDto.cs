namespace Kaup.Api.DTOs;

public class CartItemDto
{
    public Guid Id { get; set; }
    public Guid ListingId { get; set; }
    public string ListingTitle { get; set; } = string.Empty;
    public decimal ListingPrice { get; set; }
    public string? ListingImageUrl { get; set; }
    public string ListingStatus { get; set; } = string.Empty;
    public string SellerName { get; set; } = string.Empty;
    public Guid SellerId { get; set; }
    public DateTime AddedAt { get; set; }
}

public class AddToCartDto
{
    public Guid ListingId { get; set; }
}
