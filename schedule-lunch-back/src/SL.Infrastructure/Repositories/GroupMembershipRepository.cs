using Microsoft.EntityFrameworkCore;
using SL.Domain.Entities;
using SL.Domain.Enums;
using SL.Domain.Repositories;
using SL.Infrastructure.Data;

namespace SL.Infrastructure.Repositories;

public class GroupMembershipRepository(ScheduleDbContext db) : IGroupMembershipRepository
{
    public Task<GroupMembership?> GetAsync(Guid userId, Guid groupId) =>
        db.GroupMemberships.FirstOrDefaultAsync(m => m.UserId == userId && m.GroupId == groupId);

    public Task<GroupMembership?> GetApprovedByUserIdAsync(Guid userId) =>
        db.GroupMemberships
            .Include(m => m.Group)
            .FirstOrDefaultAsync(m => m.UserId == userId && m.Status == MembershipStatus.Approved);

    public async Task<IEnumerable<GroupMembership>> GetByGroupIdAsync(Guid groupId) =>
        await db.GroupMemberships
            .Include(m => m.User)
            .Where(m => m.GroupId == groupId)
            .ToListAsync();

    public async Task AddAsync(GroupMembership membership)
    {
        db.GroupMemberships.Add(membership);
        await db.SaveChangesAsync();
    }

    public async Task UpdateAsync(GroupMembership membership)
    {
        db.GroupMemberships.Update(membership);
        await db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid userId, Guid groupId)
    {
        var m = await GetAsync(userId, groupId);
        if (m is not null)
        {
            db.GroupMemberships.Remove(m);
            await db.SaveChangesAsync();
        }
    }
}
