using Kaup.Api.Models.Enums;

namespace Kaup.Api.Models;

public class User
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty; // Unique username for public display
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;

    // Optional profile information
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? ProfileImageUrl { get; set; }

    // OAuth Provider Info
    public string? GoogleId { get; set; }
    public AuthProvider AuthProvider { get; set; } = AuthProvider.Local;
    public string? Bio { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? PostalCode { get; set; }

    // Verification & login tracking
    public bool IsEmailVerified { get; set; }
    public DateTime? LastLoginAt { get; set; }

    // Seller Rating
    public decimal AverageRating { get; set; } = 0;
    public int TotalRatings { get; set; } = 0;
    public int TotalSales { get; set; } = 0;

    // Admin flag
    public bool IsAdmin { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; } // Soft delete

    // Optimistic concurrency
    public int Version { get; set; }

    // Navigation properties
    public ICollection<Listing> Listings { get; set; } = new List<Listing>();
    public ICollection<Bid> Bids { get; set; } = new List<Bid>();
    public ICollection<Message> SentMessages { get; set; } = new List<Message>();
    public ICollection<Message> ReceivedMessages { get; set; } = new List<Message>();
    public ICollection<Review> ReviewsGiven { get; set; } = new List<Review>();
    public ICollection<Review> ReviewsReceived { get; set; } = new List<Review>();
    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    public ICollection<Order> BuyerOrders { get; set; } = new List<Order>();
    public ICollection<Order> SellerOrders { get; set; } = new List<Order>();
}
