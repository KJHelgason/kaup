using Kaup.Api.Models.Enums;

namespace Kaup.Api.Models;

public class Offer
{
    public Guid Id { get; set; }
    public Guid ListingId { get; set; }
    public Guid BuyerId { get; set; }
    public Guid SellerId { get; set; }
    public decimal Amount { get; set; }
    public string? Message { get; set; }
    public OfferStatus Status { get; set; } = OfferStatus.Pending;
    public Guid? ParentOfferId { get; set; } // For counter-offers
    public DateTime ExpiresAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? RespondedAt { get; set; }

    // Navigation properties
    public Listing Listing { get; set; } = null!;
    public User Buyer { get; set; } = null!;
    public User Seller { get; set; } = null!;
    public Offer? ParentOffer { get; set; }
    public ICollection<Offer> CounterOffers { get; set; } = new List<Offer>();
}
