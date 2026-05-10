namespace SL.Application.DTOs;

public record ActivityEventDto(string UserName, string SlotLabel, string Date, int AttendeeCount, int Capacity);
