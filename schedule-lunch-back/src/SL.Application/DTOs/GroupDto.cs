namespace SL.Application.DTOs;

public record GroupDto(Guid Id, string Name, string? Description);
public record CreateGroupDto(string Name, string? Description);
