using Constellation.Models;
using Constellation.Models.Entities;

namespace Constellation.Services.Mapping;

public static class EventMapper
{
    public static Event ToEntity(DiscoveredEvent discovered)
    {
        return new Event
        {
            Title = discovered.Title,
            Description = discovered.Description,
            Url = discovered.Url,
            Location = discovered.Location,
            StartDate = discovered.StartDate,
            EndDate = discovered.EndDate,
            Source = discovered.Source,
            Tags = string.Join(",", discovered.Tags),
            RelevanceScore = discovered.RelevanceScore,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}
