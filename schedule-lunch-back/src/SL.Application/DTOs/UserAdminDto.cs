using SL.Domain.Enums;

namespace SL.Application.DTOs;

public record UserAdminDto(Guid Id, string Username, string Email, string FullName, UserRole Role, string MembershipStatus, Guid? GroupId);
public record UpdateUserRoleDto(UserRole Role);
public record AssignGroupDto(Guid GroupId);
