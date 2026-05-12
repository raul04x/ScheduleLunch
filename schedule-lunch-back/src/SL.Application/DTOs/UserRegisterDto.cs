namespace SL.Application.DTOs;

public record UserRegisterDto(string Username, string Email, string Password, string FirstName = "", string LastName = "");
public record UpdateProfileDto(string FirstName, string LastName);
