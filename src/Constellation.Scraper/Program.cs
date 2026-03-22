using System.Text.RegularExpressions;
using Constellation.Data;
using Constellation.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Playwright;

// -- Configuration -----------------------------------------------------------
var dbPath = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "Constellation.Api", "constellation.db"));
if (!File.Exists(dbPath))
{
    // Also try the working directory
    var altPath = Path.Combine(Directory.GetCurrentDirectory(), "constellation.db");
    if (File.Exists(altPath))
        dbPath = altPath;
    else
    {
        // Create in the Api project directory
        var apiDir = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "Constellation.Api"));
        if (Directory.Exists(apiDir))
            dbPath = Path.Combine(apiDir, "constellation.db");
    }
}

Console.WriteLine($"======================================================");
Console.WriteLine($"  Constellation Playwright Scraper                    ");
Console.WriteLine($"======================================================");
Console.WriteLine($"  Database: {dbPath}");
Console.WriteLine();

// -- Database Setup ----------------------------------------------------------
var optionsBuilder = new DbContextOptionsBuilder<ConstellationDbContext>();
optionsBuilder.UseSqlite($"Data Source={dbPath}");
using var db = new ConstellationDbContext(optionsBuilder.Options);
await db.Database.EnsureCreatedAsync();

// -- Playwright Setup --------------------------------------------------------
Console.WriteLine("Launching browser...");
using var playwright = await Playwright.CreateAsync();
await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
{
    Headless = true
});

var context = await browser.NewContextAsync(new BrowserNewContextOptions
{
    UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
});

var allEvents = new List<Event>();

// -- Eventbrite Scraper ------------------------------------------------------
await ScrapeEventbrite(context, allEvents);

// -- Meetup Scraper ----------------------------------------------------------
await ScrapeMeetup(context, allEvents);

// -- Google Search Scraper ---------------------------------------------------
await ScrapeGoogle(context, allEvents);

// -- Deduplication & Seeding -------------------------------------------------
Console.WriteLine();
Console.WriteLine($"Total events scraped: {allEvents.Count}");

int inserted = 0;
int skipped = 0;

foreach (var ev in allEvents)
{
    bool exists = false;

    if (!string.IsNullOrWhiteSpace(ev.Url))
        exists = await db.Events.AnyAsync(e => e.Url == ev.Url);

    if (!exists && !string.IsNullOrWhiteSpace(ev.Title))
        exists = await db.Events.AnyAsync(e => e.Title == ev.Title && e.StartDate == ev.StartDate);

    if (exists)
    {
        skipped++;
        continue;
    }

    db.Events.Add(ev);
    inserted++;
}

if (inserted > 0)
    await db.SaveChangesAsync();

Console.WriteLine($"  New events inserted: {inserted}");
Console.WriteLine($"  Duplicates skipped:  {skipped}");
Console.WriteLine();
Console.WriteLine("Done!");

return 0;

// ============================================================================
// Scraper Implementations
// ============================================================================

async Task ScrapeEventbrite(IBrowserContext ctx, List<Event> events)
{
    Console.WriteLine("-- Eventbrite -------------------------------------------------");

    var searches = new[]
    {
        ("dotnet meetup", "Mississauga"),
        ("angular meetup", "Mississauga"),
        ("playwright testing", "Mississauga"),
        ("software developer meetup", "Toronto"),
        ("dotnet conference", "online"),
        ("angular conference", "online"),
        ("playwright testing event", "online"),
    };

    foreach (var (query, location) in searches)
    {
        try
        {
            var page = await ctx.NewPageAsync();
            var isOnline = location.Equals("online", StringComparison.OrdinalIgnoreCase);

            // Eventbrite search URL format
            var searchUrl = isOnline
                ? $"https://www.eventbrite.com/d/online/{Uri.EscapeDataString(query)}/"
                : $"https://www.eventbrite.com/d/canada--{Uri.EscapeDataString(location)}/{Uri.EscapeDataString(query)}/";

            Console.Write($"  Searching: {query} ({location})... ");

            await page.GotoAsync(searchUrl, new PageGotoOptions { Timeout = 30000 });
            await page.WaitForTimeoutAsync(2000); // Let page render

            // Try multiple selectors for event cards
            var eventCards = await page.QuerySelectorAllAsync("[data-testid='event-card'], .search-event-card-wrapper, .eds-event-card-content, a[data-event-id]");

            // Fallback: look for any links that look like event URLs
            if (eventCards.Count == 0)
            {
                eventCards = await page.QuerySelectorAllAsync("a[href*='/e/']");
            }

            int count = 0;
            var seen = new HashSet<string>();

            foreach (var card in eventCards.Take(10))
            {
                try
                {
                    var title = await card.GetAttributeAsync("aria-label")
                        ?? await card.InnerTextAsync();
                    title = title?.Split('\n').FirstOrDefault()?.Trim() ?? "";

                    if (string.IsNullOrWhiteSpace(title) || title.Length < 5) continue;

                    var href = await card.GetAttributeAsync("href") ?? "";
                    if (string.IsNullOrEmpty(href))
                    {
                        var link = await card.QuerySelectorAsync("a[href*='/e/']");
                        if (link != null)
                            href = await link.GetAttributeAsync("href") ?? "";
                    }
                    if (href.StartsWith("/")) href = "https://www.eventbrite.com" + href;
                    if (string.IsNullOrEmpty(href) || !href.Contains("eventbrite")) continue;

                    // Strip query params for dedup
                    var cleanUrl = href.Split('?')[0];
                    if (!seen.Add(cleanUrl)) continue;

                    // Try to extract date text
                    var dateText = "";
                    var dateEl = await card.QuerySelectorAsync("p[class*='date'], [data-testid='event-card-date'], time, .eds-text-bs--fixed");
                    if (dateEl != null)
                        dateText = (await dateEl.InnerTextAsync()).Trim();

                    // Try to extract location text
                    var locationText = isOnline ? "Online" : location;
                    var locEl = await card.QuerySelectorAsync("p[class*='location'], [data-testid='event-card-location']");
                    if (locEl != null)
                    {
                        var lt = (await locEl.InnerTextAsync()).Trim();
                        if (!string.IsNullOrEmpty(lt)) locationText = lt;
                    }

                    events.Add(new Event
                    {
                        Title = title.Length > 500 ? title[..500] : title,
                        Description = $"Found via Eventbrite search for '{query}'. {dateText}".Trim(),
                        Url = cleanUrl.Length > 2000 ? cleanUrl[..2000] : cleanUrl,
                        Location = locationText,
                        StartDate = TryParseDate(dateText),
                        Source = "Eventbrite-Scraper",
                        Tags = BuildTags(query),
                        RelevanceScore = 0.7,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });
                    count++;
                }
                catch { /* skip individual card errors */ }
            }

            Console.WriteLine($"{count} events");
            await page.CloseAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"  Warning: Error searching '{query}' on Eventbrite: {ex.Message}");
        }
    }
}

async Task ScrapeMeetup(IBrowserContext ctx, List<Event> events)
{
    Console.WriteLine("-- Meetup -----------------------------------------------------");

    var searches = new[]
    {
        ("dotnet", "Mississauga, ON"),
        ("angular", "Mississauga, ON"),
        ("playwright", "Mississauga, ON"),
        ("software-testing", "Toronto, ON"),
        ("dotnet", "online"),
        ("angular", "online"),
        ("playwright", "online"),
    };

    foreach (var (query, location) in searches)
    {
        try
        {
            var page = await ctx.NewPageAsync();
            var isOnline = location.Equals("online", StringComparison.OrdinalIgnoreCase);

            // Meetup find URL
            var searchUrl = isOnline
                ? $"https://www.meetup.com/find/?keywords={Uri.EscapeDataString(query)}&eventType=online"
                : $"https://www.meetup.com/find/?keywords={Uri.EscapeDataString(query)}&location={Uri.EscapeDataString(location)}&source=EVENTS";

            Console.Write($"  Searching: {query} ({location})... ");

            await page.GotoAsync(searchUrl, new PageGotoOptions { Timeout = 30000 });
            await page.WaitForTimeoutAsync(2000);

            // Meetup event cards
            var eventCards = await page.QuerySelectorAllAsync("[data-testid='categoryResults-eventCard'], .searchResult, a[href*='/events/'], [id*='event-card']");

            // Broader fallback
            if (eventCards.Count == 0)
            {
                eventCards = await page.QuerySelectorAllAsync("a[href*='meetup.com'][href*='/events/']");
            }

            int count = 0;
            var seen = new HashSet<string>();

            foreach (var card in eventCards.Take(10))
            {
                try
                {
                    var title = "";
                    var titleEl = await card.QuerySelectorAsync("h2, h3, [data-testid='event-card-title']");
                    if (titleEl != null)
                        title = (await titleEl.InnerTextAsync()).Trim();

                    if (string.IsNullOrWhiteSpace(title))
                        title = (await card.InnerTextAsync()).Split('\n').FirstOrDefault()?.Trim() ?? "";

                    if (string.IsNullOrWhiteSpace(title) || title.Length < 5) continue;

                    var href = await card.GetAttributeAsync("href") ?? "";
                    if (string.IsNullOrEmpty(href))
                    {
                        var link = await card.QuerySelectorAsync("a[href*='/events/']");
                        if (link != null)
                            href = await link.GetAttributeAsync("href") ?? "";
                    }
                    if (href.StartsWith("/")) href = "https://www.meetup.com" + href;
                    if (string.IsNullOrEmpty(href) || !href.Contains("meetup.com")) continue;

                    var cleanUrl = href.Split('?')[0];
                    if (!seen.Add(cleanUrl)) continue;

                    var dateText = "";
                    var dateEl = await card.QuerySelectorAsync("time, [datetime], span[class*='date']");
                    if (dateEl != null)
                        dateText = (await dateEl.GetAttributeAsync("datetime")) ?? (await dateEl.InnerTextAsync()).Trim();

                    var locationText = isOnline ? "Online" : location;
                    var locEl = await card.QuerySelectorAsync("p[class*='location'], span[class*='location']");
                    if (locEl != null)
                    {
                        var lt = (await locEl.InnerTextAsync()).Trim();
                        if (!string.IsNullOrEmpty(lt)) locationText = lt;
                    }

                    events.Add(new Event
                    {
                        Title = title.Length > 500 ? title[..500] : title,
                        Description = $"Found via Meetup search for '{query}'.",
                        Url = cleanUrl.Length > 2000 ? cleanUrl[..2000] : cleanUrl,
                        Location = locationText,
                        StartDate = TryParseDate(dateText),
                        Source = "Meetup-Scraper",
                        Tags = BuildTags(query),
                        RelevanceScore = 0.6,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });
                    count++;
                }
                catch { /* skip individual card errors */ }
            }

            Console.WriteLine($"{count} events");
            await page.CloseAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"  Warning: Error searching '{query}' on Meetup: {ex.Message}");
        }
    }
}

async Task ScrapeGoogle(IBrowserContext ctx, List<Event> events)
{
    Console.WriteLine("-- Google Search -----------------------------------------------");

    var searches = new[]
    {
        ".NET conference Toronto 2026",
        "Angular meetup Mississauga 2026",
        "Playwright testing event Toronto",
        ".NET developer meetup Ontario",
        "Angular conference online 2026",
        "Playwright testing conference online",
        "dotnet developer event Canada 2026",
    };

    foreach (var query in searches)
    {
        try
        {
            var page = await ctx.NewPageAsync();

            Console.Write($"  Searching: {query}... ");

            await page.GotoAsync($"https://www.google.com/search?q={Uri.EscapeDataString(query)}", new PageGotoOptions { Timeout = 30000 });
            await page.WaitForTimeoutAsync(1500);

            // Handle consent dialog if present
            var consentBtn = await page.QuerySelectorAsync("button[id='L2AGLb'], form[action*='consent'] button");
            if (consentBtn != null)
            {
                await consentBtn.ClickAsync();
                await page.WaitForTimeoutAsync(1000);
            }

            // Google search result entries
            var results = await page.QuerySelectorAllAsync("#search .g, div[data-sokoban-container], div.MjjYud");

            int count = 0;
            var seen = new HashSet<string>();

            foreach (var result in results.Take(8))
            {
                try
                {
                    var linkEl = await result.QuerySelectorAsync("a[href^='http']");
                    if (linkEl == null) continue;

                    var href = await linkEl.GetAttributeAsync("href") ?? "";
                    if (string.IsNullOrEmpty(href) || href.Contains("google.com") || href.Contains("youtube.com")) continue;

                    var cleanUrl = href.Split('?')[0];
                    if (!seen.Add(cleanUrl)) continue;

                    var titleEl = await result.QuerySelectorAsync("h3");
                    var title = titleEl != null ? (await titleEl.InnerTextAsync()).Trim() : "";
                    if (string.IsNullOrWhiteSpace(title) || title.Length < 5) continue;

                    // Skip non-event results
                    var titleLower = title.ToLowerInvariant();
                    if (!titleLower.Contains("event") && !titleLower.Contains("meetup") && !titleLower.Contains("conference") && !titleLower.Contains("workshop") && !titleLower.Contains("summit") && !titleLower.Contains("webinar"))
                        continue;

                    var snippet = "";
                    var snippetEl = await result.QuerySelectorAsync(".VwiC3b, .IsZvec, span[class*='st']");
                    if (snippetEl != null)
                        snippet = (await snippetEl.InnerTextAsync()).Trim();

                    var isOnline = query.Contains("online") || titleLower.Contains("online") || titleLower.Contains("virtual");

                    events.Add(new Event
                    {
                        Title = title.Length > 500 ? title[..500] : title,
                        Description = snippet.Length > 0 ? snippet : $"Found via Google search for '{query}'.",
                        Url = cleanUrl.Length > 2000 ? cleanUrl[..2000] : cleanUrl,
                        Location = isOnline ? "Online" : "Toronto / Mississauga area",
                        StartDate = null, // Google snippets don't reliably give dates
                        Source = "WebSearch-Scraper",
                        Tags = BuildTags(query),
                        RelevanceScore = 0.5,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    });
                    count++;
                }
                catch { /* skip */ }
            }

            Console.WriteLine($"{count} events");
            await page.CloseAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"  Warning: Error: {ex.Message}");
        }
    }
}

DateTime? TryParseDate(string? text)
{
    if (string.IsNullOrWhiteSpace(text)) return null;
    if (DateTime.TryParse(text, out var dt)) return dt;

    // Try to extract a date pattern from longer text
    var match = Regex.Match(text, @"(\w+ \d{1,2},? \d{4})|(\d{4}-\d{2}-\d{2})");
    if (match.Success && DateTime.TryParse(match.Value, out var dt2)) return dt2;

    return null;
}

string BuildTags(string query)
{
    var tags = new List<string>();
    var q = query.ToLowerInvariant();

    if (q.Contains("dotnet") || q.Contains(".net")) tags.Add(".NET");
    if (q.Contains("angular")) tags.Add("Angular");
    if (q.Contains("playwright")) tags.Add("Playwright");
    if (q.Contains("testing") || q.Contains("test")) tags.Add("Testing");
    if (q.Contains("conference")) tags.Add("Conference");
    if (q.Contains("meetup")) tags.Add("Meetup");
    if (q.Contains("developer") || q.Contains("software")) tags.Add("Developer");

    if (tags.Count == 0) tags.Add("Tech");

    return string.Join(",", tags);
}
