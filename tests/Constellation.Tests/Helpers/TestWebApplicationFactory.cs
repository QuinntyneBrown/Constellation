using Constellation.Data;
using Constellation.Models.Entities;
using Constellation.Services;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Constellation.Tests.Helpers;

public class TestWebApplicationFactory : WebApplicationFactory<Constellation.Api.Controllers.EventsController>
{
    private readonly string _dbName = Guid.NewGuid().ToString();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Remove the existing DbContext registration
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<ConstellationDbContext>));
            if (descriptor != null)
                services.Remove(descriptor);

            // Remove all DbContext-related registrations
            var dbContextDescriptors = services.Where(
                d => d.ServiceType.FullName?.Contains("ConstellationDbContext") == true
                     || d.ServiceType == typeof(ConstellationDbContext)).ToList();
            foreach (var d in dbContextDescriptors)
                services.Remove(d);

            // Remove the MiningBackgroundService
            var hostedServiceDescriptors = services.Where(
                d => d.ServiceType == typeof(IHostedService) &&
                     d.ImplementationType == typeof(MiningBackgroundService)).ToList();
            foreach (var d in hostedServiceDescriptors)
                services.Remove(d);

            // Add InMemory database
            services.AddDbContext<ConstellationDbContext>(options =>
                options.UseInMemoryDatabase(_dbName));

            // Seed test data
            var sp = services.BuildServiceProvider();
            using var scope = sp.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ConstellationDbContext>();
            db.Database.EnsureCreated();
            SeedTestData(db);
        });
    }

    private static void SeedTestData(ConstellationDbContext db)
    {
        db.Events.AddRange(
            new Event
            {
                Title = "BEYA STEM Conference",
                Description = "Annual Black Engineer of the Year Awards STEM Conference",
                Url = "https://example.com/beya-stem",
                Location = "Washington, DC",
                StartDate = new DateTime(2026, 2, 20),
                EndDate = new DateTime(2026, 2, 22),
                Source = "Eventbrite",
                Tags = "BEYA,STEM",
                RelevanceScore = 0.9,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Event
            {
                Title = "Black Aerospace Professionals Meetup",
                Description = "Networking event for Black professionals in aerospace and defense",
                Url = "https://example.com/bap-meetup",
                Location = "Houston, TX",
                StartDate = new DateTime(2026, 3, 15),
                EndDate = new DateTime(2026, 3, 15),
                Source = "Meetup",
                Tags = "aerospace,networking",
                RelevanceScore = 0.7,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Event
            {
                Title = "NSBE Space Exploration Panel",
                Description = "Panel discussion on space exploration opportunities",
                Url = "https://example.com/nsbe-space",
                Location = "Orlando, FL",
                StartDate = new DateTime(2026, 4, 10),
                EndDate = new DateTime(2026, 4, 10),
                Source = "WebSearch",
                Tags = "NSBE,space",
                RelevanceScore = 0.6,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        );
        db.SaveChanges();
    }
}
