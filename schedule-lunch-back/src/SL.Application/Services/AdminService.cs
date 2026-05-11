using Microsoft.EntityFrameworkCore;
using SL.Application.DTOs;
using SL.Application.Interfaces;
using SL.Domain.Entities;
using SL.Domain.Enums;
using SL.Domain.Repositories;
using SL.Infrastructure.Data;

namespace SL.Application.Services;

public class AdminService(ScheduleDbContext db, IGroupRepository groupRepo) : IAdminService
{
    public async Task<IEnumerable<UserAdminDto>> GetAllUsersAsync() =>
        await db.Users
            .GroupJoin(
                db.GroupMemberships,
                u => u.Id,
                m => m.UserId,
                (u, memberships) => new { u, memberships })
            .SelectMany(
                x => x.memberships.DefaultIfEmpty(),
                (x, m) => new UserAdminDto(
                    x.u.Id, x.u.Username, x.u.Email,
                    $"{x.u.FirstName} {x.u.LastName}".Trim(),
                    x.u.Role,
                    m != null ? m.Status.ToString() : "None",
                    m != null ? (Guid?)m.GroupId : null))
            .ToListAsync();

    public async Task UpdateUserRoleAsync(Guid userId, UserRole role)
    {
        var user = await db.Users.FindAsync(userId)
            ?? throw new InvalidOperationException("User not found");
        user.Role = role;
        await db.SaveChangesAsync();
    }

    public async Task<IEnumerable<GroupDto>> GetAllGroupsAsync()
    {
        var groups = await groupRepo.GetAllAsync();
        return groups.Select(g => new GroupDto(g.Id, g.Name, g.Description));
    }

    public async Task<GroupDto> CreateGroupAsync(CreateGroupDto dto)
    {
        var group = new Group { Name = dto.Name, Description = dto.Description };
        await groupRepo.AddAsync(group);
        return new GroupDto(group.Id, group.Name, group.Description);
    }

    public Task DeleteGroupAsync(Guid id) => groupRepo.DeleteAsync(id);

    public async Task AssignUserToGroupAsync(Guid userId, Guid groupId)
    {
        var existing = await db.GroupMemberships.FirstOrDefaultAsync(m => m.UserId == userId);
        if (existing is not null)
            db.GroupMemberships.Remove(existing);

        db.GroupMemberships.Add(new GroupMembership
        {
            UserId = userId,
            GroupId = groupId,
            Status = MembershipStatus.Approved,
            Role = MembershipRole.Member
        });

        await db.SaveChangesAsync();
    }
}
