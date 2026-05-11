using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using SL.Application.Interfaces;

namespace SL.Api.Controllers;

[ApiController]
[Route("sch-lunch-api/groups")]
[Authorize]
public class GroupController(IGroupService groupService) : ControllerBase
{
    private Guid CurrentUserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private Guid? CurrentGroupId => User.FindFirst("groupId") is { } c ? Guid.Parse(c.Value) : null;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await groupService.GetAllGroupsAsync());

    [HttpGet("my-group")]
    public async Task<IActionResult> GetMyGroup()
    {
        var group = await groupService.GetUserGroupAsync(CurrentUserId);
        return group is null ? NotFound() : Ok(group);
    }

    [HttpGet("{groupId}/members")]
    [Authorize(Roles = "GroupAdmin,SuperAdmin")]
    public async Task<IActionResult> GetMembers(Guid groupId) =>
        Ok(await groupService.GetGroupMembersAsync(groupId));

    [HttpPost("{groupId}/join")]
    public async Task<IActionResult> RequestJoin(Guid groupId)
    {
        await groupService.RequestJoinAsync(CurrentUserId, groupId);
        return Ok();
    }

    [HttpPatch("members/{targetUserId}/approve")]
    [Authorize(Roles = "GroupAdmin,SuperAdmin")]
    public async Task<IActionResult> ApproveMember(Guid targetUserId)
    {
        await groupService.ApproveMemberAsync(targetUserId);
        return NoContent();
    }

    [HttpDelete("members/{targetUserId}")]
    [Authorize(Roles = "GroupAdmin,SuperAdmin")]
    public async Task<IActionResult> RemoveMember(Guid targetUserId)
    {
        await groupService.RemoveMemberAsync(targetUserId);
        return NoContent();
    }
}
