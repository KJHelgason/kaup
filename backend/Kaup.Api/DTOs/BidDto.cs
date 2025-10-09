namespace Kaup.Api.DTOs;

public class BidDto
{
    public Guid Id { get; set; }
    public decimal Amount { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid ListingId { get; set; }
    public BidderDto Bidder { get; set; } = null!;
}

public class BidderDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? ProfileImageUrl { get; set; }
}

public class PlaceBidDto
{
    public Guid ListingId { get; set; }
    public decimal Amount { get; set; }
}
