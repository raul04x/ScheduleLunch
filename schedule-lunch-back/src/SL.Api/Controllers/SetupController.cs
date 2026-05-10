using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SL.Application.DTOs;
using SL.Domain.Entities;
using SL.Domain.Enums;
using SL.Infrastructure.Data;

namespace SL.Api.Controllers;

[ApiController]
[Route("api/setup")]
public class SetupController(ScheduleDbContext db) : ControllerBase
{
    [HttpGet("status")]
    public async Task<IActionResult> Status()
    {
        var hasSuperAdmin = await db.Users.AnyAsync(u => u.Role == UserRole.SuperAdmin);
        return Ok(new SetupStatusDto(!hasSuperAdmin));
    }

    [HttpPost("init")]
    public async Task<IActionResult> Init([FromBody] SetupInitDto dto)
    {
        var hasSuperAdmin = await db.Users.AnyAsync(u => u.Role == UserRole.SuperAdmin);
        if (hasSuperAdmin)
            return Conflict(new { message = "Setup already completed." });

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Role = UserRole.SuperAdmin
        };

        var group = new Group
        {
            Name = dto.GroupName,
            Description = dto.GroupDescription
        };

        var membership = new GroupMembership
        {
            UserId = user.Id,
            GroupId = group.Id,
            Status = MembershipStatus.Approved,
            Role = MembershipRole.Admin
        };

        db.Users.Add(user);
        db.Groups.Add(group);
        db.GroupMemberships.Add(membership);
        await db.SaveChangesAsync();

        return Ok(new { message = "Setup completed successfully." });
    }
}
