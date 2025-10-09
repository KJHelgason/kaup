namespace Kaup.Api.Models;

public class Notification
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public NotificationType Type { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string? LinkUrl { get; set; }
    public string? RelatedEntityId { get; set; } // ID of related offer, listing, bid, etc.
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public User User { get; set; } = null!;
}

public enum NotificationType
{
    OfferReceived,
    OfferAccepted,
    OfferDeclined,
    OfferCountered,
    OfferExpiring,
    BidPlaced,
    Outbid,
    AuctionEnding,
    AuctionWon,
    ItemSold,
    PaymentReceived,
    Message
}
