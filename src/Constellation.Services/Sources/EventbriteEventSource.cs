using System.Net.Http.Json;
using System.Text.Json;
using Constellation.Models;
using Constellation.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Constellation.Services.Sources;

public class EventbriteEventSource : IEventSource
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;
    private readonly ILogger<EventbriteEventSource> _logger;

    private static readonly string[] SearchTerms =
    {
        "Black in aerospace",
        "BEYA STEM",
        "NSBE defense",
        "Black aerospace professionals"
    };

    public string SourceName => "Eventbrite";

    public EventbriteEventSource(
        IHttpClientFactory httpClientFactory,
        IConfiguration configuration,
        ILogger<EventbriteEventSource> logger)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<IEnumerable<DiscoveredEvent>> DiscoverEventsAsync(CancellationToken cancellationToken = default)
    {
        var apiKey = _configuration["EventSources:Eventbrite:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
        {
            _logger.LogWarning("Eventbrite API key is not configured. Skipping source.");
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
                var encodedTerm = Uri.EscapeDataString(term);
                var url = $"https://www.eventbriteapi.com/v3/events/search/?q={encodedTerm}&expand=venue";

                var response = await client.GetAsync(url, cancellationToken);
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning("Eventbrite search for '{Term}' returned {StatusCode}.", term, response.StatusCode);
                    continue;
                }

                var json = await response.Content.ReadFromJsonAsync<JsonElement>(cancellationToken: cancellationToken);

                if (json.TryGetProperty("events", out var events))
                {
                    foreach (var ev in events.EnumerateArray())
                    {
                        var discovered = MapToDiscoveredEvent(ev, term);
                        if (discovered is not null)
                        {
                            results.Add(discovered);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error discovering events from Eventbrite for term '{Term}'.", term);
            }
        }

        _logger.LogInformation("Eventbrite discovered {Count} events.", results.Count);
        return results;
    }

    private DiscoveredEvent? MapToDiscoveredEvent(JsonElement ev, string searchTerm)
    {
        try
        {
            var title = ev.TryGetProperty("name", out var name) && name.TryGetProperty("text", out var nameText)
                ? nameText.GetString() ?? string.Empty
                : string.Empty;

            var description = ev.TryGetProperty("description", out var desc) && desc.TryGetProperty("text", out var descText)
                ? descText.GetString() ?? string.Empty
                : string.Empty;

            var url = ev.TryGetProperty("url", out var urlProp)
                ? urlProp.GetString() ?? string.Empty
                : string.Empty;

            var location = string.Empty;
            if (ev.TryGetProperty("venue", out var venue) && venue.ValueKind != JsonValueKind.Null)
            {
                if (venue.TryGetProperty("address", out var address) && address.TryGetProperty("localized_address_display", out var addr))
                {
                    location = addr.GetString() ?? string.Empty;
                }
            }

            DateTime? startDate = null;
            if (ev.TryGetProperty("start", out var start) && start.TryGetProperty("utc", out var startUtc))
            {
                if (DateTime.TryParse(startUtc.GetString(), out var parsed))
                    startDate = parsed;
            }

            DateTime? endDate = null;
            if (ev.TryGetProperty("end", out var end) && end.TryGetProperty("utc", out var endUtc))
            {
                if (DateTime.TryParse(endUtc.GetString(), out var parsed))
                    endDate = parsed;
            }

            return new DiscoveredEvent
            {
                Title = title,
                Description = description.Length > 2000 ? description[..2000] : description,
                Url = url,
                Location = location,
                StartDate = startDate,
                EndDate = endDate,
                Source = SourceName,
                Tags = new List<string> { searchTerm },
                RelevanceScore = 0.7
            };
        }
        catch (Exception)
        {
            return null;
        }
    }
}
