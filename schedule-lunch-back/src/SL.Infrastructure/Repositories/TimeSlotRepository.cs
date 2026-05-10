using Microsoft.EntityFrameworkCore;
using SL.Domain.Entities;
using SL.Domain.Repositories;
using SL.Infrastructure.Data;

namespace SL.Infrastructure.Repositories;

public class TimeSlotRepository(ScheduleDbContext db) : ITimeSlotRepository
{
    public Task<TimeSlot?> GetByIdAsync(Guid id) =>
        db.TimeSlots
            .Include(s => s.Attendances).ThenInclude(a => a.User)
            .FirstOrDefaultAsync(s => s.Id == id);

    public async Task<IEnumerable<TimeSlot>> GetByGroupAndRangeAsync(Guid groupId, DateOnly from, DateOnly to) =>
        await db.TimeSlots
            .Include(s => s.Attendances).ThenInclude(a => a.User)
            .Where(s => s.GroupId == groupId && s.Date >= from && s.Date <= to)
            .OrderBy(s => s.Date).ThenBy(s => s.StartTime)
            .ToListAsync();

    public async Task AddAsync(TimeSlot slot)
    {
        db.TimeSlots.Add(slot);
        await db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var slot = await db.TimeSlots.FindAsync(id);
        if (slot is not null)
        {
            db.TimeSlots.Remove(slot);
            await db.SaveChangesAsync();
        }
    }
}
