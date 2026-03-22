using Constellation.Data;
using Constellation.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Constellation.Tests.Data;

public class DbContextTests
{
    private static ConstellationDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<ConstellationDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new ConstellationDbContext(options);
    }

    [Fact]
    public void DbContext_CanBeInstantiated()
    {
        using var context = CreateContext();
        Assert.NotNull(context);
    }

    [Fact]
    public void DbContext_HasEventsDbSet()
    {
        using var context = CreateContext();
        Assert.NotNull(context.Events);
    }

    [Fact]
    public async Task Events_CanAddAndRetrieve()
    {
        using var context = CreateContext();

        var ev = new Event
        {
            Title = "Test Event",
            Description = "Test Description",
            Url = "https://example.com/test",
            Location = "Test Location",
            Source = "TestSource",
            Tags = "test,unit",
            RelevanceScore = 0.8,
            StartDate = DateTime.UtcNow,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.Events.Add(ev);
        await context.SaveChangesAsync();

        var retrieved = await context.Events.FirstOrDefaultAsync(e => e.Title == "Test Event");
        Assert.NotNull(retrieved);
        Assert.Equal("Test Event", retrieved.Title);
        Assert.Equal("TestSource", retrieved.Source);
    }

    [Fact]
    public async Task Events_CanAddMultipleAndCount()
    {
        using var context = CreateContext();

        context.Events.AddRange(
            new Event { Title = "Event 1", Source = "S1" },
            new Event { Title = "Event 2", Source = "S2" },
            new Event { Title = "Event 3", Source = "S1" }
        );
        await context.SaveChangesAsync();

        var count = await context.Events.CountAsync();
        Assert.Equal(3, count);
    }
}
