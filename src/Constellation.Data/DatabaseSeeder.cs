using Constellation.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Constellation.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(ConstellationDbContext db)
    {
        if (await db.Events.AnyAsync())
            return; // Already seeded

        var now = DateTime.UtcNow;
        var events = new List<Event>
        {
            // ── Eventbrite-sourced events ────────────────────────────────

            new()
            {
                Title = "OBAP 50th Annual Conference",
                Description = "Organization of Black Aerospace Professionals celebrates its 50th anniversary at this landmark conference. Features documentary premiere, Hall of Fame induction, awards gala, youth programs, career workshops, and networking for pilots, engineers, and aerospace professionals. Title sponsor: American Airlines.",
                Url = "https://obap.org/annual-conference/",
                Location = "McCormick Place, 2301 S Martin Luther King Dr, Chicago, IL",
                StartDate = new DateTime(2026, 8, 12, 9, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2026, 8, 14, 17, 0, 0, DateTimeKind.Utc),
                Source = "Eventbrite",
                Tags = "OBAP,Aerospace,Aviation,Conference,50th Anniversary,Networking",
                RelevanceScore = 0.93,
                CreatedAt = now, UpdatedAt = now
            },
            new()
            {
                Title = "NSBE Professional Development Conference — PDC 2026",
                Description = "NSBE PDC 2026 themed 'Legacy Horizon: From Heritage to Horizon'. Professional development, technical sessions, and networking for Black engineers and STEM professionals.",
                Url = "https://www.pdc-nsbe.org/",
                Location = "Sahara Hotel, Las Vegas, NV",
                StartDate = new DateTime(2026, 8, 19, 9, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2026, 8, 22, 17, 0, 0, DateTimeKind.Utc),
                Source = "Eventbrite",
                Tags = "NSBE,PDC,Engineering,Professional Development,STEM",
                RelevanceScore = 0.88,
                CreatedAt = now, UpdatedAt = now
            },
            new()
            {
                Title = "BEC Build & Bridge: Engineering Black Enterprise",
                Description = "Black Engineers of Canada inaugural National Conference. Pitch your business for up to $5,000 in non-dilutive funding, 10 exclusive startup booths to demo solutions to industry decision-makers, and connect with top-tier VCs, government ecosystem partners, and corporate executives.",
                Url = "https://www.blackengineers.ca/events",
                Location = "Arcadian Court, Toronto, ON",
                StartDate = new DateTime(2026, 8, 14, 9, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2026, 8, 14, 18, 0, 0, DateTimeKind.Utc),
                Source = "Eventbrite",
                Tags = "BEC,Engineering,Entrepreneurship,Toronto,Startups,Networking",
                RelevanceScore = 0.92,
                CreatedAt = now, UpdatedAt = now
            },
            new()
            {
                Title = "AfroTech Conference 2026 — A Decade of Innovation",
                Description = "The world's largest gathering of Black tech professionals featuring 40,000+ attendees, 300+ speakers, and 100+ vendors. Programming spans AI, cybersecurity, HealthTech, digital innovation, and startup showcases across five days.",
                Url = "https://afrotechconference.com/",
                Location = "Houston, TX",
                StartDate = new DateTime(2026, 11, 2, 9, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2026, 11, 6, 18, 0, 0, DateTimeKind.Utc),
                Source = "Eventbrite",
                Tags = "AfroTech,Technology,AI,Cybersecurity,Conference,Innovation",
                RelevanceScore = 0.85,
                CreatedAt = now, UpdatedAt = now
            },

            // ── WebSearch-sourced events ─────────────────────────────────

            new()
            {
                Title = "2026 BSO Symposium — Toronto",
                Description = "Black Screen Office Symposium at the Toronto Region Board of Trade. Brings together Black professionals across technology, media, and creative industries for networking and panel discussions.",
                Url = "https://www.eventbrite.com/d/canada--toronto/black-networking/",
                Location = "Toronto Region Board of Trade, Queens Quay East, Toronto, ON",
                StartDate = new DateTime(2026, 4, 7, 9, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2026, 4, 7, 17, 0, 0, DateTimeKind.Utc),
                Source = "WebSearch",
                Tags = "BSO,Symposium,Toronto,Technology,Media,Networking",
                RelevanceScore = 0.70,
                CreatedAt = now, UpdatedAt = now
            },
            new()
            {
                Title = "CANSEC 2026 — Canada's Defence & Security Trade Show",
                Description = "Canada's premier defence and security trade show hosted by CADSI. Features 300+ exhibitors showcasing advanced technologies across land, sea, air, and joint-force domains. Includes keynote speeches, CANSEC Connect B2B/B2G meeting program, networking receptions, and international delegations.",
                Url = "https://www.defenceandsecurity.ca/CANSEC/",
                Location = "EY Centre, Ottawa, ON",
                StartDate = new DateTime(2026, 5, 27, 9, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2026, 5, 28, 17, 0, 0, DateTimeKind.Utc),
                Source = "WebSearch",
                Tags = "CANSEC,Defence,Security,Trade Show,Ottawa,CADSI",
                RelevanceScore = 0.84,
                CreatedAt = now, UpdatedAt = now
            },
            new()
            {
                Title = "SACNAS National Diversity in STEM Conference 2026",
                Description = "The nation's largest multidisciplinary and multicultural STEM diversity conference. Brings together scientists, researchers, and students from underrepresented communities for professional development, research presentations, and mentorship.",
                Url = "https://www.sacnas.org/conference",
                Location = "Long Beach Convention Center, Long Beach, CA",
                StartDate = new DateTime(2026, 10, 29, 9, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2026, 10, 31, 17, 0, 0, DateTimeKind.Utc),
                Source = "WebSearch",
                Tags = "SACNAS,STEM,Diversity,Conference,Research,Mentorship",
                RelevanceScore = 0.81,
                CreatedAt = now, UpdatedAt = now
            },
        };

        db.Events.AddRange(events);
        await db.SaveChangesAsync();
    }
}
