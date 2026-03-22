using Constellation.Data.Repositories;
using Constellation.Models.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Constellation.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SourcesController : ControllerBase
{
    private readonly IEventRepository _repository;

    public SourcesController(IEventRepository repository)
    {
        _repository = repository;
    }

    /// <summary>
    /// GET /api/sources — returns a summary of events grouped by source.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<SourceSummaryDto>>> GetSources()
    {
        var summaries = await _repository.GetSourceSummariesAsync();

        var dtos = summaries.Select(s => new SourceSummaryDto
        {
            Source = s.Source,
            EventCount = s.Count
        }).ToList();

        return Ok(dtos);
    }
}
