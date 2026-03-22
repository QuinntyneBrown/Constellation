using Constellation.Data.Repositories;
using Constellation.Models;
using Constellation.Models.DTOs;
using Constellation.Models.Entities;
using Constellation.Services;
using Constellation.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;

namespace Constellation.Tests.Services;

public class MiningBackgroundServiceTests
{
    private class FakeEventSource : IEventSource
    {
        public string SourceName { get; set; } = "FakeSource";
        public List<DiscoveredEvent> Events { get; set; } = new();

        public Task<IEnumerable<DiscoveredEvent>> DiscoverEventsAsync(CancellationToken cancellationToken = default)
        {
            return Task.FromResult<IEnumerable<DiscoveredEvent>>(Events);
        }
    }

    private class FakeEventRepository : IEventRepository
    {
        public List<Event> StoredEvents { get; } = new();
        private int _nextId = 1;

        public Task<Event> AddAsync(Event ev)
        {
            ev.Id = _nextId++;
            StoredEvents.Add(ev);
            return Task.FromResult(ev);
        }

        public Task AddRangeAsync(IEnumerable<Event> events)
        {
            foreach (var ev in events)
            {
                ev.Id = _nextId++;
                StoredEvents.Add(ev);
            }
            return Task.CompletedTask;
        }

        public Task<bool> ExistsByTitleAndDateAsync(string title, DateTime? startDate)
        {
            return Task.FromResult(StoredEvents.Any(e => e.Title == title && e.StartDate == startDate));
        }

        public Task<bool> ExistsByUrlAsync(string url)
        {
            return Task.FromResult(StoredEvents.Any(e => e.Url == url));
        }

        public Task<PagedResult<Event>> GetAllAsync(int page = 1, int pageSize = 20)
        {
            return Task.FromResult(new PagedResult<Event>
            {
                Items = StoredEvents.Skip((page - 1) * pageSize).Take(pageSize).ToList(),
                TotalCount = StoredEvents.Count,
                Page = page,
                PageSize = pageSize
            });
        }

        public Task<Event?> GetByIdAsync(int id)
        {
            return Task.FromResult(StoredEvents.FirstOrDefault(e => e.Id == id));
        }

        public Task<List<(string Source, int Count)>> GetSourceSummariesAsync()
        {
            return Task.FromResult(
                StoredEvents.GroupBy(e => e.Source)
                    .Select(g => (g.Key, g.Count()))
                    .ToList());
        }

        public Task<PagedResult<Event>> SearchAsync(EventSearchRequest request)
        {
            return Task.FromResult(new PagedResult<Event>
            {
                Items = StoredEvents,
                TotalCount = StoredEvents.Count,
                Page = 1,
                PageSize = 20
            });
        }
    }

    private static (MiningBackgroundService service, FakeEventSource source, FakeEventRepository repo) CreateService()
    {
        var source = new FakeEventSource();
        var repo = new FakeEventRepository();

        var services = new ServiceCollection();
        services.AddScoped<IEventRepository>(_ => repo);
        var serviceProvider = services.BuildServiceProvider();

        var scopeFactory = serviceProvider.GetRequiredService<IServiceScopeFactory>();

        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Mining:IntervalHours"] = "1"
            })
            .Build();

        var logger = NullLogger<MiningBackgroundService>.Instance;

        var service = new MiningBackgroundService(
            new[] { source },
            scopeFactory,
            config,
            logger);

        return (service, source, repo);
    }

    [Fact]
    public async Task Deduplication_SkipsDuplicateByUrl()
    {
        var (service, source, repo) = CreateService();

        // Pre-populate with an existing event
        repo.StoredEvents.Add(new Event
        {
            Id = 1,
            Title = "Existing Event",
            Url = "https://example.com/existing",
            Source = "FakeSource"
        });

        // Source discovers an event with the same URL
        source.Events.Add(new DiscoveredEvent
        {
            Title = "Duplicate Event",
            Url = "https://example.com/existing",
            Source = "FakeSource",
            Tags = new List<string> { "test" }
        });

        // Also discovers a new event
        source.Events.Add(new DiscoveredEvent
        {
            Title = "New Event",
            Url = "https://example.com/new",
            Source = "FakeSource",
            Tags = new List<string> { "test" }
        });

        using var cts = new CancellationTokenSource();
        cts.CancelAfter(TimeSpan.FromSeconds(5));

        // Use reflection to invoke the private RunMiningTickAsync method
        // Or use ExecuteAsync with a short-lived token
        await service.StartAsync(cts.Token);
        // Give it a moment to run
        await Task.Delay(500);
        await service.StopAsync(CancellationToken.None);

        // Should only have added the new event (1 existing + 1 new = 2 total)
        Assert.Equal(2, repo.StoredEvents.Count);
        Assert.Contains(repo.StoredEvents, e => e.Title == "New Event");
    }

    [Fact]
    public async Task Deduplication_SkipsDuplicateByTitleAndDate()
    {
        var (service, source, repo) = CreateService();

        var eventDate = new DateTime(2026, 6, 1);

        repo.StoredEvents.Add(new Event
        {
            Id = 1,
            Title = "Annual Conference",
            Url = "https://old-url.com/conf",
            StartDate = eventDate,
            Source = "FakeSource"
        });

        // Source discovers same-titled event with same date but different URL
        source.Events.Add(new DiscoveredEvent
        {
            Title = "Annual Conference",
            Url = "https://new-url.com/conf",
            StartDate = eventDate,
            Source = "FakeSource",
            Tags = new List<string> { "test" }
        });

        using var cts = new CancellationTokenSource();
        cts.CancelAfter(TimeSpan.FromSeconds(5));

        await service.StartAsync(cts.Token);
        await Task.Delay(500);
        await service.StopAsync(CancellationToken.None);

        // Should not have added the duplicate
        Assert.Single(repo.StoredEvents);
    }

    [Fact]
    public async Task NewEvents_AreInserted()
    {
        var (service, source, repo) = CreateService();

        source.Events.Add(new DiscoveredEvent
        {
            Title = "Brand New Event",
            Url = "https://example.com/brand-new",
            Source = "FakeSource",
            Tags = new List<string> { "new" }
        });

        using var cts = new CancellationTokenSource();
        cts.CancelAfter(TimeSpan.FromSeconds(5));

        await service.StartAsync(cts.Token);
        await Task.Delay(500);
        await service.StopAsync(CancellationToken.None);

        Assert.Single(repo.StoredEvents);
        Assert.Equal("Brand New Event", repo.StoredEvents[0].Title);
    }
}
