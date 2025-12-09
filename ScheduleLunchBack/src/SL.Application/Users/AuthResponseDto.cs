namespace SL.Application.Users;

public record AuthResponseDto(Guid UserId, string Username, string Token);
