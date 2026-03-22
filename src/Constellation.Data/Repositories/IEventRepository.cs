using Constellation.Models.DTOs;
using Constellation.Models.Entities;

namespace Constellation.Data.Repositories;

public interface IEventRepository
{
    Task<Event?> GetByIdAsync(int id);
    Task<PagedResult<Event>> GetAllAsync(int page = 1, int pageSize = 20);
    Task<PagedResult<Event>> SearchAsync(EventSearchRequest request);
    Task<Event> AddAsync(Event ev);
    Task AddRangeAsync(IEnumerable<Event> events);
    Task<bool> ExistsByUrlAsync(string url);
    Task<bool> ExistsByTitleAndDateAsync(string title, DateTime? startDate);
    Task<List<(string Source, int Count, DateTime? LastSyncTime)>> GetSourceSummariesAsync();
}
