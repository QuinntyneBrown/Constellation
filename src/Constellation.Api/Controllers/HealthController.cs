using Microsoft.AspNetCore.Mvc;

namespace Constellation.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class HealthController : ControllerBase
{
    /// <summary>
    /// GET /health — simple health check endpoint.
    /// </summary>
    [HttpGet]
    public IActionResult GetHealth()
    {
        return Ok(new { status = "Healthy", timestamp = DateTime.UtcNow });
    }
}
