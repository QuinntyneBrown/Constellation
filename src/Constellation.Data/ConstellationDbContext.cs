using Constellation.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Constellation.Data;

public class ConstellationDbContext : DbContext
{
    public ConstellationDbContext(DbContextOptions<ConstellationDbContext> options) : base(options) { }

    public DbSet<Event> Events => Set<Event>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Url).HasMaxLength(2000);
            entity.Property(e => e.Source).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Tags).HasMaxLength(1000);
            entity.HasIndex(e => e.Url);
            entity.HasIndex(e => new { e.Title, e.StartDate });
        });
    }
}
