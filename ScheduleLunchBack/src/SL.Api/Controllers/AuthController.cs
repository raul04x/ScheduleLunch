using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SL.Application.Users;
using SL.Domain.Entities;
using SL.Infrastructure.Data;

namespace SL.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly ScheduleDbContext db;
    private readonly TokenService tokenService;

    public AuthController(ScheduleDbContext db, TokenService tokenService)
    {
        this.db = db;
        this.tokenService = tokenService;
    }

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

        var token = tokenService.CreateToken(user);

        return Ok(new AuthResponseDto(user.Id, user.Username, token));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(UserLoginDto dto)
    {
        var user = await db.Users.FirstOrDefaultAsync(x => x.Username == dto.Username);

        if (user == null)
            return Unauthorized("Invalid username or password");

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized("Invalid username or password");

        var token = tokenService.CreateToken(user);

        return Ok(new AuthResponseDto(user.Id, user.Username, token));
    }
}
