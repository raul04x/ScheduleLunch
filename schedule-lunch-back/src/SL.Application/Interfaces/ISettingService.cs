using SL.Application.DTOs;

namespace SL.Application.Interfaces;

public interface ISettingService
{
    Task<IEnumerable<SettingDto>> GetAllAsync();
    Task<SettingDto?> GetByKeyNameAsync(string keyName);
    Task<SettingDto?> RegisterAsync(SettingDto setting);
    Task<bool> UpdateAsync(SettingDto setting);
    Task<bool> DeleteAsync(string keyName);
}
