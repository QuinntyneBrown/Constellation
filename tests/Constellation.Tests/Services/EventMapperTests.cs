using Constellation.Models;
using Constellation.Models.Entities;
using Constellation.Services.Mapping;

namespace Constellation.Tests.Services;

public class EventMapperTests
{
    [Fact]
    public void ToEntity_MapsAllProperties()
    {
        var discovered = new DiscoveredEvent
        {
            Title = "Test Event",
            Description = "A great event",
            Url = "https://example.com/event",
            Location = "New York, NY",
            StartDate = new DateTime(2026, 5, 1),
            EndDate = new DateTime(2026, 5, 2),
            Source = "Eventbrite",
            Tags = new List<string> { "STEM", "aerospace" },
            RelevanceScore = 0.85
        };

        var entity = EventMapper.ToEntity(discovered);

        Assert.Equal("Test Event", entity.Title);
        Assert.Equal("A great event", entity.Description);
        Assert.Equal("https://example.com/event", entity.Url);
        Assert.Equal("New York, NY", entity.Location);
        Assert.Equal(new DateTime(2026, 5, 1), entity.StartDate);
        Assert.Equal(new DateTime(2026, 5, 2), entity.EndDate);
        Assert.Equal("Eventbrite", entity.Source);
        Assert.Equal(0.85, entity.RelevanceScore);
    }

    [Fact]
    public void ToEntity_JoinsTagsWithComma()
    {
        var discovered = new DiscoveredEvent
        {
            Tags = new List<string> { "BEYA", "NSBE", "defense" }
        };

        var entity = EventMapper.ToEntity(discovered);

        Assert.Equal("BEYA,NSBE,defense", entity.Tags);
    }

    [Fact]
    public void ToEntity_EmptyTags_ProducesEmptyString()
    {
        var discovered = new DiscoveredEvent
        {
            Tags = new List<string>()
        };

        var entity = EventMapper.ToEntity(discovered);

        Assert.Equal(string.Empty, entity.Tags);
    }

    [Fact]
    public void ToEntity_SingleTag_NoComma()
    {
        var discovered = new DiscoveredEvent
        {
            Tags = new List<string> { "solo" }
        };

        var entity = EventMapper.ToEntity(discovered);

        Assert.Equal("solo", entity.Tags);
    }

    [Fact]
    public void ToEntity_SetsCreatedAtAndUpdatedAt()
    {
        var before = DateTime.UtcNow;

        var discovered = new DiscoveredEvent { Title = "Test" };
        var entity = EventMapper.ToEntity(discovered);

        var after = DateTime.UtcNow;

        Assert.InRange(entity.CreatedAt, before, after);
        Assert.InRange(entity.UpdatedAt, before, after);
    }

    [Fact]
    public void ToEntity_IdIsZero_BeforePersistence()
    {
        var discovered = new DiscoveredEvent { Title = "Test" };
        var entity = EventMapper.ToEntity(discovered);

        Assert.Equal(0, entity.Id);
    }
}
