using Constellation.Data.Repositories;
using Constellation.Services.Interfaces;
using Constellation.Services.Mapping;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Constellation.Services;

public class MiningBackgroundService : BackgroundService
{
    private readonly IEnumerable<IEventSource> _eventSources;
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<MiningBackgroundService> _logger;
    private readonly TimeSpan _interval;

    public MiningBackgroundService(
        IEnumerable<IEventSource> eventSources,
        IServiceScopeFactory scopeFactory,
        IConfiguration configuration,
        ILogger<MiningBackgroundService> logger)
    {
        _eventSources = eventSources;
        _scopeFactory = scopeFactory;
        _logger = logger;

        var hours = configuration.GetValue<double>("Mining:IntervalHours", 6);
        _interval = TimeSpan.FromHours(hours);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("MiningBackgroundService started. Interval: {Interval}.", _interval);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await RunMiningTickAsync(stoppingToken);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                _logger.LogError(ex, "Unhandled error during mining tick.");
            }

            await Task.Delay(_interval, stoppingToken);
        }
    }

    private async Task RunMiningTickAsync(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Mining tick started at {Time}.", DateTime.UtcNow);

        var allDiscovered = new List<Models.DiscoveredEvent>();

        foreach (var source in _eventSources)
        {
            try
            {
                var events = await source.DiscoverEventsAsync(cancellationToken);
                allDiscovered.AddRange(events);
                _logger.LogInformation("Source '{Source}' returned {Count} events.", source.SourceName, events.Count());
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                _logger.LogError(ex, "Error running source '{Source}'.", source.SourceName);
            }
        }

        if (allDiscovered.Count == 0)
        {
            _logger.LogInformation("No events discovered this tick.");
            return;
        }

        using var scope = _scopeFactory.CreateScope();
        var repository = scope.ServiceProvider.GetRequiredService<IEventRepository>();

        var newEvents = new List<Models.Entities.Event>();

        foreach (var discovered in allDiscovered)
        {
            try
            {
                // Check for duplicates by URL first
                if (!string.IsNullOrWhiteSpace(discovered.Url))
                {
                    if (await repository.ExistsByUrlAsync(discovered.Url))
                        continue;
                }

                // Check for duplicates by Title + StartDate
                if (await repository.ExistsByTitleAndDateAsync(discovered.Title, discovered.StartDate))
                    continue;

                var entity = EventMapper.ToEntity(discovered);
                newEvents.Add(entity);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error checking duplicate for event '{Title}'.", discovered.Title);
            }
        }

        if (newEvents.Count > 0)
        {
            await repository.AddRangeAsync(newEvents);
            _logger.LogInformation("Persisted {Count} new events.", newEvents.Count);
        }
        else
        {
            _logger.LogInformation("No new events to persist (all duplicates).");
        }
    }
}
