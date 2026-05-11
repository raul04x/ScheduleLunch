using SL.Domain.Entities;

namespace SL.Domain.Repositories;

public interface IGroupMembershipRepository
{
    Task<GroupMembership?> GetAsync(Guid userId, Guid groupId);
    Task<GroupMembership?> GetByUserIdAsync(Guid userId);
    Task<GroupMembership?> GetApprovedByUserIdAsync(Guid userId);
    Task<IEnumerable<GroupMembership>> GetByGroupIdAsync(Guid groupId);
    Task AddAsync(GroupMembership membership);
    Task UpdateAsync(GroupMembership membership);
    Task DeleteAsync(Guid userId, Guid groupId);
    Task DeleteByUserIdAsync(Guid userId);
}
