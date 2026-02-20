using Kaup.Api.Models.Enums;

namespace Kaup.Api.Models;

public class Order
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public Guid BuyerId { get; set; }
    public Guid SellerId { get; set; }
    public Guid ListingId { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal ShippingAmount { get; set; }
    public decimal PlatformFee { get; set; }
    public decimal SellerPayout { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Placed;
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;
    public string? TrackingNumber { get; set; }
    public string? ShippingCarrier { get; set; }
    public Guid? ShippingAddressId { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? PaidAt { get; set; }
    public DateTime? ShippedAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? CancelledAt { get; set; }

    // Navigation
    public User Buyer { get; set; } = null!;
    public User Seller { get; set; } = null!;
    public Listing Listing { get; set; } = null!;
    public Address? ShippingAddress { get; set; }
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}
