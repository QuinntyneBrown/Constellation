using System.Net;
using System.Text.Json;
using Constellation.Tests.Helpers;

namespace Constellation.Tests.Api;

public class HealthControllerTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public HealthControllerTests(TestWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetHealth_Returns200()
    {
        var response = await _client.GetAsync("/health");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetHealth_ReturnsStatusAndTimestamp()
    {
        var response = await _client.GetAsync("/health");
        var content = await response.Content.ReadAsStringAsync();

        var json = JsonDocument.Parse(content).RootElement;
        Assert.True(json.TryGetProperty("status", out var status));
        Assert.Equal("Healthy", status.GetString());

        Assert.True(json.TryGetProperty("timestamp", out _));
    }
}
