namespace SL.Application.DTOs;

public record CreateTimeSlotDto(DateOnly Date, string Label, TimeOnly StartTime, TimeOnly EndTime, int Capacity);
