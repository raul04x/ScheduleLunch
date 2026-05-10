using SL.Domain.Enums;

namespace SL.Application.DTOs;

public record UserAdminDto(Guid Id, string Username, string Email, string FullName, UserRole Role);
public record UpdateUserRoleDto(UserRole Role);
