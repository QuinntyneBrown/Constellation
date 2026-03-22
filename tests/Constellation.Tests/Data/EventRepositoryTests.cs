using Constellation.Data;
using Constellation.Data.Repositories;
using Constellation.Models.DTOs;
using Constellation.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Constellation.Tests.Data;

public class EventRepositoryTests
{
    private static (ConstellationDbContext context, EventRepository repo) CreateRepo()
    {
        var options = new DbContextOptionsBuilder<ConstellationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        var context = new ConstellationDbContext(options);
        var repo = new EventRepository(context);
        return (context, repo);
    }

    [Fact]
    public async Task AddAsync_And_GetByIdAsync_RoundTrips()
    {
        var (context, repo) = CreateRepo();
        using var _ = context;

        var ev = new Event
        {
            Title = "Test Event",
            Source = "TestSource",
            Url = "https://example.com/test"
        };

        var added = await repo.AddAsync(ev);
        Assert.True(added.Id > 0);

        var retrieved = await repo.GetByIdAsync(added.Id);
        Assert.NotNull(retrieved);
        Assert.Equal("Test Event", retrieved.Title);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_ForNonExistingId()
    {
        var (context, repo) = CreateRepo();
        using var _ = context;

        var result = await repo.GetByIdAsync(999);
        Assert.Null(result);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsPaged_FirstPage()
    {
        var (context, repo) = CreateRepo();
        using var _ = context;

        for (int i = 0; i < 25; i++)
        {
            context.Events.Add(new Event
            {
                Title = $"Event {i}",
                Source = "Test",
                StartDate = DateTime.UtcNow.AddDays(i)
            });
        }
        await context.SaveChangesAsync();

        var result = await repo.GetAllAsync(page: 1, pageSize: 10);
        Assert.Equal(10, result.Items.Count);
        Assert.Equal(25, result.TotalCount);
        Assert.Equal(1, result.Page);
        Assert.Equal(10, result.PageSize);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsPaged_LastPage()
    {
        var (context, repo) = CreateRepo();
        using var _ = context;

        for (int i = 0; i < 25; i++)
        {
            context.Events.Add(new Event
            {
                Title = $"Event {i}",
                Source = "Test",
                StartDate = DateTime.UtcNow.AddDays(i)
            });
        }
        await context.SaveChangesAsync();

        var result = await repo.GetAllAsync(page: 3, pageSize: 10);
        Assert.Equal(5, result.Items.Count);
        Assert.Equal(25, result.TotalCount);
    }

    [Fact]
    public async Task SearchAsync_FiltersByKeyword()
    {
        var (context, repo) = CreateRepo();
        using var _ = context;

        context.Events.AddRange(
            new Event { Title = "BEYA Conference", Description = "Annual awards", Source = "S1" },
            new Event { Title = "Space Meetup", Description = "Networking event", Source = "S2" },
            new Event { Title = "NSBE Panel", Description = "Discussion about BEYA", Source = "S3" }
        );
        await context.SaveChangesAsync();

        var request = new EventSearchRequest { Keyword = "BEYA", Page = 1, PageSize = 20 };
        var result = await repo.SearchAsync(request);

        Assert.Equal(2, result.TotalCount);
    }

    [Fact]
    public async Task SearchAsync_FiltersBySource()
    {
        var (context, repo) = CreateRepo();
        using var _ = context;

        context.Events.AddRange(
            new Event { Title = "E1", Source = "Eventbrite" },
            new Event { Title = "E2", Source = "Meetup" },
            new Event { Title = "E3", Source = "Eventbrite" }
        );
        await context.SaveChangesAsync();

        var request = new EventSearchRequest { Source = "Eventbrite", Page = 1, PageSize = 20 };
        var result = await repo.SearchAsync(request);

        Assert.Equal(2, result.TotalCount);
        Assert.All(result.Items, e => Assert.Equal("Eventbrite", e.Source));
    }

    [Fact]
    public async Task ExistsByUrlAsync_ReturnsTrue_WhenUrlExists()
    {
        var (context, repo) = CreateRepo();
        using var _ = context;

        context.Events.Add(new Event { Title = "E1", Source = "S1", Url = "https://example.com/exists" });
        await context.SaveChangesAsync();

        Assert.True(await repo.ExistsByUrlAsync("https://example.com/exists"));
    }

    [Fact]
    public async Task ExistsByUrlAsync_ReturnsFalse_WhenUrlDoesNotExist()
    {
        var (context, repo) = CreateRepo();
        using var _ = context;

        Assert.False(await repo.ExistsByUrlAsync("https://example.com/nope"));
    }

    [Fact]
    public async Task ExistsByTitleAndDateAsync_ReturnsTrue_WhenMatch()
    {
        var (context, repo) = CreateRepo();
        using var _ = context;

        var date = new DateTime(2026, 3, 15);
        context.Events.Add(new Event { Title = "Unique Event", Source = "S1", StartDate = date });
        await context.SaveChangesAsync();

        Assert.True(await repo.ExistsByTitleAndDateAsync("Unique Event", date));
    }

    [Fact]
    public async Task ExistsByTitleAndDateAsync_ReturnsFalse_WhenNoMatch()
    {
        var (context, repo) = CreateRepo();
        using var _ = context;

        Assert.False(await repo.ExistsByTitleAndDateAsync("No Event", null));
    }

    [Fact]
    public async Task GetSourceSummariesAsync_ReturnsGroupedCounts()
    {
        var (context, repo) = CreateRepo();
        using var _ = context;

        context.Events.AddRange(
            new Event { Title = "E1", Source = "Eventbrite" },
            new Event { Title = "E2", Source = "Eventbrite" },
            new Event { Title = "E3", Source = "Meetup" },
            new Event { Title = "E4", Source = "Eventbrite" },
            new Event { Title = "E5", Source = "WebSearch" }
        );
        await context.SaveChangesAsync();

        var summaries = await repo.GetSourceSummariesAsync();

        Assert.Equal(3, summaries.Count);
        Assert.Contains(summaries, s => s.Source == "Eventbrite" && s.Count == 3);
        Assert.Contains(summaries, s => s.Source == "Meetup" && s.Count == 1);
        Assert.Contains(summaries, s => s.Source == "WebSearch" && s.Count == 1);

        // Should be ordered by count descending
        Assert.Equal("Eventbrite", summaries[0].Source);
    }
}
