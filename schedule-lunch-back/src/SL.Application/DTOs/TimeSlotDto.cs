namespace SL.Application.DTOs;

public record AttendeeDto(Guid UserId, string Username, string FullName);

public record TimeSlotDto(
    Guid Id,
    Guid GroupId,
    DateOnly Date,
    string Label,
    TimeOnly StartTime,
    TimeOnly EndTime,
    int Capacity,
    int AttendeeCount,
    bool IsReservedByCurrentUser,
    IEnumerable<AttendeeDto> Attendees);
