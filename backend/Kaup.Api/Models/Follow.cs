namespace Kaup.Api.Models;

public class Follow
{
    public Guid Id { get; set; }
    
    // User who is following
    public Guid FollowerId { get; set; }
    public User Follower { get; set; } = null!;
    
    // User who is being followed
    public Guid FollowingId { get; set; }
    public User Following { get; set; } = null!;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
