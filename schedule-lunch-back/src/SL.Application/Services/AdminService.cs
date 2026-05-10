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
        await db.Users.Select(u => new UserAdminDto(
            u.Id, u.Username, u.Email,
            $"{u.FirstName} {u.LastName}".Trim(),
            u.Role)).ToListAsync();

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
}
