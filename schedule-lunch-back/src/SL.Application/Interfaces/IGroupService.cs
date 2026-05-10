using SL.Application.DTOs;

namespace SL.Application.Interfaces;

public interface IGroupService
{
    Task<GroupDto?> GetUserGroupAsync(Guid userId);
    Task<IEnumerable<MemberDto>> GetGroupMembersAsync(Guid groupId);
    Task RequestJoinAsync(Guid userId, Guid groupId);
    Task ApproveMemberAsync(Guid groupId, Guid targetUserId);
    Task RemoveMemberAsync(Guid groupId, Guid targetUserId);
}
