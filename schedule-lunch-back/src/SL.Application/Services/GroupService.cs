using SL.Application.DTOs;
using SL.Application.Interfaces;
using SL.Domain.Entities;
using SL.Domain.Enums;
using SL.Domain.Repositories;

namespace SL.Application.Services;

public class GroupService(IGroupMembershipRepository membershipRepo, IGroupRepository groupRepo) : IGroupService
{
    public async Task<GroupDto?> GetUserGroupAsync(Guid userId)
    {
        var membership = await membershipRepo.GetApprovedByUserIdAsync(userId);
        if (membership is null) return null;
        var g = membership.Group;
        return new GroupDto(g.Id, g.Name, g.Description);
    }

    public async Task<IEnumerable<MemberDto>> GetGroupMembersAsync(Guid groupId)
    {
        var members = await membershipRepo.GetByGroupIdAsync(groupId);
        return members.Select(m => new MemberDto(
            m.UserId,
            m.User.Username,
            $"{m.User.FirstName} {m.User.LastName}".Trim(),
            m.Status,
            m.Role));
    }

    public async Task RequestJoinAsync(Guid userId, Guid groupId)
    {
        var existing = await membershipRepo.GetAsync(userId, groupId);
        if (existing is not null) return;

        await membershipRepo.AddAsync(new GroupMembership
        {
            UserId = userId,
            GroupId = groupId,
            Status = MembershipStatus.Pending,
            Role = MembershipRole.Member
        });
    }

    public async Task ApproveMemberAsync(Guid groupId, Guid targetUserId)
    {
        var membership = await membershipRepo.GetAsync(targetUserId, groupId)
            ?? throw new InvalidOperationException("Membership not found");

        membership.Status = MembershipStatus.Approved;
        await membershipRepo.UpdateAsync(membership);
    }

    public Task RemoveMemberAsync(Guid groupId, Guid targetUserId) =>
        membershipRepo.DeleteAsync(targetUserId, groupId);
}
