using SL.Domain.Enums;

namespace SL.Domain.Entities;

public class GroupMembership
{
    public Guid UserId { get; set; }
    public Guid GroupId { get; set; }
    public MembershipStatus Status { get; set; } = MembershipStatus.Pending;
    public MembershipRole Role { get; set; } = MembershipRole.Member;
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
    public Group Group { get; set; } = null!;
}
