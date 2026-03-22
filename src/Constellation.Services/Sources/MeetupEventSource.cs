using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Constellation.Models;
using Constellation.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Constellation.Services.Sources;

public class MeetupEventSource : IEventSource
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<MeetupEventSource> _logger;

    private static readonly string[] SearchTerms =
    {
        "Black space professionals",
        "defense industry diversity",
        "Black engineers aerospace"
    };

    public string SourceName => "Meetup";

    public MeetupEventSource(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<MeetupEventSource> logger)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<IEnumerable<DiscoveredEvent>> DiscoverEventsAsync(CancellationToken cancellationToken = default)
    {
        var apiKey = _configuration["EventSources:Meetup:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            _logger.LogWarning("Meetup API key is not configured. Skipping source.");
            return Enumerable.Empty<DiscoveredEvent>();
        }

        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", apiKey);

        var results = new List<DiscoveredEvent>();

        foreach (var term in SearchTerms)
        {
            try
            {
                var query = BuildGraphQLQuery(term);
                var content = new StringContent(
                    JsonSerializer.Serialize(new { query }),
                    Encoding.UTF8,
                    "application/json");

                var response = await client.PostAsync("https://api.meetup.com/gql", content, cancellationToken);
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Meetup GraphQL query for '{Term}' returned {StatusCode}.", term, response.StatusCode);
                    continue;
                }

                var json = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: cancellationToken);
                var events = ParseGraphQLResponse(json, term);
                results.AddRange(events);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error discovering events from Meetup for term '{Term}'.", term);
            }
        }

        _logger.LogInformation("Meetup discovered {Count} events.", results.Count);
        return results;
    }

    private static string BuildGraphQLQuery(string searchTerm)
    {
        var escapedTerm = searchTerm.Replace("\"", "\\\"");
        return $$"""
            {
              keywordSearch(filter: { query: "{{escapedTerm}}" }, input: { first: 20 }) {
                edges {
                  node {
                    id
                    result {
                      ... on Event {
                        title
                        description
                        eventUrl
                        dateTime
                        endTime
                        venue {
                          name
                          city
                          state
                        }
                      }
                    }
                  }
                }
              }
            }
            """;
    }

    private List<DiscoveredEvent> ParseGraphQLResponse(JsonElement json, string searchTerm)
    {
        var results = new List<DiscoveredEvent>();

        try
        {
            if (!json.TryGetProperty("data", out var data))
                return results;
            if (!data.TryGetProperty("keywordSearch", out var keywordSearch))
                return results;
            if (!keywordSearch.TryGetProperty("edges", out var edges))
                return results;

            foreach (var edge in edges.EnumerateArray())
            {
                if (!edge.TryGetProperty("node", out var node))
                    continue;
                if (!node.TryGetProperty("result", out var result))
                    continue;

                var title = result.TryGetProperty("title", out var titleProp)
                    ? titleProp.GetString() ?? string.Empty
                    : string.Empty;

                var description = result.TryGetProperty("description", out var descProp)
                    ? descProp.GetString() ?? string.Empty
                    : string.Empty;

                var url = result.TryGetProperty("eventUrl", out var urlProp)
                    ? urlProp.GetString() ?? string.Empty
                    : string.Empty;

                var location = string.Empty;
                if (result.TryGetProperty("venue", out var venue) && venue.ValueKind != JsonValueKind.Null)
                {
                    var city = venue.TryGetProperty("city", out var cityProp) ? cityProp.GetString() : null;
                    var state = venue.TryGetProperty("state", out var stateProp) ? stateProp.GetString() : null;
                    var venueName = venue.TryGetProperty("name", out var nameProp) ? nameProp.GetString() : null;
                    location = string.Join(", ", new[] { venueName, city, state }.Where(s => !string.IsNullOrEmpty(s)));
                }

                DateTime? startDate = null;
                if (result.TryGetProperty("dateTime", out var dtProp) && DateTime.TryParse(dtProp.GetString(), out var parsedStart))
                    startDate = parsedStart;

                DateTime? endDate = null;
                if (result.TryGetProperty("endTime", out var etProp) && DateTime.TryParse(etProp.GetString(), out var parsedEnd))
                    endDate = parsedEnd;

                results.Add(new DiscoveredEvent
                {
                    Title = title,
                    Description = description.Length > 2000 ? description[..2000] : description,
                    Url = url,
                    Location = location,
                    StartDate = startDate,
                    EndDate = endDate,
                    Source = SourceName,
                    Tags = new List<string> { searchTerm },
                    RelevanceScore = 0.6
                });
            }
        }
        catch (Exception)
        {
            // Gracefully handle unexpected JSON structures
        }

        return results;
    }
}
