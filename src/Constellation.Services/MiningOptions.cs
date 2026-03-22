namespace Constellation.Services;

public class MiningOptions
{
    public const string SectionName = "Mining";

    /// <summary>
    /// Target cities for event discovery.
    /// Defaults to Toronto and Mississauga if not configured.
    /// </summary>
    public List<string> Cities { get; set; } = new();

    /// <summary>
    /// Center latitude for geographic search.
    /// </summary>
    public double Latitude { get; set; } = 43.5890;

    /// <summary>
    /// Center longitude for geographic search.
    /// </summary>
    public double Longitude { get; set; } = -79.6441;

    /// <summary>
    /// Search radius in kilometers.
    /// </summary>
    public int RadiusKm { get; set; } = 50;

    /// <summary>
    /// Interval in hours between mining runs.
    /// </summary>
    public int IntervalHours { get; set; } = 6;

    /// <summary>
    /// Applies default values for properties that require non-trivial defaults.
    /// Called after configuration binding.
    /// </summary>
    public void ApplyDefaults()
    {
        if (Cities.Count == 0)
        {
            Cities.Add("Toronto");
            Cities.Add("Mississauga");
        }
    }
}
