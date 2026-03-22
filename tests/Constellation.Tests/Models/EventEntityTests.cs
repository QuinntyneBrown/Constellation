using System.Reflection;
using Constellation.Models.Entities;

namespace Constellation.Tests.Models;

public class EventEntityTests
{
    [Theory]
    [InlineData("Id", typeof(int))]
    [InlineData("Title", typeof(string))]
    [InlineData("Description", typeof(string))]
    [InlineData("Url", typeof(string))]
    [InlineData("Location", typeof(string))]
    [InlineData("StartDate", typeof(DateTime?))]
    [InlineData("EndDate", typeof(DateTime?))]
    [InlineData("Source", typeof(string))]
    [InlineData("Tags", typeof(string))]
    [InlineData("RelevanceScore", typeof(double))]
    [InlineData("CreatedAt", typeof(DateTime))]
    [InlineData("UpdatedAt", typeof(DateTime))]
    public void Event_HasExpectedProperty(string propertyName, Type expectedType)
    {
        var property = typeof(Event).GetProperty(propertyName, BindingFlags.Public | BindingFlags.Instance);
        Assert.NotNull(property);
        Assert.Equal(expectedType, property.PropertyType);
    }

    [Fact]
    public void Event_AllPropertiesAreReadWrite()
    {
        var properties = typeof(Event).GetProperties(BindingFlags.Public | BindingFlags.Instance);
        foreach (var prop in properties)
        {
            Assert.True(prop.CanRead, $"{prop.Name} should be readable");
            Assert.True(prop.CanWrite, $"{prop.Name} should be writable");
        }
    }

    [Fact]
    public void Event_HasExactly12Properties()
    {
        var properties = typeof(Event).GetProperties(BindingFlags.Public | BindingFlags.Instance);
        Assert.Equal(12, properties.Length);
    }

    [Fact]
    public void Event_DefaultValues_AreCorrect()
    {
        var ev = new Event();
        Assert.Equal(string.Empty, ev.Title);
        Assert.Equal(string.Empty, ev.Description);
        Assert.Equal(string.Empty, ev.Url);
        Assert.Equal(string.Empty, ev.Location);
        Assert.Equal(string.Empty, ev.Source);
        Assert.Equal(string.Empty, ev.Tags);
        Assert.Null(ev.StartDate);
        Assert.Null(ev.EndDate);
        Assert.Equal(0, ev.Id);
        Assert.Equal(0.0, ev.RelevanceScore);
    }
}
