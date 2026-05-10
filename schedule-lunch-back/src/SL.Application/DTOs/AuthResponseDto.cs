namespace SL.Application.DTOs;

public record AuthResponseDto(Guid UserId, string Username, string Token);
