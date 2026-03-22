using System.Net;
using System.Net.Http.Json;
using Constellation.Models.DTOs;
using Constellation.Tests.Helpers;

namespace Constellation.Tests.Api;

public class SourcesControllerTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public SourcesControllerTests(TestWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetSources_Returns200()
    {
        var response = await _client.GetAsync("/api/sources");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var sources = await response.Content.ReadFromJsonAsync<List<SourceSummaryDto>>();
        Assert.NotNull(sources);
        Assert.True(sources.Count > 0);
    }

    [Fact]
    public async Task GetSources_ReturnsAllSeededSources()
    {
        var response = await _client.GetAsync("/api/sources");
        var sources = await response.Content.ReadFromJsonAsync<List<SourceSummaryDto>>();

        Assert.NotNull(sources);
        Assert.Contains(sources, s => s.Source == "Eventbrite");
        Assert.Contains(sources, s => s.Source == "Meetup");
        Assert.Contains(sources, s => s.Source == "WebSearch");
    }
}
