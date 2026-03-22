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
                Title = "BEYA STEM DTX Conference 2026",
                Description = "The 40th annual BEYA STEM Digital Twin Experience conference, the largest gathering celebrating Black excellence in STEM. Features keynote presentations from leaders in aerospace and defence, career fair with 400+ exhibitors, HBCU Village, Hall of Fame, and networking for 14,000 attendees. Available in-person and online.",
                Url = "https://s4.goeshow.com/ccgroup/beyastem/2026/",
                Location = "Baltimore Convention Center, One West Pratt Street, Baltimore, MD",
                StartDate = new DateTime(2026, 2, 12, 9, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2026, 2, 14, 17, 0, 0, DateTimeKind.Utc),
                Source = "Eventbrite",
                Tags = "BEYA,STEM,Conference,Career Fair,Aerospace,Defence",
                RelevanceScore = 0.95,
                CreatedAt = now, UpdatedAt = now
            },
            new()
            {
                Title = "NSBE 52nd Annual Convention — TPC30",
                Description = "The National Society of Black Engineers 52nd Annual Convention and 30th Technical Professionals Conference in Baltimore. Theme: 'Advancing S.T.E.M. — Shaping the Future'. Four days of career development, technical workshops, and networking with 15,000+ attendees and 400+ exhibitors.",
                Url = "https://convention.nsbe.org/",
                Location = "Baltimore, Maryland",
                StartDate = new DateTime(2026, 3, 18, 9, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2026, 3, 22, 17, 0, 0, DateTimeKind.Utc),
                Source = "Eventbrite",
                Tags = "NSBE,STEM,Engineering,Convention,Career Fair,Networking",
                RelevanceScore = 0.94,
                CreatedAt = now, UpdatedAt = now
            },
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
            new()
            {
                Title = "Blacks in Government 46th National Training Institute",
                Description = "The 46th National Training Institute and 50th Anniversary celebration of Blacks in Government. Professional development, policy advocacy, and networking for Black government employees including defence and security sector professionals.",
                Url = "https://bignti.org/",
                Location = "United States (Location TBA)",
                StartDate = new DateTime(2026, 3, 1, 9, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2026, 3, 5, 17, 0, 0, DateTimeKind.Utc),
                Source = "Eventbrite",
                Tags = "BIG,Government,Defence,Training,50th Anniversary",
                RelevanceScore = 0.82,
                CreatedAt = now, UpdatedAt = now
            },

            // ── Meetup-sourced events ────────────────────────────────────

            new()
            {
                Title = "IGNITE Toronto 2026 — Building Black Futures",
                Description = "Black Talent Initiative's 3rd annual IGNITE Conference for Black History Month. Three days of entrepreneurship, corporate leadership, and changemaking. Day 1: Black Entrepreneurs Day with funding and mentorship. Keynotes, panels, workshops, and performances celebrating Black creativity and innovation.",
                Url = "https://www.blacktalentinitiative.network/ignite-toronto",
                Location = "North York Central Library, 5120 Yonge Street, Toronto, ON",
                StartDate = new DateTime(2026, 2, 25, 9, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2026, 2, 27, 18, 0, 0, DateTimeKind.Utc),
                Source = "Meetup",
                Tags = "BTI,IGNITE,Toronto,Entrepreneurship,Black History Month,Innovation",
                RelevanceScore = 0.90,
                CreatedAt = now, UpdatedAt = now
            },
            new()
            {
                Title = "BHME 2026 — 8th Annual National Celebration",
                Description = "Black Heritage Month Expo brings 30,000 visitors together with 23 speakers across 8 events. Includes Success Summit, Celebration Concert, Inventors Museum, job recruiter fair, NGO booths, and community showcases. A dynamic platform elevating Black voices and fostering economic empowerment.",
                Url = "https://bhmexpo.com/",
                Location = "Toronto, ON",
                StartDate = new DateTime(2026, 2, 26, 9, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2026, 2, 28, 22, 0, 0, DateTimeKind.Utc),
                Source = "Meetup",
                Tags = "BHME,Black Heritage Month,Toronto,Culture,Entrepreneurs,Community",
                RelevanceScore = 0.80,
                CreatedAt = now, UpdatedAt = now
            },
            new()
            {
                Title = "NSBE Zone Conference — Montréal",
                Description = "NSBE Spring Zone Conference in Montréal, Québec. Full-day conference for high school and university students featuring engineering competitions, career fair, and networking with Black STEM professionals.",
                Url = "https://nsbe.org/events/",
                Location = "Montréal, QC",
                StartDate = new DateTime(2026, 2, 21, 9, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2026, 2, 21, 18, 0, 0, DateTimeKind.Utc),
                Source = "Meetup",
                Tags = "NSBE,Zone Conference,Montréal,Students,Engineering,Career Fair",
                RelevanceScore = 0.86,
                CreatedAt = now, UpdatedAt = now
            },
            new()
            {
                Title = "BEC & EGBC Black History Month Virtual Event",
                Description = "Black Engineers of Canada and Engineers & Geoscientists BC collaborative virtual celebration featuring engineering professionals sharing their experiences and career journeys.",
                Url = "https://www.blackengineers.ca/events/join-us-for-bec-amp-egbcs-2026-black-history-month-virtual-event",
                Location = "Virtual (Online)",
                StartDate = new DateTime(2026, 2, 19, 18, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2026, 2, 19, 20, 0, 0, DateTimeKind.Utc),
                Source = "Meetup",
                Tags = "BEC,EGBC,Black History Month,Virtual,Engineering",
                RelevanceScore = 0.78,
                CreatedAt = now, UpdatedAt = now
            },
            new()
            {
                Title = "BEC: The Business Side of Engineering — Financial Literacy for Founders",
                Description = "Black Engineers of Canada workshop on financial literacy and cash flow management for engineering founders and entrepreneurs.",
                Url = "https://www.blackengineers.ca/events/the-business-side-of-engineering-financial-literacy-and-cash-flow-management-for-founders",
                Location = "Virtual (Online)",
                StartDate = new DateTime(2026, 3, 17, 18, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2026, 3, 17, 20, 0, 0, DateTimeKind.Utc),
                Source = "Meetup",
                Tags = "BEC,Engineering,Entrepreneurship,Financial Literacy,Workshop",
                RelevanceScore = 0.72,
                CreatedAt = now, UpdatedAt = now
            },
            new()
            {
                Title = "Next Generation of Black Professionals — Networking Workshop (TMU)",
                Description = "Toronto Metropolitan University workshop for Black-identified students and professionals to develop mindsets, tools, and community to thrive in professional settings.",
                Url = "https://www.torontomu.ca/wellbeing-central/2026/02/thenextgenerationofblackprofessionalsnetworkingworkshop/",
                Location = "Toronto Metropolitan University, Toronto, ON",
                StartDate = new DateTime(2026, 2, 5, 12, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2026, 2, 5, 15, 0, 0, DateTimeKind.Utc),
                Source = "Meetup",
                Tags = "TMU,Networking,Students,Toronto,Professional Development",
                RelevanceScore = 0.75,
                CreatedAt = now, UpdatedAt = now
            },

            // ── WebSearch-sourced events ─────────────────────────────────

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
                Title = "DEFY 2026 — Canada's Premier Supplier Inclusion Conference",
                Description = "Hosted by CAMSC, IWSCC, and CGLCC (SDAC) with WEConnect International. Brings together business owners, corporate innovators, and public-sector leaders advancing supplier inclusion. Keynote and breakout sessions on emerging opportunities for diverse suppliers in defence, tech, and government procurement.",
                Url = "https://camsc.ca/defy-conference-2026-why-attend/",
                Location = "Metro Toronto Convention Centre, Toronto, ON",
                StartDate = new DateTime(2026, 3, 11, 9, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2026, 3, 12, 17, 0, 0, DateTimeKind.Utc),
                Source = "WebSearch",
                Tags = "DEFY,CAMSC,Supplier Diversity,Toronto,Procurement,Inclusion",
                RelevanceScore = 0.83,
                CreatedAt = now, UpdatedAt = now
            },
            new()
            {
                Title = "CSA Equity, Diversity & Inclusion in the Space Sector — Funding Opportunity",
                Description = "Canadian Space Agency funding opportunity to increase equity, diversity, and inclusion in the Canadian space sector. Provides space-related training for underrepresented populations to make the Canadian space workforce more inclusive. Application deadline: February 6, 2026.",
                Url = "https://www.asc-csa.gc.ca/eng/funding-programs/funding-opportunities/ao/2024-increasing-equity-diversity-and-inclusion-in-the-canadian-space-sector.asp",
                Location = "Canadian Space Agency, Canada (National)",
                StartDate = new DateTime(2026, 2, 6, 0, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2026, 2, 6, 23, 59, 0, DateTimeKind.Utc),
                Source = "WebSearch",
                Tags = "CSA,Space,EDI,Funding,Canada,Training",
                RelevanceScore = 0.87,
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
                Title = "Black Legacy in STEM High School Conference — Ontario Tech",
                Description = "Ontario Tech University outreach conference for high school students exploring STEM pathways, with a focus on inspiring Black and underrepresented youth to pursue engineering and science careers.",
                Url = "https://engineering.ontariotechu.ca/outreach/high-school-programs/black-legacy-high-school-conference.php",
                Location = "Ontario Tech University, Oshawa, ON",
                StartDate = new DateTime(2026, 2, 1, 9, 0, 0, DateTimeKind.Utc),
                EndDate = new DateTime(2026, 2, 1, 16, 0, 0, DateTimeKind.Utc),
                Source = "WebSearch",
                Tags = "STEM,High School,Ontario Tech,Outreach,Youth,Engineering",
                RelevanceScore = 0.74,
                CreatedAt = now, UpdatedAt = now
            },
        };

        db.Events.AddRange(events);
        await db.SaveChangesAsync();
    }
}
