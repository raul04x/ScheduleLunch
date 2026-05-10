using SL.Application.DTOs;
using SL.Domain.Enums;

namespace SL.Application.Interfaces;

public interface IAdminService
{
    Task<IEnumerable<UserAdminDto>> GetAllUsersAsync();
    Task UpdateUserRoleAsync(Guid userId, UserRole role);
    Task<IEnumerable<GroupDto>> GetAllGroupsAsync();
    Task<GroupDto> CreateGroupAsync(CreateGroupDto dto);
    Task DeleteGroupAsync(Guid id);
}
