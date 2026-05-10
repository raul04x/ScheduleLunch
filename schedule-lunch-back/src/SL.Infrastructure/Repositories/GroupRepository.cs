using Microsoft.EntityFrameworkCore;
using SL.Domain.Entities;
using SL.Domain.Repositories;
using SL.Infrastructure.Data;

namespace SL.Infrastructure.Repositories;

public class GroupRepository(ScheduleDbContext db) : IGroupRepository
{
    public Task<Group?> GetByIdAsync(Guid id) =>
        db.Groups.FirstOrDefaultAsync(g => g.Id == id);

    public async Task<IEnumerable<Group>> GetAllAsync() =>
        await db.Groups.ToListAsync();

    public async Task AddAsync(Group group)
    {
        db.Groups.Add(group);
        await db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var group = await db.Groups.FindAsync(id);
        if (group is not null)
        {
            db.Groups.Remove(group);
            await db.SaveChangesAsync();
        }
    }
}
