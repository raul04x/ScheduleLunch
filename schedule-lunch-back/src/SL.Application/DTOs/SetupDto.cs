namespace SL.Application.DTOs;

public record SetupStatusDto(bool SetupRequired);

public record SetupInitDto(
    string Username,
    string Email,
    string Password,
    string FirstName,
    string LastName
);
