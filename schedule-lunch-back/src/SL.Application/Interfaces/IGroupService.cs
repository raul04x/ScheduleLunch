using SL.Application.DTOs;

namespace SL.Application.Interfaces;

public interface IGroupService
{
    Task<IEnumerable<GroupDto>> GetAllGroupsAsync();
    Task<GroupDto?> GetUserGroupAsync(Guid userId);
    Task<IEnumerable<MemberDto>> GetGroupMembersAsync(Guid groupId);
    Task RequestJoinAsync(Guid userId, Guid groupId);
    Task ApproveMemberAsync(Guid targetUserId);
    Task RemoveMemberAsync(Guid targetUserId);
}
