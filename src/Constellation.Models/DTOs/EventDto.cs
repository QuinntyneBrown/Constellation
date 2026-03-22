namespace Constellation.Models.DTOs;

public class EventDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public string Source { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new();
    public double RelevanceScore { get; set; }
}
