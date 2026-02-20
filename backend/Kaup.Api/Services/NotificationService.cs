using Kaup.Api.Data;
using Kaup.Api.Models;
using Kaup.Api.Models.Enums;
using Microsoft.EntityFrameworkCore;

namespace Kaup.Api.Services;

public interface INotificationService
{
    Task CreateNotificationAsync(Guid userId, NotificationType type, string title, string message, string? linkUrl = null, string? relatedEntityId = null);
    Task<List<Notification>> GetUserNotificationsAsync(Guid userId, bool unreadOnly = false);
    Task<int> GetUnreadCountAsync(Guid userId);
    Task MarkAsReadAsync(Guid[] notificationIds, Guid userId);
    Task MarkAllAsReadAsync(Guid userId);
}

public class NotificationService : INotificationService
{
    private readonly KaupDbContext _context;

    public NotificationService(KaupDbContext context)
    {
        _context = context;
    }

    public async Task CreateNotificationAsync(
        Guid userId, 
        NotificationType type, 
        string title, 
        string message, 
        string? linkUrl = null, 
        string? relatedEntityId = null)
    {
        var notification = new Notification
        {
            UserId = userId,
            Type = type,
            Title = title,
            Message = message,
            LinkUrl = linkUrl,
            RelatedEntityId = relatedEntityId
        };

        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();

        // TODO: Send email notification in background
        // TODO: Send push notification if implemented
    }

    public async Task<List<Notification>> GetUserNotificationsAsync(Guid userId, bool unreadOnly = false)
    {
        var query = _context.Notifications
            .Where(n => n.UserId == userId);

        if (unreadOnly)
        {
            query = query.Where(n => n.ReadAt == null);
        }

        return await query
            .OrderByDescending(n => n.CreatedAt)
            .Take(50) // Limit to recent 50 notifications
            .ToListAsync();
    }

    public async Task<int> GetUnreadCountAsync(Guid userId)
    {
        return await _context.Notifications
            .Where(n => n.UserId == userId && n.ReadAt == null)
            .CountAsync();
    }

    public async Task MarkAsReadAsync(Guid[] notificationIds, Guid userId)
    {
        await _context.Notifications
            .Where(n => notificationIds.Contains(n.Id) && n.UserId == userId && n.ReadAt == null)
            .ExecuteUpdateAsync(n => n.SetProperty(x => x.ReadAt, DateTime.UtcNow));
    }

    public async Task MarkAllAsReadAsync(Guid userId)
    {
        await _context.Notifications
            .Where(n => n.UserId == userId && n.ReadAt == null)
            .ExecuteUpdateAsync(n => n.SetProperty(x => x.ReadAt, DateTime.UtcNow));
    }
}
