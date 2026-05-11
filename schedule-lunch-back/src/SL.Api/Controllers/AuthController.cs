using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using SL.Application.Auth;
using SL.Application.DTOs;
using SL.Domain.Entities;
using SL.Domain.Enums;
using SL.Infrastructure.Data;
using SL.Infrastructure.Hubs;

namespace SL.Api.Controllers;

[ApiController]
[Route("sch-lunch-api/auth")]
public class AuthController(ScheduleDbContext db, TokenService tokenService, IHubContext<ActivityHub> hub) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(UserRegisterDto dto)
    {
        if (await db.Users.AnyAsync(x => x.Username == dto.Username))
            return BadRequest("Username already exists");

        var user = new User
        {
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        var group = await db.Groups.OrderBy(g => g.CreatedAt).FirstOrDefaultAsync();
        if (group is not null)
        {
            db.GroupMemberships.Add(new GroupMembership
            {
                UserId = user.Id,
                GroupId = group.Id,
                Status = MembershipStatus.Pending,
                Role = MembershipRole.Member
            });
            await db.SaveChangesAsync();

            await hub.Clients.Group($"group-{group.Id}").SendAsync("UserPendingApproval", new
            {
                user.Id,
                user.Username,
                user.Email,
                FullName = $"{user.FirstName} {user.LastName}".Trim(),
                Role = user.Role.ToString(),
                MembershipStatus = "Pending",
                GroupId = group.Id,
            });
        }

        return Ok(new AuthResponseDto(user.Id, user.Username, tokenService.CreateToken(user)));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginDto dto)
    {
        var user = await db.Users.FirstOrDefaultAsync(x => x.Username == dto.Username);

        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized("Invalid username or password");

        var membership = await db.GroupMemberships
            .FirstOrDefaultAsync(m => m.UserId == user.Id && m.Status == MembershipStatus.Approved);

        var token = tokenService.CreateToken(user, membership?.GroupId);

        return Ok(new AuthResponseDto(user.Id, user.Username, token));
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await db.Users.FindAsync(userId);
        if (user is null) return NotFound();

        var membership = await db.GroupMemberships
            .FirstOrDefaultAsync(m => m.UserId == userId);

        return Ok(new
        {
            user.Id,
            user.Username,
            user.Email,
            user.FirstName,
            user.LastName,
            Role = user.Role.ToString(),
            GroupId = membership?.Status == MembershipStatus.Approved ? membership.GroupId : (Guid?)null,
            MembershipStatus = membership?.Status.ToString() ?? "None"
        });
    }
}
