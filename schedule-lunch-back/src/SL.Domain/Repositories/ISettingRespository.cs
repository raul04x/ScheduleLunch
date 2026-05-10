using SL.Domain.Entities;

namespace SL.Domain.Repositories;

public interface ISettingRespository
{
    Task<IEnumerable<Setting>> GetAllAsync();
    Task<Setting?> GetByKeyNameAsync(string keyName);
    Task<Setting?> AddAsync(Setting setting);
    Task<bool> UpdateAsync(Setting setting);
    Task<bool> DeleteAsync(string keyName);
}
