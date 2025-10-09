namespace Kaup.Api.DTOs;

public class OfferDto
{
    public Guid Id { get; set; }
    public Guid ListingId { get; set; }
    public string ListingTitle { get; set; } = string.Empty;
    public decimal ListingPrice { get; set; }
    public Guid BuyerId { get; set; }
    public string BuyerName { get; set; } = string.Empty;
    public Guid SellerId { get; set; }
    public string SellerName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? Message { get; set; }
    public string Status { get; set; } = string.Empty;
    public Guid? ParentOfferId { get; set; }
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? RespondedAt { get; set; }
}

public class CreateOfferRequest
{
    public Guid ListingId { get; set; }
    public decimal Amount { get; set; }
    public string? Message { get; set; }
}

public class RespondToOfferRequest
{
    public string Action { get; set; } = string.Empty; // "accept", "decline", "counter"
    public decimal? CounterAmount { get; set; }
    public string? Message { get; set; }
}
