using Moq;
using SL.Application.Services;
using SL.Domain.Entities;
using SL.Domain.Enums;
using SL.Domain.Repositories;

namespace SL.Tests.Services;

public class GroupServiceTests
{
    private readonly Mock<IGroupRepository> _groupRepo = new();
    private readonly Mock<IGroupMembershipRepository> _membershipRepo = new();

    private GroupService CreateSut() => new(_groupRepo.Object, _membershipRepo.Object);

    [Fact]
    public async Task GetUserGroupAsync_ReturnsNull_WhenNoApprovedMembership()
    {
        _membershipRepo.Setup(r => r.GetApprovedByUserIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((GroupMembership?)null);

        var result = await CreateSut().GetUserGroupAsync(Guid.NewGuid());

        Assert.Null(result);
    }

    [Fact]
    public async Task GetUserGroupAsync_ReturnsGroupDto_WhenApprovedMembershipExists()
    {
        var groupId = Guid.NewGuid();
        var userId = Guid.NewGuid();
        var membership = new GroupMembership
        {
            UserId = userId,
            GroupId = groupId,
            Status = MembershipStatus.Approved,
            Group = new Group { Id = groupId, Name = "Test Group", Description = "Desc" }
        };

        _membershipRepo.Setup(r => r.GetApprovedByUserIdAsync(userId)).ReturnsAsync(membership);

        var result = await CreateSut().GetUserGroupAsync(userId);

        Assert.NotNull(result);
        Assert.Equal("Test Group", result.Name);
    }

    [Fact]
    public async Task RequestJoinAsync_DoesNothing_WhenMembershipAlreadyExists()
    {
        var userId = Guid.NewGuid();
        var groupId = Guid.NewGuid();
        _membershipRepo.Setup(r => r.GetAsync(userId, groupId))
            .ReturnsAsync(new GroupMembership { UserId = userId, GroupId = groupId });

        await CreateSut().RequestJoinAsync(userId, groupId);

        _membershipRepo.Verify(r => r.AddAsync(It.IsAny<GroupMembership>()), Times.Never);
    }

    [Fact]
    public async Task ApproveMemberAsync_Throws_WhenMembershipNotFound()
    {
        _membershipRepo.Setup(r => r.GetByUserIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((GroupMembership?)null);

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => CreateSut().ApproveMemberAsync(Guid.NewGuid()));
    }
}
