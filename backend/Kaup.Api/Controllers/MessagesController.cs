using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Kaup.Api.Data;
using Kaup.Api.Models;
using System.Security.Claims;

namespace Kaup.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly KaupDbContext _context;

    public MessagesController(KaupDbContext context)
    {
        _context = context;
    }

    private Guid? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userIdClaim, out var userId) ? userId : null;
    }

    // GET: api/messages/conversations
    [HttpGet("conversations")]
    public async Task<ActionResult<IEnumerable<ConversationDto>>> GetConversations()
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized();

        // Get all users the current user has had conversations with
        var conversations = await _context.Messages
            .Where(m => m.SenderId == userId.Value || m.ReceiverId == userId.Value)
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .Include(m => m.Listing)
            .GroupBy(m => m.SenderId == userId.Value ? m.ReceiverId : m.SenderId)
            .Select(g => new
            {
                OtherUserId = g.Key,
                Messages = g.OrderByDescending(m => m.CreatedAt).ToList()
            })
            .ToListAsync();

        var conversationDtos = conversations.Select(c =>
        {
            var lastMessage = c.Messages.First();
            var otherUser = lastMessage.SenderId == userId.Value ? lastMessage.Receiver : lastMessage.Sender;
            var unreadCount = c.Messages.Count(m => m.ReceiverId == userId.Value && !m.IsRead);

            return new ConversationDto
            {
                UserId = otherUser.Id,
                UserName = $"{otherUser.FirstName} {otherUser.LastName}",
                UserProfileImage = otherUser.ProfileImageUrl,
                LastMessage = lastMessage.Content,
                LastMessageTime = lastMessage.CreatedAt,
                UnreadCount = unreadCount,
                ListingId = lastMessage.ListingId,
                ListingTitle = lastMessage.Listing?.Title
            };
        }).OrderByDescending(c => c.LastMessageTime).ToList();

        return Ok(conversationDtos);
    }

    // GET: api/messages/conversation/{otherUserId}
    [HttpGet("conversation/{otherUserId}")]
    public async Task<ActionResult<IEnumerable<MessageDto>>> GetConversation(Guid otherUserId)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized();

        var messages = await _context.Messages
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .Include(m => m.Listing)
            .Where(m => (m.SenderId == userId.Value && m.ReceiverId == otherUserId) ||
                       (m.SenderId == otherUserId && m.ReceiverId == userId.Value))
            .OrderBy(m => m.CreatedAt)
            .Select(m => new MessageDto
            {
                Id = m.Id,
                Content = m.Content,
                SenderId = m.SenderId,
                SenderName = $"{m.Sender.FirstName} {m.Sender.LastName}",
                SenderProfileImage = m.Sender.ProfileImageUrl,
                ReceiverId = m.ReceiverId,
                ReceiverName = $"{m.Receiver.FirstName} {m.Receiver.LastName}",
                IsRead = m.IsRead,
                CreatedAt = m.CreatedAt,
                ListingId = m.ListingId,
                ListingTitle = m.Listing != null ? m.Listing.Title : null,
                ListingImageUrl = m.Listing != null && m.Listing.ImageUrls.Length > 0 ? m.Listing.ImageUrls[0] : null
            })
            .ToListAsync();

        // Mark messages as read
        var unreadMessages = await _context.Messages
            .Where(m => m.SenderId == otherUserId && m.ReceiverId == userId.Value && !m.IsRead)
            .ToListAsync();

        foreach (var message in unreadMessages)
        {
            message.IsRead = true;
        }

        if (unreadMessages.Any())
        {
            await _context.SaveChangesAsync();
        }

        return Ok(messages);
    }

    // POST: api/messages
    [HttpPost]
    public async Task<ActionResult<MessageDto>> SendMessage([FromBody] SendMessageDto dto)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized();

        // Validate receiver exists
        var receiver = await _context.Users.FindAsync(dto.ReceiverId);
        if (receiver == null)
            return NotFound(new { message = "Receiver not found" });

        // Validate listing if provided
        if (dto.ListingId.HasValue)
        {
            var listing = await _context.Listings.FindAsync(dto.ListingId.Value);
            if (listing == null)
                return NotFound(new { message = "Listing not found" });
        }

        // Cannot message yourself
        if (userId.Value == dto.ReceiverId)
            return BadRequest(new { message = "Cannot send message to yourself" });

        var message = new Message
        {
            SenderId = userId.Value,
            ReceiverId = dto.ReceiverId,
            Content = dto.Content,
            ListingId = dto.ListingId,
            IsRead = false
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        // Load the full message with relations
        var savedMessage = await _context.Messages
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .Include(m => m.Listing)
            .FirstOrDefaultAsync(m => m.Id == message.Id);

        var messageDto = new MessageDto
        {
            Id = savedMessage!.Id,
            Content = savedMessage.Content,
            SenderId = savedMessage.SenderId,
            SenderName = $"{savedMessage.Sender.FirstName} {savedMessage.Sender.LastName}",
            SenderProfileImage = savedMessage.Sender.ProfileImageUrl,
            ReceiverId = savedMessage.ReceiverId,
            ReceiverName = $"{savedMessage.Receiver.FirstName} {savedMessage.Receiver.LastName}",
            IsRead = savedMessage.IsRead,
            CreatedAt = savedMessage.CreatedAt,
            ListingId = savedMessage.ListingId,
            ListingTitle = savedMessage.Listing?.Title,
            ListingImageUrl = savedMessage.Listing != null && savedMessage.Listing.ImageUrls.Length > 0 ? savedMessage.Listing.ImageUrls[0] : null
        };

        return CreatedAtAction(nameof(GetConversation), new { otherUserId = dto.ReceiverId }, messageDto);
    }

    // GET: api/messages/unread-count
    [HttpGet("unread-count")]
    public async Task<ActionResult<int>> GetUnreadCount()
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized();

        var count = await _context.Messages
            .CountAsync(m => m.ReceiverId == userId.Value && !m.IsRead);

        return Ok(count);
    }

    // PUT: api/messages/{id}/mark-read
    [HttpPut("{id}/mark-read")]
    public async Task<ActionResult> MarkAsRead(Guid id)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized();

        var message = await _context.Messages.FindAsync(id);
        if (message == null)
            return NotFound();

        if (message.ReceiverId != userId.Value)
            return Forbid();

        message.IsRead = true;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/messages/{id}
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteMessage(Guid id)
    {
        var userId = GetCurrentUserId();
        if (!userId.HasValue)
            return Unauthorized();

        var message = await _context.Messages.FindAsync(id);
        if (message == null)
            return NotFound();

        // Only sender can delete their own messages
        if (message.SenderId != userId.Value)
            return Forbid();

        _context.Messages.Remove(message);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

// DTOs
public class ConversationDto
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? UserProfileImage { get; set; }
    public string LastMessage { get; set; } = string.Empty;
    public DateTime LastMessageTime { get; set; }
    public int UnreadCount { get; set; }
    public Guid? ListingId { get; set; }
    public string? ListingTitle { get; set; }
}

public class MessageDto
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public Guid SenderId { get; set; }
    public string SenderName { get; set; } = string.Empty;
    public string? SenderProfileImage { get; set; }
    public Guid ReceiverId { get; set; }
    public string ReceiverName { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; }
    public Guid? ListingId { get; set; }
    public string? ListingTitle { get; set; }
    public string? ListingImageUrl { get; set; }
}

public class SendMessageDto
{
    public Guid ReceiverId { get; set; }
    public string Content { get; set; } = string.Empty;
    public Guid? ListingId { get; set; }
}
