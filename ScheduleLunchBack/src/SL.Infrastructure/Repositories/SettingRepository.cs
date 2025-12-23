using Microsoft.EntityFrameworkCore;
using SL.Domain.Entities;
using SL.Domain.Repositories;
using SL.Infrastructure.Data;

namespace SL.Infrastructure.Repositories;

public class SettingRepository : ISettingRespository
{
    private readonly ScheduleDbContext _context;

    public SettingRepository(ScheduleDbContext context)
    {
        _context = context;
    }

    public async Task<Setting?> AddAsync(Setting setting)
    {
        var entry = await _context.Settings.AddAsync(setting);
        await _context.SaveChangesAsync();
        return entry.Entity;
    }

    public async Task<bool> DeleteAsync(string keyName)
    {
        var setting = await _context.Settings.FirstOrDefaultAsync(s => s.KeyName == keyName);
        if (setting == null) return false;
        _context.Settings.Remove(setting);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<Setting>> GetAllAsync()
    {
        return await _context.Settings.ToListAsync();
    }

    public async Task<Setting?> GetByKeyNameAsync(string keyName)
    {
        return await _context.Settings.FirstOrDefaultAsync(s => s.KeyName == keyName);
    }

    public async Task<bool> UpdateAsync(Setting setting)
    {
        var existingSetting = await _context.Settings.FirstOrDefaultAsync(s => s.KeyName == setting.KeyName);
        if (existingSetting == null) return false;

        existingSetting.Config = setting.Config;
        _context.Settings.Update(existingSetting);
        await _context.SaveChangesAsync();
        return true;
    }
}
