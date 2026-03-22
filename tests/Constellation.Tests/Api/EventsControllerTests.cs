using System.Net;
using System.Net.Http.Json;
using Constellation.Models.DTOs;
using Constellation.Tests.Helpers;

namespace Constellation.Tests.Api;

public class EventsControllerTests : IClassFixture<TestWebApplicationFactory>
{
    private readonly HttpClient _client;

    public EventsControllerTests(TestWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetEvents_Returns200_WithPagedResults()
    {
        var response = await _client.GetAsync("/api/events");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<PagedResult<EventDto>>();
        Assert.NotNull(result);
        Assert.Equal(3, result.TotalCount);
        Assert.Equal(3, result.Items.Count);
        Assert.Equal(1, result.Page);
    }

    [Fact]
    public async Task GetEvents_WithPaging_ReturnsCorrectPage()
    {
        var response = await _client.GetAsync("/api/events?page=1&pageSize=2");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<PagedResult<EventDto>>();
        Assert.NotNull(result);
        Assert.Equal(2, result.Items.Count);
        Assert.Equal(3, result.TotalCount);
    }

    [Fact]
    public async Task GetEventById_Returns200_ForExistingEvent()
    {
        var response = await _client.GetAsync("/api/events/1");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var dto = await response.Content.ReadFromJsonAsync<EventDto>();
        Assert.NotNull(dto);
        Assert.Equal(1, dto.Id);
        Assert.False(string.IsNullOrEmpty(dto.Title));
    }

    [Fact]
    public async Task GetEventById_Returns404_ForNonExistingEvent()
    {
        var response = await _client.GetAsync("/api/events/9999");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Search_Returns200_WithResults()
    {
        var response = await _client.GetAsync("/api/events/search?q=BEYA");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var results = await response.Content.ReadFromJsonAsync<List<EventDto>>();
        Assert.NotNull(results);
        Assert.True(results.Count >= 1);
    }

    [Fact]
    public async Task Search_ReturnsBadRequest_ForEmptyQuery()
    {
        var response = await _client.GetAsync("/api/events/search?q=");
        // Empty q is treated as missing required parameter by model binding
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
