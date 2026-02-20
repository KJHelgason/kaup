using Kaup.Api.Models;
using Kaup.Api.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace Kaup.Api.Data;

public class KaupDbContext : DbContext
{
    public KaupDbContext(DbContextOptions<KaupDbContext> options) : base(options) { }

    // Core entities
    public DbSet<User> Users { get; set; }
    public DbSet<Listing> Listings { get; set; }
    public DbSet<Bid> Bids { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Offer> Offers { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Watchlist> Watchlists { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Follow> Follows { get; set; }

    // New entities
    public DbSet<Category> Categories { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<ListingImage> ListingImages { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<ConversationParticipant> ConversationParticipants { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Register PostgreSQL enums
        modelBuilder.HasPostgresEnum<ListingType>();
        modelBuilder.HasPostgresEnum<ListingStatus>();
        modelBuilder.HasPostgresEnum<OfferStatus>();
        modelBuilder.HasPostgresEnum<NotificationType>();
        modelBuilder.HasPostgresEnum<Condition>();
        modelBuilder.HasPostgresEnum<AuthProvider>();
        modelBuilder.HasPostgresEnum<OrderStatus>();
        modelBuilder.HasPostgresEnum<PaymentStatus>();

        // ===== USER =====
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.GoogleId).HasFilter("\"GoogleId\" IS NOT NULL");

            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Username).IsRequired().HasMaxLength(50);
            entity.Property(e => e.PasswordHash).IsRequired();
            entity.Property(e => e.FirstName).HasMaxLength(100);
            entity.Property(e => e.LastName).HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).HasMaxLength(20);
            entity.Property(e => e.Bio).HasMaxLength(1000);
            entity.Property(e => e.AverageRating).HasPrecision(3, 2);
            entity.Property(e => e.Version).IsConcurrencyToken();

            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // ===== CATEGORY =====
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Slug).IsUnique();
            entity.HasIndex(e => new { e.ParentId, e.Position });

            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Slug).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);

            entity.HasOne(e => e.Parent)
                .WithMany(e => e.Children)
                .HasForeignKey(e => e.ParentId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ===== LISTING =====
        modelBuilder.Entity<Listing>(entity =>
        {
            entity.HasKey(e => e.Id);

            // Indexes for common queries
            entity.HasIndex(e => e.Status);
            entity.HasIndex(e => new { e.Status, e.CreatedAt });
            entity.HasIndex(e => new { e.CategoryId, e.Status });
            entity.HasIndex(e => new { e.SellerId, e.Status });
            entity.HasIndex(e => new { e.IsFeatured, e.Status });
            entity.HasIndex(e => new { e.ListingType, e.Status, e.EndDate });
            entity.HasIndex(e => e.Price);
            entity.HasIndex(e => e.Slug);
            entity.HasIndex(e => e.EndDate).HasFilter("\"Status\" = 1"); // Active only

            // Full-text search vector with GIN index
            entity.HasGeneratedTsVectorColumn(
                e => e.SearchVector,
                "simple",
                e => new { e.Title, e.Description })
                .HasIndex(e => e.SearchVector)
                .HasMethod("GIN");

            entity.Property(e => e.Title).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Description).IsRequired();
            entity.Property(e => e.Price).HasPrecision(18, 2);
            entity.Property(e => e.BuyNowPrice).HasPrecision(18, 2);
            entity.Property(e => e.ShippingCost).HasPrecision(18, 2);
            entity.Property(e => e.Category).HasMaxLength(100);
            entity.Property(e => e.Subcategory).HasMaxLength(100);
            entity.Property(e => e.SubSubcategory).HasMaxLength(100);
            entity.Property(e => e.Slug).HasMaxLength(300);
            entity.Property(e => e.CategorySpecificFieldsJson).HasColumnType("jsonb");
            entity.Property(e => e.Version).IsConcurrencyToken();

            // Check constraints
            entity.ToTable(t => t.HasCheckConstraint("CK_Listing_Price_Positive", "\"Price\" >= 0"));

            entity.HasOne(e => e.Seller)
                .WithMany(e => e.Listings)
                .HasForeignKey(e => e.SellerId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.CategoryNavigation)
                .WithMany(e => e.Listings)
                .HasForeignKey(e => e.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasQueryFilter(e => e.DeletedAt == null);
        });

        // ===== LISTING IMAGE =====
        modelBuilder.Entity<ListingImage>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.ListingId, e.Position });

            entity.Property(e => e.Url).IsRequired().HasMaxLength(500);
            entity.Property(e => e.ThumbnailUrl).HasMaxLength(500);

            entity.HasOne(e => e.Listing)
                .WithMany(e => e.Images)
                .HasForeignKey(e => e.ListingId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ===== BID =====
        modelBuilder.Entity<Bid>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.ListingId, e.Amount });
            entity.HasIndex(e => new { e.BidderId, e.CreatedAt });

            entity.Property(e => e.Amount).HasPrecision(18, 2);

            entity.ToTable(t => t.HasCheckConstraint("CK_Bid_Amount_Positive", "\"Amount\" > 0"));

            entity.HasOne(e => e.Listing)
                .WithMany(e => e.Bids)
                .HasForeignKey(e => e.ListingId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Bidder)
                .WithMany(e => e.Bids)
                .HasForeignKey(e => e.BidderId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ===== MESSAGE =====
        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.SenderId, e.ReceiverId, e.CreatedAt });
            entity.HasIndex(e => e.ConversationId);

            entity.Property(e => e.Content).IsRequired();

            entity.HasOne(e => e.Sender)
                .WithMany(e => e.SentMessages)
                .HasForeignKey(e => e.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Receiver)
                .WithMany(e => e.ReceivedMessages)
                .HasForeignKey(e => e.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Listing)
                .WithMany()
                .HasForeignKey(e => e.ListingId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Conversation)
                .WithMany(e => e.Messages)
                .HasForeignKey(e => e.ConversationId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // ===== REVIEW =====
        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.ReviewedUserId, e.CreatedAt });
            entity.HasIndex(e => new { e.ReviewerId, e.ListingId }).IsUnique()
                .HasFilter("\"ListingId\" IS NOT NULL");

            entity.Property(e => e.Comment).HasMaxLength(1000);

            entity.ToTable(t => t.HasCheckConstraint("CK_Review_Rating_Range", "\"Rating\" >= 1 AND \"Rating\" <= 5"));

            entity.HasOne(e => e.Reviewer)
                .WithMany(e => e.ReviewsGiven)
                .HasForeignKey(e => e.ReviewerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.ReviewedUser)
                .WithMany(e => e.ReviewsReceived)
                .HasForeignKey(e => e.ReviewedUserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Listing)
                .WithMany()
                .HasForeignKey(e => e.ListingId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(e => e.Order)
                .WithMany(e => e.Reviews)
                .HasForeignKey(e => e.OrderId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // ===== OFFER =====
        modelBuilder.Entity<Offer>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.ListingId, e.Status });
            entity.HasIndex(e => new { e.BuyerId, e.Status });
            entity.HasIndex(e => new { e.SellerId, e.Status });

            entity.Property(e => e.Amount).HasPrecision(18, 2);
            entity.Property(e => e.Message).HasMaxLength(500);

            entity.HasOne(e => e.Listing)
                .WithMany()
                .HasForeignKey(e => e.ListingId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Buyer)
                .WithMany()
                .HasForeignKey(e => e.BuyerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Seller)
                .WithMany()
                .HasForeignKey(e => e.SellerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.ParentOffer)
                .WithMany(e => e.CounterOffers)
                .HasForeignKey(e => e.ParentOfferId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // ===== NOTIFICATION =====
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.ReadAt }).HasFilter("\"ReadAt\" IS NULL");
            entity.HasIndex(e => e.CreatedAt);

            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Message).IsRequired().HasMaxLength(500);
            entity.Property(e => e.LinkUrl).HasMaxLength(500);
            entity.Property(e => e.RelatedEntityId).HasMaxLength(100);

            // Ignore the computed IsRead property
            entity.Ignore(e => e.IsRead);

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ===== WATCHLIST =====
        modelBuilder.Entity<Watchlist>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.ListingId }).IsUnique();
            entity.HasIndex(e => e.CreatedAt);

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Listing)
                .WithMany()
                .HasForeignKey(e => e.ListingId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ===== CART ITEM =====
        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.UserId, e.ListingId }).IsUnique();
            entity.HasIndex(e => e.CreatedAt);

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Listing)
                .WithMany()
                .HasForeignKey(e => e.ListingId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ===== FOLLOW =====
        modelBuilder.Entity<Follow>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.FollowerId, e.FollowingId }).IsUnique();
            entity.HasIndex(e => e.CreatedAt);

            entity.ToTable(t => t.HasCheckConstraint("CK_Follow_No_Self_Follow", "\"FollowerId\" != \"FollowingId\""));

            entity.HasOne(e => e.Follower)
                .WithMany()
                .HasForeignKey(e => e.FollowerId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Following)
                .WithMany()
                .HasForeignKey(e => e.FollowingId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ===== ADDRESS =====
        modelBuilder.Entity<Address>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId);

            entity.Property(e => e.Label).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Street).IsRequired().HasMaxLength(200);
            entity.Property(e => e.City).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PostalCode).IsRequired().HasMaxLength(20);
            entity.Property(e => e.CountryCode).IsRequired().HasMaxLength(2);

            entity.HasOne(e => e.User)
                .WithMany(e => e.Addresses)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ===== ORDER =====
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.OrderNumber).IsUnique();
            entity.HasIndex(e => new { e.BuyerId, e.CreatedAt });
            entity.HasIndex(e => new { e.SellerId, e.Status });
            entity.HasIndex(e => e.PaymentStatus).HasFilter("\"PaymentStatus\" = 0"); // Pending only

            entity.Property(e => e.OrderNumber).IsRequired().HasMaxLength(50);
            entity.Property(e => e.TotalAmount).HasPrecision(18, 2);
            entity.Property(e => e.ShippingAmount).HasPrecision(18, 2);
            entity.Property(e => e.PlatformFee).HasPrecision(18, 2);
            entity.Property(e => e.SellerPayout).HasPrecision(18, 2);
            entity.Property(e => e.TrackingNumber).HasMaxLength(100);
            entity.Property(e => e.ShippingCarrier).HasMaxLength(100);
            entity.Property(e => e.Notes).HasMaxLength(1000);

            entity.HasOne(e => e.Buyer)
                .WithMany(e => e.BuyerOrders)
                .HasForeignKey(e => e.BuyerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Seller)
                .WithMany(e => e.SellerOrders)
                .HasForeignKey(e => e.SellerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Listing)
                .WithMany(e => e.Orders)
                .HasForeignKey(e => e.ListingId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.ShippingAddress)
                .WithMany()
                .HasForeignKey(e => e.ShippingAddressId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // ===== CONVERSATION =====
        modelBuilder.Entity<Conversation>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasOne(e => e.Listing)
                .WithMany()
                .HasForeignKey(e => e.ListingId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // ===== CONVERSATION PARTICIPANT =====
        modelBuilder.Entity<ConversationParticipant>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => new { e.ConversationId, e.UserId }).IsUnique();
            entity.HasIndex(e => e.UserId);

            entity.HasOne(e => e.Conversation)
                .WithMany(e => e.Participants)
                .HasForeignKey(e => e.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
