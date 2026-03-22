using Constellation.Models;

namespace Constellation.Services.Interfaces;

public interface IEventSource
{
    string SourceName { get; }
    Task<IEnumerable<DiscoveredEvent>> DiscoverEventsAsync(CancellationToken cancellationToken = default);
}
