using Microsoft.AspNetCore.Mvc;

namespace SL.Api.Controllers;

[Route("api/shedule-lunch")]
public class ScheduleLunchController : ControllerBase
{
    private readonly ILogger<ScheduleLunchController> _logger;

    public ScheduleLunchController(ILogger<ScheduleLunchController> logger)
    {
        _logger = logger;
    }

    [HttpGet("health")]
    public IActionResult HealthCheck()
    {
        _logger.LogInformation("Health check requested at {Time}", DateTime.UtcNow);
        return Ok(new { status = "Healthy", timestamp = DateTime.UtcNow });
    }
}
