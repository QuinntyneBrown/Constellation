namespace Constellation.Models.DTOs;

public class SourceSummaryDto
{
    public string Source { get; set; } = string.Empty;
    public int EventCount { get; set; }
    public DateTime? LastSyncTime { get; set; }
}
