using Constellation.Models.DTOs;
using Constellation.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Constellation.Data.Repositories;

public class EventRepository : IEventRepository
{
    private readonly ConstellationDbContext _context;

    public EventRepository(ConstellationDbContext context)
    {
        _context = context;
    }

    public async Task<Event?> GetByIdAsync(int id)
    {
        return await _context.Events.FindAsync(id);
    }

    public async Task<PagedResult<Event>> GetAllAsync(int page = 1, int pageSize = 20)
    {
        var query = _context.Events.OrderByDescending(e => e.StartDate);

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Event>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<PagedResult<Event>> SearchAsync(EventSearchRequest request)
    {
        var query = _context.Events.AsQueryable();

        if (!string.IsNullOrWhiteSpace(request.Keyword))
        {
            var keyword = request.Keyword.Trim();
            query = query.Where(e =>
                e.Title.Contains(keyword) ||
                e.Description.Contains(keyword) ||
                e.Tags.Contains(keyword));
        }

        if (request.FromDate.HasValue)
        {
            query = query.Where(e => e.StartDate >= request.FromDate.Value);
        }

        if (request.ToDate.HasValue)
        {
            query = query.Where(e => e.StartDate <= request.ToDate.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.Source))
        {
            query = query.Where(e => e.Source == request.Source);
        }

        if (!string.IsNullOrWhiteSpace(request.Tag))
        {
            query = query.Where(e => e.Tags.Contains(request.Tag));
        }

        query = query.OrderByDescending(e => e.StartDate);

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        return new PagedResult<Event>
        {
            Items = items,
            TotalCount = totalCount,
            Page = request.Page,
            PageSize = request.PageSize
        };
    }

    public async Task<Event> AddAsync(Event ev)
    {
        _context.Events.Add(ev);
        await _context.SaveChangesAsync();
        return ev;
    }

    public async Task AddRangeAsync(IEnumerable<Event> events)
    {
        _context.Events.AddRange(events);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ExistsByUrlAsync(string url)
    {
        return await _context.Events.AnyAsync(e => e.Url == url);
    }

    public async Task<bool> ExistsByTitleAndDateAsync(string title, DateTime? startDate)
    {
        return await _context.Events.AnyAsync(e => e.Title == title && e.StartDate == startDate);
    }

    public async Task<List<(string Source, int Count)>> GetSourceSummariesAsync()
    {
        var results = await _context.Events
            .GroupBy(e => e.Source)
            .Select(g => new { Source = g.Key, Count = g.Count() })
            .OrderByDescending(x => x.Count)
            .ToListAsync();

        return results.Select(x => (x.Source, x.Count)).ToList();
    }
}
