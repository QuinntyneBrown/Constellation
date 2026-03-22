using Constellation.Data.Repositories;
using Constellation.Models.DTOs;
using Constellation.Models.Entities;
using Microsoft.AspNetCore.Mvc;

namespace Constellation.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IEventRepository _repository;

    public EventsController(IEventRepository repository)
    {
        _repository = repository;
    }

    /// <summary>
    /// GET /api/events — paginated list with optional filters.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PagedResult<EventDto>>> GetEvents(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? keyword = null,
        [FromQuery] DateTime? fromDate = null,
        [FromQuery] DateTime? toDate = null,
        [FromQuery] string? source = null,
        [FromQuery] string? tag = null)
    {
        var request = new EventSearchRequest
        {
            Keyword = keyword,
            FromDate = fromDate,
            ToDate = toDate,
            Source = source,
            Tag = tag,
            Page = page,
            PageSize = pageSize
        };

        var result = await _repository.SearchAsync(request);

        var dto = new PagedResult<EventDto>
        {
            Items = result.Items.Select(MapToDto).ToList(),
            TotalCount = result.TotalCount,
            Page = result.Page,
            PageSize = result.PageSize
        };

        return Ok(dto);
    }

    /// <summary>
    /// GET /api/events/{id} — single event by id.
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<EventDto>> GetEvent(int id)
    {
        var ev = await _repository.GetByIdAsync(id);
        if (ev is null)
            return NotFound();

        return Ok(MapToDto(ev));
    }

    /// <summary>
    /// GET /api/events/search?q={query} — full-text search on Title, Description, Tags.
    /// </summary>
    [HttpGet("search")]
    public async Task<ActionResult<List<EventDto>>> Search([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q))
            return Ok(new List<EventDto>());

        var request = new EventSearchRequest
        {
            Keyword = q,
            Page = 1,
            PageSize = 50
        };

        var result = await _repository.SearchAsync(request);
        var dtos = result.Items.Select(MapToDto).ToList();

        return Ok(dtos);
    }

    private static EventDto MapToDto(Event entity)
    {
        return new EventDto
        {
            Id = entity.Id,
            Title = entity.Title,
            Description = entity.Description,
            Url = entity.Url,
            Location = entity.Location,
            StartDate = entity.StartDate,
            EndDate = entity.EndDate,
            Source = entity.Source,
            Tags = string.IsNullOrWhiteSpace(entity.Tags)
                ? new List<string>()
                : entity.Tags.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList(),
            RelevanceScore = entity.RelevanceScore
        };
    }
}
