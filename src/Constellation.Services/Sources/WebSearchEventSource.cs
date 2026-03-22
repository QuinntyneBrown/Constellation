using System.Net.Http.Json;
using System.Text.Json;
using Constellation.Models;
using Constellation.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Constellation.Services.Sources;

public class WebSearchEventSource : IEventSource
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<WebSearchEventSource> _logger;
    private readonly MiningOptions _miningOptions;

    private static readonly string[] SearchTerms =
    {
        "Black professionals space industry meetup",
        "African American defense industry networking event",
        "BEYA conference",
        "Black engineer space defense event"
    };

    public string SourceName => "WebSearch";

    public WebSearchEventSource(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<WebSearchEventSource> logger,
        IOptions<MiningOptions> miningOptions)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
        _miningOptions = miningOptions.Value;
    }

    public async Task<IEnumerable<DiscoveredEvent>> DiscoverEventsAsync(CancellationToken cancellationToken = default)
    {
        var apiKey = _configuration["EventSources:BingSearch:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            _logger.LogWarning("Bing Search API key is not configured. Skipping source.");
            return Enumerable.Empty<DiscoveredEvent>();
        }

        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", apiKey);

        var results = new List<DiscoveredEvent>();

        foreach (var term in SearchTerms)
        {
            try
            {
                var geoQualifier = string.Join(" ", _miningOptions.Cities);
                var qualifiedTerm = $"{term} {geoQualifier}";
                var encodedTerm = Uri.EscapeDataString(qualifiedTerm);
                var url = $"https://api.bing.microsoft.com/v7.0/search?q={encodedTerm}&count=20&responseFilter=Webpages";

                var response = await client.GetAsync(url, cancellationToken);
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Bing search for '{Term}' returned {StatusCode}.", term, response.StatusCode);
                    continue;
                }

                var json = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: cancellationToken);
                var events = ParseSearchResults(json, term);
                results.AddRange(events);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error discovering events from Bing for term '{Term}'.", term);
            }
        }

        _logger.LogInformation("WebSearch discovered {Count} events.", results.Count);
        return results;
    }

    private List<DiscoveredEvent> ParseSearchResults(JsonElement json, string searchTerm)
    {
        var results = new List<DiscoveredEvent>();

        try
        {
            if (!json.TryGetProperty("webPages", out var webPages))
                return results;
            if (!webPages.TryGetProperty("value", out var values))
                return results;

            foreach (var item in values.EnumerateArray())
            {
                var title = item.TryGetProperty("name", out var nameProp)
                    ? nameProp.GetString() ?? string.Empty
                    : string.Empty;

                var description = item.TryGetProperty("snippet", out var snippetProp)
                    ? snippetProp.GetString() ?? string.Empty
                    : string.Empty;

                var url = item.TryGetProperty("url", out var urlProp)
                    ? urlProp.GetString() ?? string.Empty
                    : string.Empty;

                DateTime? datePublished = null;
                if (item.TryGetProperty("dateLastCrawled", out var dateProp) &&
                    DateTime.TryParse(dateProp.GetString(), out var parsed))
                {
                    datePublished = parsed;
                }

                results.Add(new DiscoveredEvent
                {
                    Title = title,
                    Description = description,
                    Url = url,
                    Location = string.Empty,
                    StartDate = datePublished,
                    EndDate = null,
                    Source = SourceName,
                    Tags = new List<string> { searchTerm },
                    RelevanceScore = 0.5
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
