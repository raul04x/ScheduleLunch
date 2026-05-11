using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SL.Application.DTOs;
using SL.Application.Interfaces;

namespace SL.Api.Controllers;

[ApiController]
[Route("sch-lunch-api/admin")]
[Authorize(Roles = "SuperAdmin")]
public class AdminController(IAdminService adminService) : ControllerBase
{
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers() =>
        Ok(await adminService.GetAllUsersAsync());

    [HttpPatch("users/{userId}/role")]
    public async Task<IActionResult> UpdateRole(Guid userId, UpdateUserRoleDto dto)
    {
        await adminService.UpdateUserRoleAsync(userId, dto.Role);
        return Ok();
    }

    [HttpPatch("users/{userId}/group")]
    public async Task<IActionResult> AssignGroup(Guid userId, [FromBody] AssignGroupDto dto)
    {
        await adminService.AssignUserToGroupAsync(userId, dto.GroupId);
        return NoContent();
    }

    [HttpGet("groups")]
    public async Task<IActionResult> GetGroups() =>
        Ok(await adminService.GetAllGroupsAsync());

    [HttpPost("groups")]
    public async Task<IActionResult> CreateGroup(CreateGroupDto dto) =>
        Ok(await adminService.CreateGroupAsync(dto));

    [HttpDelete("groups/{id}")]
    public async Task<IActionResult> DeleteGroup(Guid id)
    {
        await adminService.DeleteGroupAsync(id);
        return NoContent();
    }
}
