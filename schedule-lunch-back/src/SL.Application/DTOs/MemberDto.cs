using SL.Domain.Enums;

namespace SL.Application.DTOs;

public record MemberDto(Guid UserId, string Username, string FullName, MembershipStatus Status, MembershipRole Role);
