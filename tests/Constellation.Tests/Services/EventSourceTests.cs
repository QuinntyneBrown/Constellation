using Constellation.Services.Interfaces;
using Constellation.Services.Sources;

namespace Constellation.Tests.Services;

public class EventSourceTests
{
    [Fact]
    public void EventbriteEventSource_ImplementsIEventSource()
    {
        Assert.True(typeof(IEventSource).IsAssignableFrom(typeof(EventbriteEventSource)));
    }

    [Fact]
    public void MeetupEventSource_ImplementsIEventSource()
    {
        Assert.True(typeof(IEventSource).IsAssignableFrom(typeof(MeetupEventSource)));
    }

    [Fact]
    public void WebSearchEventSource_ImplementsIEventSource()
    {
        Assert.True(typeof(IEventSource).IsAssignableFrom(typeof(WebSearchEventSource)));
    }

    [Fact]
    public void IEventSource_HasSourceNameProperty()
    {
        var prop = typeof(IEventSource).GetProperty("SourceName");
        Assert.NotNull(prop);
        Assert.Equal(typeof(string), prop.PropertyType);
    }

    [Fact]
    public void IEventSource_HasDiscoverEventsAsyncMethod()
    {
        var method = typeof(IEventSource).GetMethod("DiscoverEventsAsync");
        Assert.NotNull(method);
    }
}
