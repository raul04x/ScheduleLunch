using SL.Domain.Helpers;

namespace SL.Domain.Entities;

public class Group : IAuditable
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public ICollection<GroupMembership> Memberships { get; set; } = new List<GroupMembership>();
}
