using SL.Domain.Entities;

namespace SL.Domain.Repositories;

public interface ITimeSlotRepository
{
    Task<TimeSlot?> GetByIdAsync(Guid id);
    Task<IEnumerable<TimeSlot>> GetByGroupAndRangeAsync(Guid groupId, DateOnly from, DateOnly to);
    Task AddAsync(TimeSlot slot);
    Task DeleteAsync(Guid id);
}
