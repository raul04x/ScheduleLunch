using SL.Domain.Entities;

namespace SL.Domain.Repositories;

public interface IAttendanceRepository
{
    Task<Attendance?> GetAsync(Guid userId, Guid timeSlotId);
    Task<IEnumerable<Attendance>> GetBySlotIdAsync(Guid timeSlotId);
    Task<bool> ExistsAsync(Guid userId, Guid timeSlotId);
    Task AddAsync(Attendance attendance);
    Task DeleteAsync(Guid userId, Guid timeSlotId);
}
