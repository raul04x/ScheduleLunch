using SL.Domain.Entities;

namespace SL.Domain.Repositories;

public interface IGroupRepository
{
    Task<Group?> GetByIdAsync(Guid id);
    Task<IEnumerable<Group>> GetAllAsync();
    Task AddAsync(Group group);
    Task DeleteAsync(Guid id);
}
