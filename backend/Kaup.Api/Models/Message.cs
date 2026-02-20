namespace Kaup.Api.Models;

public class Message
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Foreign keys
    public Guid SenderId { get; set; }
    public User Sender { get; set; } = null!;

    public Guid ReceiverId { get; set; }
    public User Receiver { get; set; } = null!;

    public Guid? ListingId { get; set; }
    public Listing? Listing { get; set; }

    // Conversation support
    public Guid? ConversationId { get; set; }
    public Conversation? Conversation { get; set; }

    // Message flags
    public bool IsSystemMessage { get; set; }
    public bool DeletedBySender { get; set; }
    public bool DeletedByReceiver { get; set; }
}
