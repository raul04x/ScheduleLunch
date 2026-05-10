using SL.Application.DTOs;

namespace SL.Application.Interfaces;

public interface IScheduleService
{
    Task<IEnumerable<TimeSlotDto>> GetWeekSlotsAsync(Guid groupId, Guid currentUserId);
    Task<IEnumerable<TimeSlotDto>> GetDaySlotsAsync(Guid groupId, DateOnly date, Guid currentUserId);
    Task<TimeSlotDto> ReserveSlotAsync(Guid slotId, Guid userId);
    Task<TimeSlotDto> CancelReservationAsync(Guid slotId, Guid userId);
    Task<TimeSlotDto> CreateSlotAsync(Guid groupId, CreateTimeSlotDto dto);
    Task DeleteSlotAsync(Guid slotId);
}
