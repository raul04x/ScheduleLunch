using Microsoft.EntityFrameworkCore;
using SL.Domain.Entities;
using SL.Domain.Repositories;
using SL.Infrastructure.Data;

namespace SL.Infrastructure.Repositories;

public class AttendanceRepository(ScheduleDbContext db) : IAttendanceRepository
{
    public Task<Attendance?> GetAsync(Guid userId, Guid timeSlotId) =>
        db.Attendances.FirstOrDefaultAsync(a => a.UserId == userId && a.TimeSlotId == timeSlotId);

    public async Task<IEnumerable<Attendance>> GetBySlotIdAsync(Guid timeSlotId) =>
        await db.Attendances.Include(a => a.User).Where(a => a.TimeSlotId == timeSlotId).ToListAsync();

    public Task<bool> ExistsAsync(Guid userId, Guid timeSlotId) =>
        db.Attendances.AnyAsync(a => a.UserId == userId && a.TimeSlotId == timeSlotId);

    public async Task AddAsync(Attendance attendance)
    {
        db.Attendances.Add(attendance);
        await db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid userId, Guid timeSlotId)
    {
        var a = await GetAsync(userId, timeSlotId);
        if (a is not null)
        {
            db.Attendances.Remove(a);
            await db.SaveChangesAsync();
        }
    }
}
