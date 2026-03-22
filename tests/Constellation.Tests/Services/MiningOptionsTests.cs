using Constellation.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Constellation.Tests.Services;

public class MiningOptionsTests
{
    [Fact]
    public void Defaults_TargetTorontoMississaugaArea()
    {
        // Simulate the same registration pattern as Program.cs with no config values
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>())
            .Build();

        var services = new ServiceCollection();
        services.Configure<MiningOptions>(config.GetSection(MiningOptions.SectionName));
        services.PostConfigure<MiningOptions>(options => options.ApplyDefaults());
        var provider = services.BuildServiceProvider();

        var options = provider.GetRequiredService<IOptions<MiningOptions>>().Value;

        Assert.Equal(new List<string> { "Toronto", "Mississauga" }, options.Cities);
        Assert.Equal(43.6532, options.Latitude);
        Assert.Equal(-79.3832, options.Longitude);
        Assert.Equal(50, options.RadiusKm);
        Assert.Equal(6, options.IntervalHours);
    }

    [Fact]
    public void BindsFromConfiguration()
    {
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Mining:Cities:0"] = "Ottawa",
                ["Mining:Cities:1"] = "Gatineau",
                ["Mining:Latitude"] = "45.4215",
                ["Mining:Longitude"] = "-75.6972",
                ["Mining:RadiusKm"] = "30",
                ["Mining:IntervalHours"] = "12",
            })
            .Build();

        var services = new ServiceCollection();
        services.Configure<MiningOptions>(config.GetSection(MiningOptions.SectionName));
        services.PostConfigure<MiningOptions>(options => options.ApplyDefaults());
        var provider = services.BuildServiceProvider();

        var options = provider.GetRequiredService<IOptions<MiningOptions>>().Value;

        Assert.Equal(new List<string> { "Ottawa", "Gatineau" }, options.Cities);
        Assert.Equal(45.4215, options.Latitude);
        Assert.Equal(-75.6972, options.Longitude);
        Assert.Equal(30, options.RadiusKm);
        Assert.Equal(12, options.IntervalHours);
    }
}
